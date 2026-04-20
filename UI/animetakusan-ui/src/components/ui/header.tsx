import Logo from "./logo";
import SimpleSearch from "./simple-search";
import TopNav from "./top-nav";
import { siteConfig } from "@/lib/site-config";
import MobileNav from "./mobile-nav";
import { Link } from "react-router";
import Container from "./container";
import LoggedUser from "./logged-user";

const Header = () => {
  return (
    <header>
      <Container className="flex items-center h-(--header-height)">
        <MobileNav className="flex lg:hidden" items={siteConfig.navItems}/>
        <div className="hidden items-center lg:flex">
          <Link to="/">
            <Logo size="lg" showText={false} />
          </Link>
          <TopNav items={siteConfig.navItems} />
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <SimpleSearch className="hidden md:flex" />
          <LoggedUser menuItems={siteConfig.profileNavItems} />
        </div>
      </Container>
    </header>
  )
}
export default Header;