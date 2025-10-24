import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "relative size-4 rounded-sm border border-gray-400 bg-white cursor-pointer",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "after:content-[''] after:absolute after:inset-[2px] after:rounded-[3px]",
        "after:bg-primary after:opacity-0 after:transition-opacity",
        "data-[state=checked]:after:opacity-100",

        className
      )}
      {...props}
    />
  );
}

export { Checkbox };
