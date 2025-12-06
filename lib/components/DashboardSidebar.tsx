"use client"

import {
  ChevronDown,
  ChevronRight,
  LibraryBig,
  Newspaper,
  Sparkle,
  UserLock,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/lib/components/common/sidebar"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/components/common/collapsible"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/lib/components/common/button"

const items = [
  {
    title: "For Developer",
    icon: LibraryBig,
    children: [
      {
        title: "Getting Started",
        url: "/dashboard/get-started",
        icon: Sparkle,
      },
      {
        title: "Guidelines",
        url: "/dashboard/guidelines",
        icon: Newspaper,
      },
    ],
  },
  {
    title: "Admins",
    url: "/dashboard/admins",
    icon: UserLock,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent className="bg-background">
        <SidebarGroup className="font-medium space-y-5 h-full">
          <SidebarGroupLabel className="text-2xl">Next Start Kit</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-auto"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}

const SidebarItem = ({
  item,
  pathname,
}: {
  item: {
    title: string
    url?: string
    icon: React.ComponentType<any>
    children?: Array<{
      title: string
      url: string
      icon: React.ComponentType<any>
    }>
    disabled?: boolean
  }
  pathname: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(pathname.includes(item.url || ""))
  return (
    <SidebarMenuItem key={item.title}>
      <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            asChild
            disabled={true}
            className={`
              cursor-pointer
              ${item.disabled ? "pointer-events-none opacity-20" : ""}
              ${
                item.url == pathname ? "bg-accent text-accent-foreground" : ""
              } duration-300 transition-all ease-in-out rounded-md p-2 flex items-center gap-2 cursor-pointer`}
          >
            {item.children ? (
              <p>
                <item.icon />
                <span>{item.title}</span>
                {isCollapsed ? (
                  <ChevronDown className="ml-auto" />
                ) : (
                  <ChevronRight className="ml-auto" />
                )}
              </p>
            ) : (
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map(
              (child: {
                title: string
                url: string
                icon: React.ComponentType<any>
                disabled?: boolean
              }) => (
                <SidebarMenuSubItem key={child.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                    cursor-pointer
                    ${child.disabled ? "pointer-events-none opacity-20" : ""}
                    ${
                      child.url == pathname ? "bg-accent text-accent-foreground" : ""
                    } duration-300 transition-all ease-in-out rounded-md p-2 flex items-center gap-2`}
                  >
                    <a href={child.url}>
                      <child.icon />
                      <span>{child.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              )
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
