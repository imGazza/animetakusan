import { cn } from "@/lib/utils";
import { BookCheck, Clock3, Pause, Play, Repeat, X } from "lucide-react";
import { ItemContent, ItemTitle, ItemDescription, Item } from "./item";

const animeMediaStatusOptions = [
  { value: "PLANNING", label: "Planning", icon: Clock3 },
  { value: "CURRENT", label: "Watching", icon: Play },
  { value: "COMPLETED", label: "Completed", icon: BookCheck },
  { value: "PAUSED", label: "Paused", icon: Pause },
  { value: "DROPPED", label: "Dropped", icon: X },
  { value: "REPEATING", label: "Repeating", icon: Repeat },
]

const AnimeDetailEntryStatus = ({ status, setStatus }: { status: string | null, setStatus: (status: string) => void }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground text-sm">Status</div>
      <div className="grid grid-cols-3 gap-2">
        {animeMediaStatusOptions.map(option => {
          const isSelected = status === option.value;
          return (
            <Item
              key={option.value}
              variant="outline"
              className={cn(
                "text-muted-foreground rounded-xs cursor-pointer transition-colors hover:bg-muted/80",
                isSelected && "bg-accent/10 border-accent text-accent hover:bg-accent/10"
              )}
              onClick={() => setStatus(option.value)}
            >
              <ItemContent className="items-center">
                <ItemTitle>
                  <option.icon className="size-5" />
                </ItemTitle>
                <ItemDescription className={cn(isSelected && "text-accent")}>
                  {option.label}
                </ItemDescription>
              </ItemContent>
            </Item>
          );
        })}
      </div>
    </div>
  )
}
export default AnimeDetailEntryStatus;