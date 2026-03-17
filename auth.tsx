import NextAuth from "next-auth"
import "next-auth/jwt"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

type LegalDocumentType = "PrivacyPolicy" | "TermsOfService"

export interface AcceptedLegalDocument {
  type: LegalDocumentType
  version: number
}

export interface LocalLoginDTO {
  username: string
  password: string
}

export interface ProviderLoginDTO {
  provider_id_token: string
}

export interface SignInDTO {
  provider: "Google" | "GitHub" | "Local"
  local_login_dto?: LocalLoginDTO
  provider_login_dto?: ProviderLoginDTO
  accepted_legal_documents?: AcceptedLegalDocument[]
}

enum AuthProviders {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials",
}

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
  interface User {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}

const providerOptions = {
  authorization: {
    params: {
      prompt: "select_account",
    },
  },
}
const providers = [
  Google(providerOptions),
  GitHub(providerOptions),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      console.log("authorize", { credentials, req })
      // You can add your own logic here to validate the credentials
      if (credentials?.username === "admin" && credentials?.password === "admin") {
        return {
          id: "1",
          name: "Admin",
        }
      }
      return null
    },
  }),
]

export const { handlers } = NextAuth({
  providers: providers,
  session: { strategy: "jwt" as const, maxAge: 15 * 60 }, // 15 minutes
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("signIn", { user, account, profile, email, credentials })
      console.log("SignIn: user", user)

      let signInDto: SignInDTO = {
        provider:
          account?.provider == AuthProviders.GOOGLE
            ? "Google"
            : account?.provider == AuthProviders.GITHUB
              ? "GitHub"
              : "Local",
        provider_login_dto:
          account?.provider != AuthProviders.CREDENTIALS
            ? {
                provider_id_token:
                  (account?.id_token as string) || (account?.access_token as string),
              }
            : undefined,
        accepted_legal_documents: [
          {
            type: "PrivacyPolicy",
            version: 1,
          },
        ],
      }

      // system auth
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin-sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signInDto),
        },
      )
        .then((res) => res.json())
        .catch((err) => {
          console.error("Auth error", err)
          return null
        })

      console.log("auth response", response)

      if (response?.success && response?.message.access_token) {
        user.accessToken = response.message.access_token
        return true
      }
      return false
    },
    async jwt({ token, user, account }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
})
