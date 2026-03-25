
import { Monitor, Settings, User } from "lucide-react";

export const siteConfig = {
  navItems: [
    { label: "Home", href: "#", coming: true },
    { label: "Browse", href: "/browse", coming: false },
    { label: "Library", href: "#", coming: true },
  ],
  profileNavItems: [
    { label: "Profile", icon: User },
    { label: "Platforms", icon: Monitor },
    { label: "Settings", icon: Settings }
  ],
  urls: {
    github: "https://github.com/imGazza/animetakusan"
  }
}