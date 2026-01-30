import { siteConfig } from "@/lib/site-config";
import ThemeSwitcher from "./theme-switcher";

const Footer = () => {
  return (
    <footer>
      <div className="container px-6 flex items-center justify-between m-inline mx-auto h-(--footer-height)">
        <div className="flex items-center">
          <ThemeSwitcher />
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Made with ❤️ by imGazza. Source code available on{" "}
          <a href={siteConfig.urls.github} target="_blank" rel="noreferrer" className="underline underline-offset-3">Github</a>
        </div>
      </div>
    </footer>
  )
}
export default Footer;