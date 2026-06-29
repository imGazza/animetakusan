import { LibraryBig, Compass, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeaderVariant = "library" | "browse" | "profile";

const VARIANT_CONFIG: Record<
  PageHeaderVariant,
  { Icon: typeof LibraryBig; colorVar: string }
> = {
  library: {
    Icon: LibraryBig,
    colorVar: "var(--accent-library)",
  },
  browse: {
    Icon: Compass,
    colorVar: "var(--accent-browse)",
  },
  profile: {
    Icon: UserRound,
    colorVar: "var(--accent-profile)",
  },
};

const PageHeaderBlock = ({
  variant,
  title,
  className,
}: {
  variant: PageHeaderVariant;
  title: string;
  className?: string;
}) => {
  const { Icon, colorVar } = VARIANT_CONFIG[variant];

  return (
    <div className={cn("flex flex-col gap-1.5 mb-4", className)}>
      <div className="flex items-center gap-2.5">
        <Icon
          className="h-7 w-7 shrink-0"
          style={{ color: colorVar }}
          strokeWidth={1.75}
        />
        <h1 className="text-3xl text-primary font-bold tracking-tight">{title}</h1>
      </div>
    </div>
  );
};

export default PageHeaderBlock;
export type { PageHeaderVariant };