import { DashboardSidebar } from "@/lib/components/DashboardSidebar"
import ThemeSwitcher from "@/lib/components/ThemeSwitcher"
import { SidebarProvider, SidebarTrigger } from "@/lib/components/common/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
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
