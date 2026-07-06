
import { Settings, User } from "lucide-react";

export const siteConfig = {
  navItems: [
    // Home is still a prototype — keep it "coming soon" (non-navigable) until it's production-ready.
    // To preview during development, set coming:false + href:"/home" AND uncomment the /home route in router/routes.tsx.
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