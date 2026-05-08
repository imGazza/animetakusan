import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";

const COLLAPSED_HEIGHT = 100;

const AnimeBodySynopsis = ({ description }: { description: string }) => {

  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {    
    const el = contentRef.current;
    if (!el) return;
    setNeedsCollapse(el.scrollHeight > COLLAPSED_HEIGHT);
  }, [description]);

  const handleToggle = () => {
    setSynopsisExpanded((prev) => !prev);
  };

  const height = !needsCollapse
    ? undefined
    : synopsisExpanded
      ? (contentRef.current?.scrollHeight ?? COLLAPSED_HEIGHT)
      : COLLAPSED_HEIGHT;

  return (
    <div className={cn("flex flex-col p-4 pb-0 border bg-muted", !needsCollapse && "pb-4")}>
      <div
        ref={contentRef}
        style={{ height }}
        className={cn(
          "relative flex flex-col gap-2 overflow-hidden transition-[height] duration-300 ease-in-out"
        )}
      >
        {needsCollapse && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-12 pointer-events-none transition-opacity duration-300",
              "bg-linear-to-b from-transparent to-muted",
              synopsisExpanded ? "opacity-0" : "opacity-100"
            )}
          />
        )}
        <div className="font-semibold text-xs text-muted-foreground/50 uppercase tracking-widest">
          Synopsis
        </div>
        <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm tracking-wide text-balance" />
      </div>
      {needsCollapse && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="text-xs tracking-wider p-0"
        >
          {synopsisExpanded ? "Read less" : "Read more"}
        </Button>
      )}
    </div>
  )
}
export default AnimeBodySynopsis;