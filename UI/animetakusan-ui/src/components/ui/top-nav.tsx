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
        items.map((item, index) => (
          <Button 
            key={index}
            variant="ghost"
            className={item.coming ? "text-muted-foreground cursor-default" : ""}
          >
            <Link to={item.href} className={item.coming ? "text-muted-foreground cursor-default" : ""}>
              {item.label}
            </Link>
            {item.coming && <div><Badge variant="outline">Coming soon</Badge></div>}
          </Button>
        ))
      }
    </nav>
  );
}
export default TopNav;