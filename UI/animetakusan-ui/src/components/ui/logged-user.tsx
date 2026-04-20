import { type ForwardRefExoticComponent, type RefAttributes } from "react";
import { Button } from "./button";
import { LogIn, type LucideProps } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "./user-avatar";

const LoggedUser = ({ menuItems }: { menuItems: { label: string, icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> }[] }) => {

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    isAuthenticated ? (
      <UserAvatar items={menuItems} user={user} logout={logout} />
    ) : (
      <Button variant="ghost" size="sm" className="text-sm rounded-xs" onClick={() => navigate("/login", { replace: true })}>
        <LogIn />
        Sign In
      </Button>
    )
  )
}
export default LoggedUser;