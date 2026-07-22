"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();


  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="flex h-16 w-full items-center justify-between px-6 border-b border-trampo-border bg-white/80 backdrop-blur-md sticky top-0 select-none">
      <SidebarTrigger className="-ml-1 text-trampo-muted hover:text-trampo-dark hover:bg-neutral-50 rounded-lg cursor-pointer" />

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-neutral-50 text-trampo-muted hover:text-trampo-dark transition-colors cursor-pointer border border-transparent hover:border-trampo-border">
          <Bell className="size-4.5" />
          {/* Notification Badge indicator dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-trampo-primary-500 ring-2 ring-white" />
        </button>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
            <Avatar className="w-8 h-8 border border-neutral-200 hover:border-trampo-primary-500 transition-colors">
              <AvatarImage src="" alt={session?.user?.name || "User Avatar"} />
              <AvatarFallback className="bg-trampo-primary-500/10 text-trampo-primary-500 text-xs font-bold border border-trampo-primary-500/20">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-trampo-border text-trampo-dark"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-bold text-xs text-trampo-dark">
                Minha Conta
              </DropdownMenuLabel>
              <div className="px-2 py-1.5 text-[10px] text-trampo-muted font-semibold truncate">
                {session?.user?.email}
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-trampo-border" />
            <DropdownMenuItem className="focus:bg-neutral-50 focus:text-trampo-dark cursor-pointer gap-2 py-2 text-xs font-semibold">
              <User className="size-4 text-trampo-muted" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-neutral-50 focus:text-trampo-dark cursor-pointer gap-2 py-2 text-xs font-semibold">
              <Settings className="size-4 text-trampo-muted" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-trampo-border" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="focus:bg-red-500/5 focus:text-red-600 cursor-pointer text-red-500 gap-2 py-2 text-xs font-semibold"
            >
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
