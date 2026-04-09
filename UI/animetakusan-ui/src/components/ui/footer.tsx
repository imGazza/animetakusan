import { siteConfig } from "@/lib/site-config";
import ThemeSwitcher from "./theme-switcher";
import Container from "./container";

const Footer = () => {
  return (
    <footer>
      <Container className="flex items-center justify-between h-(--footer-height)">
        <div className="flex items-center">
          <ThemeSwitcher />
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Made with ❤️ by imGazza. Source code available on{" "}
          <a href={siteConfig.urls.github} target="_blank" rel="noreferrer" className="underline underline-offset-3">Github</a>
        </div>
      </Container>
    </footer>
  )
}
export default Footer;