"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Settings,
  Zap,
  SlidersHorizontal,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vagas", href: "/vagas", icon: Briefcase },
    { name: "Respostas", href: "/respostas", icon: MessageSquare },
    { name: "Preferências", href: "/preferencias", icon: SlidersHorizontal },
    { name: "Plataformas", href: "/plataformas", icon: Globe },
  ];

  return (
    <aside
      className={cn(
        "border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-slate-950 flex flex-col shrink-0 h-full transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-primary/20 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors z-50 text-slate-400 hover:text-primary"
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className={cn("p-6 flex items-center gap-3", isCollapsed && "justify-center px-0")}>
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300 overflow-hidden">
            <h1 className="text-lg font-bold leading-tight truncate">AutoApply</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Gerenciador de Vagas
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-all",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "text-primary bg-primary/15 border-r-[3px] border-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/10"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        {!isCollapsed ? (
          <div className="p-4 bg-primary/10 rounded-lg animate-in fade-in zoom-in-95 duration-300">
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
              Plano Pro
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              158 candidaturas este mês
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-3/4"></div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-1.5 bg-primary/20 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-3/4"></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
