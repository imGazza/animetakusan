import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";
import type { Platform } from "./platforms";

interface PlatformCardProps {
  platform: Platform;
  connected: boolean;
}

const PlatformCard = ({ platform, connected }: PlatformCardProps) => {
  const { name, description, brand, brandTo, Logo, authUrl } = platform;

  const handleConnect = () => {
    window.location.href = authUrl;
  };

  return (
    <Card
      className={cn(
        "relative gap-0 overflow-hidden rounded-xs py-0 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-md",
        connected ? "border-border" : "hover:border-foreground/20"
      )}
    >
      {/* Brand glow accent in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
        style={{ backgroundColor: brand }}
      />

      <CardHeader className="flex items-start gap-4 p-5 pb-4">
        {/* Logo tile */}
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xs text-white shadow-sm ring-1 ring-black/5"
          style={{ backgroundImage: `linear-gradient(140deg, ${brand}, ${brandTo})` }}
        >
          <Logo className="size-7" />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{name}</CardTitle>
            {connected && (
              <span className="inline-flex items-center gap-1 rounded-xs bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="size-3" strokeWidth={3} />
                Connected
              </span>
            )}
          </div>
          <CardDescription className="text-pretty leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="border-t bg-muted/30 p-4">
        {connected ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Account linked and syncing
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            className="w-full text-white hover:opacity-90"
            style={{ backgroundImage: `linear-gradient(120deg, ${brand}, ${brandTo})` }}
          >
            Connect {name}
            <ExternalLink className="size-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformCard;
