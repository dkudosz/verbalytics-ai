"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Bot, Settings, FileText, UserCircle, Cog, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Agents",
    url: "/dashboard/agents",
    icon: Bot,
  },
  {
    title: "Configuration",
    url: "/dashboard/configuration",
    icon: Settings,
  },
  {
    title: "Transcripts",
    url: "/dashboard/transcripts",
    icon: FileText,
  },
];

const accountItems = [
  {
    title: "Account",
    url: "/account",
    icon: UserCircle,
  },
  {
    title: "Settings",
    url: "/account/settings",
    icon: Cog,
  },
  {
    title: "Support",
    url: "/account/support",
    icon: HelpCircle,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <Link href="/dashboard" className="block">
                <h2 className="text-lg font-semibold hover:text-primary transition-colors">Dashboard</h2>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "w-full justify-start",
                            isActive && "bg-secondary"
                          )}
                        >
                          <Link href={item.url}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "w-full justify-start",
                            isActive && "bg-secondary"
                          )}
                        >
                          <Link href={item.url}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}






