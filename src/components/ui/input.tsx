import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = {
  icon?: React.ReactNode
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function Input({ className, type, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "pr-10 file:text-foreground placeholder:text-muted-foreground selection:bg-gray-400 selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent pl-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary-500 focus-visible:ring-primary-500/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />

      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">{icon}</div>
      )}
    </div>
  )
}

export { Input }
