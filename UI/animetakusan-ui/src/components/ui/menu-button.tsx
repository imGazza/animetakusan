import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const menuButtonVariants = cva(
  "cursor-pointer transition-colors duration-150 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        tile: "flex flex-col items-center justify-center gap-2 h-[4.5rem] rounded-xs px-1 text-muted-foreground hover:bg-popover-accent",
        action: "w-full flex items-center gap-2.5 rounded-xs px-2 py-1.5 text-destructive hover:bg-popover-accent",
      },
    },
    defaultVariants: {
      variant: "tile",
    },
  }
)

function MenuButton({
  className,
  variant,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof menuButtonVariants>) {
  return (
    <button
      data-slot="menu-button"
      className={cn(menuButtonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { MenuButton, menuButtonVariants }
