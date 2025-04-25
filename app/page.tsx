"use client";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (session) {
      console.log("Session data:", session);
    } else {
      console.log("No session data");
    }
  }, [session]);

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="w-full h-full flex flex-col items-start justify-start gap-8 px-4 md:px-10 overflow-y-scroll py-2">
        <section className="text-left w-full mt-6">
          <h1 className="text-4xl font-bold mb-4">Next Starter Kit</h1>
          <p className="text-lg text-muted-foreground">
            Jumpstart your Next.js app with built-in authentication, theme
            configuration, and secure session management using cookies.
          </p>
        </section>
        <Separator className="w-full max-w-full" />
        <section className="text-left w-full">
          <h2 className="text-2xl font-bold mb-4">Theme Switcher</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Use the theme switcher below to toggle between light and dark modes:
          </p>
          <ThemeSwitcher />
        </section>
        <section className="text-left w-full">
          <h2 className="text-2xl font-bold mb-4">Next Auth</h2>
          <p className="text-lg text-muted-foreground mb-4">
            This starter kit includes Next Auth for authentication. You can
            easily configure providers and callbacks in the <code>auth.ts</code>{" "}
            file.
          </p>
          <div className="flex flex-col gap-4 my-4">
            <Input
              type="text"
              placeholder="Username"
              className="w-full max-w-sm"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full max-w-sm"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <Button
              variant="default"
              onClick={() => signIn("credentials", {
                ...credentials,
                redirect: false,
              })}
              className="w-fit"
            >
              Sign In
            </Button>
          </div>
          <Button variant="outline" onClick={() => signIn("google")}>
            Sign in with Google
          </Button>
          <Button variant="outline" onClick={() => signIn("github")}>
            Sign in with GitHub
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        </section>
      </div>
    </main>
  );
}
