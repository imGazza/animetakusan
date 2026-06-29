import Container from "@/components/ui/container";
import PageHeaderBlock from "@/components/ui/page-header-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { LogIn } from "lucide-react";
import PlatformCard from "./PlatformCard";
import { platforms } from "./platforms";

const getInitials = (name?: string) =>
  name
    ? name
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "AT";

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Container>
        <PageHeaderBlock variant="profile" title="Profile" />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
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

  const linkedAccounts = user.linkedAccounts ?? [];
  const connectedCount = platforms.filter((p) => linkedAccounts.includes(p.key)).length;

  return (
    <Container>
      <PageHeaderBlock variant="profile" title="Profile" />

      {/* Account summary */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:gap-5">
        <Avatar className="size-16 ring-2 ring-border">
          <AvatarImage src={user.profilePicture} alt={user.userName} className="grayscale" />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(user.userName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="truncate text-xl font-semibold tracking-tight">
            {user.userName ?? "User"}
          </h2>
          {user.email && (
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          )}
        </div>
        <div className="sm:ml-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent-profile)" }}
            />
            {connectedCount} of {platforms.length} platforms connected
          </span>
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-tight">Connected platforms</h3>
        <p className="text-sm text-muted-foreground">
          Link your accounts to sync and track your anime across services.
        </p>
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
export default Profile;
