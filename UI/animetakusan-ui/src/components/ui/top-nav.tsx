import { Link } from "react-router";
import { Button } from "./button";
import { Badge } from "./badge";

interface TopNavProps {
  items: { label: string; href: string; coming: boolean }[];
}

const TopNav = ({ items }: TopNavProps) => {
  return (
    <nav className="px-4">
      {
        items.map((item, index) =>
          item.coming ? (
            <Button
              key={index}
              variant="ghost"
              className="text-muted-foreground cursor-default"
              disabled
            >
              {item.label}
              <Badge variant="outline">Coming soon</Badge>
            </Button>
          ) : (
            <Button key={index} variant="ghost" asChild>
              <Link to={item.href}>{item.label}</Link>
            </Button>
          )
        )
      }
    </nav>
  );
}
export default TopNav;