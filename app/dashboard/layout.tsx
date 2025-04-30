import { AppSidebar } from "@/components/AppSidebar"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2">
        <div className="w-full h-8 flex justify-between items-center">
          <SidebarTrigger />
          <ThemeSwitcher />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}