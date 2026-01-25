import UserAvatar from "../user-avatar";
import Logo from "./logo";
import SimpleSearch from "./simple-search";
import TopNav from "./top-nav";
import { siteConfig } from "@/lib/site-config";

const Header = () => {
  return (
    <header>
      <div className="container px-6 flex items-center justify-between m-inline mx-auto h-[var(--header-height)]">
        <div className="flex items-center">
          <Logo size="lg" showText={false} />
          <TopNav items={siteConfig.navItems} />
        </div>
        <div className="flex items-center space-x-4">
          <SimpleSearch />
          <UserAvatar />
        </div>
      </div>        
    </header>
  )
}
export default Header;