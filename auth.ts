import NextAuth from "next-auth";
import "next-auth/jwt"
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
      console.log("authorize", { credentials, req });
      // You can add your own logic here to validate the credentials
      if (credentials?.username === "admin" && credentials?.password === "admin") {
        return {
          id: "1",
          name: "Admin",
        };
      }
      return null;
    },
  })
]

export const { handlers } = NextAuth({
  providers: providers,
  session: { strategy: "jwt" as const },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", { user, account, profile, email, credentials });
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  }
});
