import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Button } from "./button";

const COLLAPSED_HEIGHT = 100;

const AnimeBodySynopsis = ({ description }: { description: string }) => {

  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setSynopsisExpanded((prev) => !prev);
  };

  const height = synopsisExpanded
    ? (contentRef.current?.scrollHeight ?? COLLAPSED_HEIGHT)
    : COLLAPSED_HEIGHT;

  return (
    <div className="flex flex-col p-4 pb-0 border bg-muted">
      <div
        ref={contentRef}
        style={{ height }}
        className={cn(
          "relative flex flex-col gap-2 overflow-hidden transition-[height] duration-300 ease-in-out"
        )}
      >
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-12 pointer-events-none transition-opacity duration-300",
            "bg-linear-to-b from-transparent to-muted",
            synopsisExpanded ? "opacity-0" : "opacity-100"
          )}
        />
        <div className="font-semibold text-xs text-muted-foreground/50 uppercase tracking-widest">
          Synopsis
        </div>
        <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm tracking-wide text-balance" />
      </div>
      <Button
        onClick={handleToggle}
        variant="ghost"
        className="text-xs tracking-wider p-0"
      >
        {synopsisExpanded ? "Read less" : "Read more"}
      </Button>
    </div>
  )
}
export default AnimeBodySynopsis;