"use client";

import { cn } from "@/lib/utils";
import {
  Briefcase,
  Cpu,
  FileText,
  Layers,
  LayoutDashboard,
  Settings,
  Shield,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export function SidebarMain() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Navigation items
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vagas", href: "/vagas", icon: Briefcase },
    { name: "Aplicações", href: "/aplicacoes", icon: Layers },
    { name: "Currículo", href: "/curriculo", icon: FileText },
    { name: "Preferências", href: "/preferencias", icon: Settings },
  ];

  // Admin items
  const adminItems = [
    { name: "Scrapers", href: "/admin/scrapers", icon: Cpu },
    { name: "Cargos", href: "/admin/roles", icon: Shield },
    { name: "Aplicações", href: "/admin/aplicacoes", icon: Layers },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-trampo-border bg-white text-trampo-muted">
      {/* Sidebar Header (Logo) */}
      <SidebarHeader className={cn("flex h-16 items-center border-b border-trampo-border justify-center transition-all", isCollapsed ? "px-2" : "px-4")}>
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden h-8 w-full justify-center">
          {isCollapsed ? (
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden shrink-0">
              <Image
                src="/assets/logo-mini.svg"
                alt="Trampo Logo Icon"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          ) : (
            <Image
              src="/assets/logo-dark.png"
              alt="Trampo Logo"
              width={110}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className={cn("py-6 gap-6 transition-all", isCollapsed ? "px-2" : "px-3")}>
        {/* Main Section */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2 h-auto">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "flex items-center rounded-xl text-xs font-bold transition-all relative group border border-transparent w-full",
                        isCollapsed 
                          ? "justify-center h-8 p-0 gap-0" 
                          : "gap-3 px-3 py-2 h-10",
                        isActive
                          ? "text-trampo-primary-600 bg-trampo-primary-50 border-trampo-primary-100/50 hover:bg-trampo-primary-50 hover:text-trampo-primary-600"
                          : "text-trampo-muted hover:text-trampo-dark hover:bg-neutral-50"
                      )}
                    >
                      <Icon className={cn("size-4.5 shrink-0", isActive ? "text-trampo-primary-500" : "text-neutral-400 group-hover:text-neutral-600")} />
                      <span className={cn(isCollapsed && "hidden")}>{item.name}</span>
                      
                      {/* Active Indicator Bar */}
                      {isActive && !isCollapsed && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-trampo-primary-500 rounded-l" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {session?.user?.role?.toLocaleLowerCase() === "admin" && (
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2 h-auto">
            Administrador
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {adminItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "flex items-center rounded-xl text-xs font-bold transition-all relative group border border-transparent w-full",
                        isCollapsed 
                          ? "justify-center h-8 p-0 gap-0" 
                          : "gap-3 px-3 py-2 h-10",
                        isActive
                          ? "text-trampo-primary-600 bg-trampo-primary-50 border-trampo-primary-100/50 hover:bg-trampo-primary-50 hover:text-trampo-primary-600"
                          : "text-trampo-muted hover:text-trampo-dark hover:bg-neutral-50"
                      )}
                    >
                      <Icon className={cn("size-4.5 shrink-0", isActive ? "text-trampo-primary-500" : "text-neutral-400 group-hover:text-neutral-600")} />
                      <span className={cn(isCollapsed && "hidden")}>{item.name}</span>
                      
                      {/* Active Indicator Bar */}
                      {isActive && !isCollapsed && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-trampo-primary-500 rounded-l" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}
      </SidebarContent>

      {/* Plan Card Footer */}
      <SidebarFooter className={cn("transition-all", isCollapsed ? "p-2" : "p-3")}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#F2FCFA] border border-trampo-primary-100/60 flex items-center justify-center text-trampo-primary-600 cursor-help" title="Plano Pro Ativo: 65%">
              <Star className="size-4 fill-trampo-primary-500 text-trampo-primary-500" />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#F2FCFA] rounded-xl border border-trampo-primary-100/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-trampo-primary-600">
                Plano Pro
              </span>
              <span className="text-[9px] font-bold text-trampo-primary-500">
                Ativo
              </span>
            </div>
            <div className="h-1.5 w-full bg-trampo-primary-500/10 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-trampo-primary-500 rounded-full" style={{ width: "65%" }} />
            </div>
            <span className="text-[9px] text-trampo-muted font-semibold block">
              65% candidaturas este mês
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
