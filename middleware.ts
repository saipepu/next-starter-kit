import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const secret = process.env.AUTH_SECRET

const pageProtectedRoutes = ["/dashboard"]
const apiProtectedRoutes = ["/api/admin"]


export async function middleware(req: NextRequest) {
  console.log("MIDDLEWARE RUNNING:", req.nextUrl.pathname);
  const pathname = req.nextUrl.pathname

  const isPageProtected = pageProtectedRoutes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  const isApiProtected = apiProtectedRoutes.some((prefix) => pathname.startsWith(prefix))

  const nextAuthToken = await getToken({ req, secret })
  const isValidSession = !!nextAuthToken

  const authHeader = req.headers.get("authorization")
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "").trim()
    : null
  console.log("Bearer Token:", bearerToken)

  const isValidBearer = bearerToken !== null

  if (isPageProtected) {
    if (!isValidSession) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  if (isApiProtected) {
    if (!isValidSession && !isValidBearer) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
