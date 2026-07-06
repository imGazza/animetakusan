import { Compass, LibraryBig, LogIn, LogOut, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { MenuButton } from "./menu-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

const PROFILE_COLOR = "var(--accent-profile)";
const DEFAULT_AVATAR = "/images/default-avatar.svg";

const tabBase =
  "group relative flex flex-1 flex-col items-center justify-center gap-1 pt-1 pb-0.5 touch-manipulation";

// Neutralize the Button's default height/rounding/horizontal padding so it keeps the tab layout.
const tabButton = cn(tabBase, "h-auto rounded-none px-0 has-[>svg]:px-0");

const DEFAULT_STROKE = { active: 2.25, inactive: 1.75 } as const;

interface NavTab {
  label: string;
  href: string;
  Icon: typeof Compass;
  colorVar: string;
  stroke?: { active: number; inactive: number };
}

const NAV_TABS: NavTab[] = [
  { label: "Browse", href: "/browse", Icon: Compass, colorVar: "var(--accent-browse)" },
  { label: "Library", href: "/library", Icon: LibraryBig, colorVar: "var(--accent-library)", stroke: { active: 1.9, inactive: 1.5 } },
];

const ActiveIndicator = ({ active, color }: { active: boolean; color: string }) => (
  <span
    className={cn(
      "absolute top-0 h-0.5 w-8 rounded-full transition-opacity duration-200",
      active ? "opacity-100" : "opacity-0"
    )}
    style={{ backgroundColor: color }}
  />
);

const NavItem = ({ label, href, Icon, colorVar, stroke = DEFAULT_STROKE }: NavTab) => (
  <NavLink to={href} className={tabBase}>
    {({ isActive }) => (
      <>
        <ActiveIndicator active={isActive} color={colorVar} />
        <Icon
          className={cn(
            "size-5 transition-colors duration-200",
            !isActive && "text-muted-foreground group-active:text-foreground"
          )}
          style={isActive ? { color: colorVar } : undefined}
          strokeWidth={isActive ? stroke.active : stroke.inactive}
        />
        <span
          className={cn(
            "text-[11px] font-medium leading-none transition-colors duration-200",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </>
    )}
  </NavLink>
);

const ProfileTab = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <Button
        type="button"
        variant="ghost"
        className={tabButton}
        onClick={() => navigate("/login", { replace: true })}
      >
        <LogIn
          className="size-5 text-muted-foreground transition-colors duration-200 group-active:text-foreground"
          strokeWidth={1.75}
        />
        <span className="text-[11px] font-medium leading-none text-muted-foreground">Sign in</span>
      </Button>
    );
  }

  const avatarSrc = user?.profilePicture || DEFAULT_AVATAR;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button type="button" variant="ghost" className={tabButton}>
          <ActiveIndicator active={open} color={PROFILE_COLOR} />
          <User
            className={cn(
              "size-5 transition-colors duration-200",
              !open && "text-muted-foreground group-active:text-foreground"
            )}
            style={open ? { color: PROFILE_COLOR } : undefined}
            strokeWidth={open ? 2.25 : 1.75}
          />
          <span
            className={cn(
              "text-[11px] font-medium leading-none transition-colors duration-200",
              open ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Account
          </span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <DrawerHeader className="text-left">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar size="lg">
                <AvatarImage src={avatarSrc} alt={user?.userName} className="object-cover" />
                <AvatarFallback className="p-0">
                  <img src={DEFAULT_AVATAR} alt={user?.userName} className="size-full object-cover" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <DrawerTitle className="text-base leading-none truncate">
              {user?.userName ?? "User"}
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {siteConfig.profileNavItems.map(({ label, icon: Icon, href }) => (
              <DrawerClose asChild key={label}>
                <MenuButton
                  variant="tile"
                  disabled={!href}
                  onClick={() => href && navigate(href)}
                >
                  <div className="flex items-center justify-center size-8 rounded-lg">
                    <Icon className="size-[1.15rem]" />
                  </div>
                  <span className="text-[11px] font-medium leading-none">{label}</span>
                </MenuButton>
              </DrawerClose>
            ))}
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <MenuButton variant="action">
                  <LogOut className="size-4 shrink-0" />
                  <span className="text-sm font-medium">Log out</span>
                </MenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xs">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure to logout?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel size="sm" className="rounded-xs">Cancel</AlertDialogCancel>
                  <AlertDialogAction size="sm" className="rounded-xs" onClick={logout}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const BottomNav = () => {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/85 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-(--mobile-nav-height) max-w-md items-center px-2">
        <NavItem {...NAV_TABS[0]} />
        <NavItem {...NAV_TABS[1]} />
        <ProfileTab />
      </div>
    </nav>
  );
};

export default BottomNav;
