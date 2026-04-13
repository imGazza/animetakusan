import { XIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const chipVariants = cva(
  "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-xs bg-muted px-1.5 pr-0 text-xs font-medium whitespace-nowrap border",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-muted-foreground/40",
        search: "bg-filter-search/20 text-filter-search border-filter-search/40",
        year: "bg-filter-year/20 text-filter-year border-filter-year/40",
        genre: "bg-filter-genre/20 text-filter-genre border-filter-genre/40",
        season: "bg-filter-season/20 text-filter-season border-filter-season/40",
        status: "bg-filter-status/20 text-filter-status border-filter-status/40",
        format: "bg-filter-format/20 text-filter-format border-filter-format/40",
        averageScoreGreater: "bg-filter-score/20 text-filter-score border-filter-score/40"
      },
      defaultVariants: {
        variant: "default"
      },
    }
  }
)

function Chip({ children, className, variant = "default", onRemoveFilter
}:
  {
    children: React.ReactNode,
    className?: string,
    variant?: "default" | "search" | "year" | "genre" | "season" | "status" | "format" | "averageScoreGreater",
    onRemoveFilter?: () => void
  }) {
  return (
    <div
      data-slot="chip"
      className={cn(chipVariants({ variant, className }))}
    >
      {children}
      <Button onClick={onRemoveFilter} size="icon-xs" variant="ghost" className="-ml-1 opacity-50 hover:opacity-100 text-inherit hover:text-inherit" data-slot="chip-remove">
        <XIcon className="pointer-events-none text-current" />
      </Button>
    </div>
  )
}
export default Chip;