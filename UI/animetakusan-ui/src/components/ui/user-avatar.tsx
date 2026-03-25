import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { MenuButton } from "./menu-button";
import { LogOut, Monitor, Settings, User } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const UserAvatar = () => {
  const { logout, user } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer ring-2 ring-transparent transition-all duration-200">
          <AvatarImage src={user?.profilePicture ?? "https://github.com/shadcn.png"} alt={user?.username} className="grayscale" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-0 shadow-xl shadow-black/40 overflow-hidden rounded-xs" align="end">

        <div className="bg-background px-4 pt-4 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar size="lg">
                <AvatarImage src={user?.profilePicture ?? "https://github.com/shadcn.png"} className="grayscale" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 ring-2 ring-popover" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-sm font-semibold leading-none truncate">{user?.username ?? "User"}</span>
            </div>
          </div>
        </div>

        <div className="px-3 pt-2 pb-2">
          <div className="grid grid-cols-3 gap-1.5">
            {siteConfig.profileNavItems.map(({ label, icon: Icon }) => (
              <MenuButton key={label} variant="tile">
                <div className="flex items-center justify-center size-8 rounded-lg">
                  <Icon className="size-[1.1rem]" />
                </div>
                <span className="text-[11px] font-medium leading-none">{label}</span>
              </MenuButton>
            ))}
          </div>

          <div className="mt-2 mb-1 border-t border-border pt-2">
            <MenuButton variant="action" onClick={logout}>
              <LogOut className="size-4 shrink-0" />
              <span className="text-sm font-medium">Log out</span>
            </MenuButton>
          </div>
        </div>

      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;