"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
