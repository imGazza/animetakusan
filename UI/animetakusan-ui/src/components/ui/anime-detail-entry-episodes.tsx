import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { Minus, Plus } from "lucide-react";

const AnimeDetailEntryEpisodes = ({ progress, setProgress, episodes }: { progress: number, setProgress: (progress: number) => void, episodes: number | null }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground text-sm">Episodes progress</div>
      <InputGroup className="rounded-xs">
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            aria-label="Decrease progress"
            title="Decrease progress"
            size="icon-xs"
            onClick={() => setProgress(progress - 1)}
          >
            <Minus />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          type="number"
          className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={progress} 
          onChange={(e) => setProgress(Number(e.target.value))}
        />
        <InputGroupAddon align="inline-end">
          <div className="text-muted-foreground/60">
            {`/ ${episodes ?? "?"}`}
          </div>
          <InputGroupButton
            aria-label="Increase progress"
            title="Increase progress"
            size="icon-xs"
            onClick={() => setProgress(progress + 1)}
          >
            <Plus />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
export default AnimeDetailEntryEpisodes;