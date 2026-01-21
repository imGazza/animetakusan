import { Link } from "react-router";
import { Button } from "./button";

interface TopNavProps {
  items: { label: string; href: string }[];
}

const TopNav = ({ items }: TopNavProps) => {
  return (
    <nav className="px-4">
      {
        items.map((item) => (
          <Button 
            key={item.href}            
            variant="ghost"
          >
            <Link to={item.href}>
              {item.label}
            </Link>
          </Button>
        ))
      }
    </nav>
  );
}
export default TopNav;