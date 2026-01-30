import UserAvatar from "./user-avatar";
import Logo from "./logo";
import SimpleSearch from "./simple-search";
import TopNav from "./top-nav";
import { siteConfig } from "@/lib/site-config";
import MobileNav from "./mobile-nav";
import { Link } from "react-router";

const Header = () => {
  return (
    <header>
      <div className="container px-6 flex items-center m-inline mx-auto h-(--header-height)">
        <MobileNav className="flex lg:hidden" items={siteConfig.navItems}/>
        <div className="hidden items-center lg:flex">
          <Link to="/">
            <Logo size="lg" showText={false} />
          </Link>
          <TopNav items={siteConfig.navItems} />
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <SimpleSearch className="hidden md:flex" />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
export default Header;