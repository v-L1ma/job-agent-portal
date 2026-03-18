"use client";

import { Bell, Search, User, LogOut, Menu, Sun, Moon, Monitor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggleSwitch } from "@/components/theme-toggle-switch";

interface HeaderProps {
  title: string;
  onToggleSidebar?: () => void;
}

export function Header({ title, onToggleSidebar }: HeaderProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-primary/20 bg-white dark:bg-slate-950 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors text-slate-600 dark:text-slate-400"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 relative transition-colors hover:bg-slate-200 dark:hover:bg-primary/20">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer hover:opacity-80 transition-opacity outline-none">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-semibold px-3 py-2 text-xs text-slate-500 uppercase tracking-wider">Conta</DropdownMenuLabel>
              <DropdownMenuItem className="p-0">
                <Link href="/perfil" className="flex items-center gap-3 w-full px-3 py-2 cursor-pointer">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Ver Perfil</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-1" />
              
              <ThemeToggleSwitch />

              <DropdownMenuSeparator className="my-1" />
              
              <DropdownMenuItem variant="destructive" className="cursor-pointer flex items-center gap-3 px-3 py-2 text-red-500">
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
