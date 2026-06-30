import Container from "@/components/ui/container";
import PageHeaderBlock from "@/components/ui/page-header-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { LogIn } from "lucide-react";
import PlatformCard from "./PlatformCard";
import { platforms } from "./platforms";
import useLinkedAccounts from "@/hooks/useLinkedAccounts";
import { useViewerInfoQuery } from "./queries";

const Settings = () => {
  const { isAuthenticated, user } = useAuth();
  const { linkedAccounts, connectedCount } = useLinkedAccounts();
  const navigate = useNavigate();
  const { data: viewerInfo } = useViewerInfoQuery();

  if (!isAuthenticated || !user) {
    return (
      <Container>
        <PageHeaderBlock variant="profile" title="Profile" />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xs border border-dashed py-16 text-center">
          <p className="max-w-sm text-balance text-muted-foreground">
            Sign in to manage your profile and connect your tracking platforms.
          </p>
          <Button onClick={() => navigate("/login")}>
            <LogIn />
            Sign In
          </Button>
        </div>
      </Container>
    );
  }  

  return (
    <Container className="animate-in fade-in duration-300">
      <PageHeaderBlock variant="profile" title="Settings" />

      {/* Account summary */}
      <div className="mb-8 flex flex-col gap-4 rounded-xs border bg-card p-5 sm:flex-row sm:items-center sm:gap-5">
        <Avatar className="size-16">
          <AvatarImage
            src={ viewerInfo?.avatar || user.profilePicture || "/images/default-avatar.svg"}
            alt={ viewerInfo?.username || user.userName}
            className="object-cover"
          />
          <AvatarFallback className="p-0">
            <img
              src="/images/default-avatar.svg"
              alt={viewerInfo?.username || user.userName}
              className="size-full object-cover"
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="truncate text-xl font-semibold tracking-tight">
            { viewerInfo?.username ?? user.userName ?? "User"}
          </h2>
          {user.email && (
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          )}
        </div>
        <div className="sm:ml-auto">
          <span className="inline-flex items-center gap-1.5 rounded-xs bg-muted py-1 text-sm font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent" />
            {connectedCount} of {platforms.length} platforms connected
          </span>
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-tight">Connected platforms</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.key}
            platform={platform}
            connected={linkedAccounts.includes(platform.key)}
          />
        ))}
      </div>
    </Container>
  );
};
export default Settings;
