"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";

const Auth = () => {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <div className="w-full min-h-full">
      <h1 className="text-4xl font-bold mt-5">Auth</h1>
      <section className="text-left w-full mt-5">
        <p className="text-lg text-muted-foreground mb-4">
          This starter kit includes Next Auth for authentication. You can easily
          configure providers and callbacks in the <code>auth.ts</code> file.
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
            onClick={() =>
              signIn("credentials", {
                ...credentials,
                redirect: false,
              })
            }
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
  );
};

export default Auth;
