
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface MobileNavProps {
  className?: string;
  items: { label: string; href: string, coming: boolean }[];
}

const MobileNav = ({ className, items }: MobileNavProps) => {

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("flex items-center", className)}>
          <Button variant="ghost" size="icon" className="extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0">
            {/* { open ?
                <X className="size-5 transition-all duration-100" /> :
                <Menu className="size-5 transition-all duration-100" />
            } */}

            <div className="relative size-5">
              <Menu className={cn("absolute size-5 transition-all duration-100", open && "rotate-180 opacity-0")} />
              <X className={cn("absolute size-5 transition-all duration-100", !open && "-rotate-180 opacity-0")} />
            </div>

          </Button>
          Menu
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/80 no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div className={cn("flex gap-3", item.coming && "text-muted-foreground")} key={index}>
                <div>{item.label}</div> {item.coming && <div><Badge variant="outline">Coming soon</Badge></div>}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default MobileNav;