"use client";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="w-full h-full flex flex-col items-start justify-start gap-8 px-4 md:px-10 overflow-y-scroll py-2">
        <section className="text-left w-full mt-6">
          <h1 className="text-4xl font-bold mb-4">Next Starter Kit</h1>
          <p className="text-lg text-muted-foreground">
            Jumpstart your Next.js app with built-in authentication, theme configuration,
            and secure session management using cookies.
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
      </div>
    </main>
  );
}