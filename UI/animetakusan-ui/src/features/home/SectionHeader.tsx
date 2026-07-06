import { Link } from "react-router";

interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: { label: string; href: string };
}

const SectionHeader = ({ title, count, action }: SectionHeaderProps) => (
  <div className="mb-3 flex items-baseline justify-between gap-4">
    <h2 className="flex items-baseline gap-2 text-md font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
      {count != null && count > 0 && (
        <span className="text-xs font-medium tabular-nums text-muted-foreground/60">{count}</span>
      )}
    </h2>
    {action && (
      <Link
        to={action.href}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        {action.label}
      </Link>
    )}
  </div>
);

export default SectionHeader;
