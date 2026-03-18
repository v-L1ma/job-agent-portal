"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-medium text-slate-500">Tema</span>
        <div className="h-8 w-14 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Modo Noturno</span>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "group relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus-visible:outline-hidden",
          "bg-gray-100 dark:bg-slate-800"
        )}
      >
        <span className="sr-only">Toggle theme</span>
        
        {/* Icons positioned as references in the background */}
        <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
          <Sun className={cn("h-3.5 w-3.5 transition-all", isDark ? "text-slate-600" : "text-white opacity-0")} />
          <Moon className={cn("h-3.5 w-3.5 transition-all", isDark ? "text-white opacity-0" : "text-slate-500")} />
        </div>

        {/* The sliding white circle */}
        <div
          className={cn(
            "z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 ease-in-out transform",
            isDark ? "translate-x-7" : "translate-x-1"
          )}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-slate-900 fill-slate-900" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
          )}
        </div>
      </button>
    </div>
  );
}
