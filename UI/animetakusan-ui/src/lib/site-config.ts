
import { Settings, User } from "lucide-react";

export const siteConfig = {
  navItems: [
    { label: "Home", href: "#", coming: true },
    { label: "Browse", href: "/browse", coming: false },
    { label: "Library", href: "/library", coming: false },
  ],
  profileNavItems: [
    { label: "Profile", icon: User },
    { label: "Settings", icon: Settings, href: "/settings" }
  ],
  urls: {
    github: "https://github.com/imGazza/animetakusan"
  }
}