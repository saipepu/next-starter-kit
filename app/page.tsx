"use client"
import { Button } from "@/lib/components/common/button"
import { LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <main className="w-full h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-xs md:max-w-sm p-8 bg-background border border-border rounded-lg shadow-md space-y-6">
        <div className="text-center flex justify-center flex-col items-center">
          <h1 className="text-2xl font-semibold">Welcome to Next Start Kit</h1>
          <p className="w-fit rounded-full px-2 bg-gray-800 text-sm text-muted-foreground mt-2">{status}</p>
        </div>

        {session ? (
          <div className="text-left">
            <p className="text-xs text-muted-foreground mt-2">You are signed in as</p>
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={session.user?.image ?? "https://via.placeholder.com/150"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground">{session.user?.email}</p>
              </div>
              <Button
                variant="ghost"
                className="ml-auto cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="default"
              className="w-full mt-4 cursor-pointer"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full cursor-pointer"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
