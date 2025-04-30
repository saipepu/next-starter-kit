"use client";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <main className="w-full h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-xs md:max-w-sm p-8 bg-background border border-border rounded-lg shadow-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>
        </div>

        {session ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mt-1">
              You are signed in as {session.user?.email}
            </p>
            <Button
              variant="default"
              className="w-full mt-4"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
