import { cn } from "@/lib/utils";
import { Button } from "./button";

const values = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const FilterNumber = ({ value, onChange, title }: { value: number | null, onChange?: (value: number | null) => void, title: string }) => {

  return (
    <>
      <div className="text-sm">{title}</div>
      <div
        className="flex items-center gap-1 rounded-xs bg-transparent p-0.5 border border-border/50 w-fit"
      >
        {values.map((v) => {
          const isSelected = v === value;
          return (
            <Button
              key={v}
              onClick={() => onChange?.(isSelected ? null : v)}
              className={cn(
                "bg-transparent hover:bg-muted z-10 flex h-8 w-8 items-center justify-center rounded-xs text-xs font-medium",
                isSelected
                  ? "bg-accent hover:bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v}
            </Button>
          )
        })}
      </div>
    </>
  )
}
export default FilterNumber;
