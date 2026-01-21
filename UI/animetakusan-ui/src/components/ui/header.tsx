import Logo from "./logo";
import TopNav from "./top-nav";
import { siteConfig } from "@/lib/site-config";

const Header = () => {
  return (
    <header className="px-6 py-2">
      <div className="container flex items-center">
        <Logo size="lg" showText={false} />
        <TopNav items={siteConfig.navItems} />
      </div>      
    </header>
  )
}
export default Header;