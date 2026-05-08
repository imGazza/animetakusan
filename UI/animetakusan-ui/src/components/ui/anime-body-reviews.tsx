import { useState } from "react";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Card, CardContent } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { ExternalLink, ThumbsDown, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { cn, scoreBadgeClass } from "@/lib/utils";

const INITIAL_VISIBLE = 6;

const AnimeBodyReviews = ({ anime }: { anime: AnimeDetail }) => {
  const [showAll, setShowAll] = useState(false);

  if (anime.reviews.length === 0) return null;

  const hasMore = anime.reviews.length > INITIAL_VISIBLE;
  const visibleReviews = showAll ? anime.reviews : anime.reviews.slice(0, INITIAL_VISIBLE);
  const hiddenCount = anime.reviews.length - INITIAL_VISIBLE;

  return (
    <div className="flex flex-col gap-3 bg-muted border p-3 px-4">
      <div className="px-1 font-semibold text-xs text-muted-foreground/50 uppercase tracking-widest">
        Reviews <span className="text-muted-foreground/30 normal-case font-normal">({anime.reviews.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {visibleReviews.map((review, index) => (
          <Card
            key={index}
            onClick={() => window.open(review.siteUrl, "_blank")}
            className="justify-between cursor-pointer bg-popover-accent/50 hover:bg-popover-accent/80 transition-colors border-border/50 rounded-xs px-4 py-3 gap-3 group"
          >
            <div className="flex items-start gap-3">
              <Avatar size="sm" className="shrink-0 mt-0.5">
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-medium truncate">{review.user.name}</span>
                  <Badge className={cn("shrink-0 rounded-xs border px-1.5 py-0 text-xs font-bold", scoreBadgeClass(review.score))}>
                    {review.score}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed">
                  "{review.summary}"
                </p>
              </div>
            </div>

            <CardContent className="px-0 pb-0 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="size-3 text-emerald-500" />
                  {review.rating}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="size-3 text-red-500" />
                  {review.ratingAmount - review.rating}
                </span>
              </div>
              <ExternalLink className="size-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll((v) => !v)}
          className="self-center text-xs text-muted-foreground hover:text-muted-foreground gap-1.5 h-7"
        >
          {showAll ? (
            <>Show less <ChevronUp className="size-3" /></>
          ) : (
            <>Show {hiddenCount} more review{hiddenCount !== 1 ? "s" : ""} <ChevronDown className="size-3" /></>
          )}
        </Button>
      )}
    </div>
  );
};

export default AnimeBodyReviews;