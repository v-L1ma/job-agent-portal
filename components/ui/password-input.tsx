"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">
          lock
        </span>
      </div>
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-4 top-2 text-outline hover:text-primary transition-colors focus:outline-none"
        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
      >
        <span className="material-symbols-outlined text-lg leading-none">
          {showPassword ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}
