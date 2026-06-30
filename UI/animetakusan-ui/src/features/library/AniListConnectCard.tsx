import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { platforms } from "@/features/profile/platforms";
import { ExternalLink, ListChecks, RefreshCw, Star } from "lucide-react";

const anilist = platforms.find((p) => p.key === "AniList")!;

const benefits = [
  { Icon: ListChecks, label: "Import your watchlists & statuses" },
  { Icon: Star, label: "Keep your scores in sync" },
  { Icon: RefreshCw, label: "Track episode progress" },
];

const AniListConnectCard = () => {
  const { name, brand, brandTo, Logo, authUrl } = anilist;

  return (
    <div className="mt-10 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="relative w-full max-w-md overflow-hidden rounded-xs border-border/60 py-0 text-center">
        <div className="relative flex flex-col items-center gap-5 p-8">
          <div
            className="flex size-16 items-center justify-center rounded-xs text-white shadow-md ring-1 ring-black/5"
            style={{ backgroundImage: `linear-gradient(140deg, ${brand}, ${brandTo})` }}
          >
            <Logo className="size-9" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Connect your {name} account
            </h2>
            <p className="mx-auto max-w-xs text-balance text-sm text-muted-foreground">
              Link {name} to bring your anime library into Anime Takusan.
            </p>
          </div>

          <ul className="flex w-full max-w-xs flex-col gap-3 text-left">
            {benefits.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-foreground/90">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-xs"
                  style={{ backgroundColor: `${brand}1A`, color: brand }}
                >
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <Button
            onClick={() => {
              window.location.href = authUrl;
            }}
            className="mt-1 w-full max-w-xs text-white hover:opacity-90"
            style={{ backgroundImage: `linear-gradient(120deg, ${brand}, ${brandTo})` }}
          >
            Connect {name}
            <ExternalLink className="size-4" />
          </Button>          
        </div>
      </Card>
    </div>
  );
};

export default AniListConnectCard;
