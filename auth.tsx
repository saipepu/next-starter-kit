import NextAuth from "next-auth"
import "next-auth/jwt"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import {
  AuthMethods,
  SignInRequestDto,
  SignInResponseDto,
} from "./lib/domain/models/AuthModel"
import { postRequest } from "./lib/domain/api/NetworkManager"
import admins from '@/lib/domain/mock-data/admins.json'

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error: string | undefined
    refreshToken?: string
  }
  interface User {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresIn?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresIn?: number
    error?: string
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

async function SignIn(signInDto: SignInRequestDto): Promise<SignInResponseDto> {
  let response: SignInResponseDto = await postRequest<SignInResponseDto>(
    "/auth",
    signInDto
  )

  return {
    success: response?.success || false,
    message: response?.message || {},
  }
}

async function MockSignIn(signInDto: SignInRequestDto): Promise<SignInResponseDto> {
  console.log("Mock sign in")

  if(admins.find(admin => admin.email === signInDto.email) === undefined) {
    return {
      success: false,
      message: {
        access_token: "",
        refresh_token: "",
        access_token_expires_in: 0,
      },
    }
  }

  return {
    success: true,
    message: {
      access_token: "mock_access_token_123",
      refresh_token: "mock_refresh_token_123",
      access_token_expires_in: 5,
    },
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log("Refreshing access token...")
  try {
    const res = await postRequest<any>("/auth/renew-access-token", {
      refresh_token: token.refreshToken,
    })

    const data = await res.json()

    if (!data?.success) {
      throw new Error("Failed to refresh access token")
    }

    return {
      ...token,
      accessToken: data.message.access_token,
      refreshToken: data.message.refresh_token ?? token.refreshToken,
      accessTokenExpiresIn: data.message.access_token_expires_in, // 1h
    }
  } catch (err) {
    console.error("Refresh token error:", err)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

async function MockRefreshAccessToken(token: JWT): Promise<JWT> {
  console.log("Mock refresh access token")

  return {
    ...token,
    accessToken: `mock_access_token_refreshed_${Math.floor(Math.random() * 1000)}`,
    refreshToken: "mock_refresh_token_refreshed_789",
    accessTokenExpiresIn: new Date().getTime() + 10 * 1000, // 10 seconds
  }
}

export const { handlers } = NextAuth({
  providers: providers,
  session: { strategy: "jwt" as const },
  callbacks: {
    async signIn({ user, account, credentials }) {
      let signInDto: SignInRequestDto = {
        method: AuthMethods.Google,
        email: user.email || "",
        providerToken: account?.access_token || "",
      }
      const response = await MockSignIn(signInDto)

      if (response?.success && response?.message.access_token) {
        user.accessToken = response.message.access_token
        user.refreshToken = response.message.refresh_token
        user.accessTokenExpiresIn =
          Date.now() + response.message.access_token_expires_in * 1000
        return true
      }

      return false
    },
    async jwt({ token, user }) {
      // First pass: after OAuth
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpiresIn = user.accessTokenExpiresIn
        return token
      }

      const isExpired = Date.now() > (token.accessTokenExpiresIn as number)

      if (!isExpired) {
        return token
      }

      const tk = await MockRefreshAccessToken(token)
      console.log("Refreshed token:", tk)
      return tk
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.accessToken = token.accessToken as string
        session.error = token.error as string | undefined
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
})
