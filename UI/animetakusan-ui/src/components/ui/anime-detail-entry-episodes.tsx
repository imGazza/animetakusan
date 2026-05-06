import type { Anime } from "@/models/common/Anime";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { Minus, Plus } from "lucide-react";

const AnimeDetailEntryEpisodes = ({ anime }: { anime: Anime }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground text-sm">Episodes progress</div>
      <InputGroup className="rounded-xs">
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => { }}
          >
            <Minus />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput className="text-center" value={anime.mediaListEntry?.progress ?? 0} />
        <InputGroupAddon align="inline-end">
          <div className="text-muted-foreground/60">
            {`/ ${anime.episodes || "?"}`}
          </div>
          <InputGroupButton
            size="icon-xs"
            onClick={() => { }}
          >
            <Plus />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
export default AnimeDetailEntryEpisodes;