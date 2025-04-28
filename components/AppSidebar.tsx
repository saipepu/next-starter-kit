"use client";

import {
  Calendar,
  CloudDownload,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  Sparkle,
  SunMoon,
  UserLock,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Introduction",
    url: "/docs",
    icon: Sparkle,
  },
  {
    title: "Dashboard",
    url: "/docs/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Theme",
    url: "/docs/theme",
    icon: SunMoon,
  },
  {
    title: "Auth",
    url: "/docs/auth",
    icon: UserLock,
  },
  {
    title: "Image Upload",
    url: "/docs/image-upload",
    icon: Image,
  },
  {
    title: "Deployment",
    url: "/docs/deployment",
    icon: CloudDownload,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent className="bg-background">
        <SidebarGroup className="font-medium">
          <SidebarGroupLabel>Next Starter Kit</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      item.url === pathname
                        ? "bg-accent text-accent-foreground"
                        : ""
                    } duration-300 transition-all ease-in-out rounded-md p-2 flex items-center gap-2`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
