import Logo from "./logo";
import SimpleSearch from "./simple-search";
import TopNav from "./top-nav";
import { siteConfig } from "@/lib/site-config";
import { Link } from "react-router";
import Container from "./container";
import LoggedUser from "./logged-user";

const Header = () => {
  return (
    <header className="hidden lg:block">
      <Container className="flex items-center h-(--header-height)">
        <div className="flex items-center">
          <Link to="/">
            <Logo size="lg" showText={false} />
          </Link>
          <div className="hidden lg:flex">
            <TopNav items={siteConfig.navItems} />
          </div>
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <SimpleSearch className="hidden md:flex" />
          <div className="hidden lg:flex">
            <LoggedUser menuItems={siteConfig.profileNavItems} />
          </div>
        </div>
      </Container>
    </header>
  )
}
export default Header;
