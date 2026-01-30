import { Sun, Moon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/providers/theme/ThemeContext";

const ThemeSwitcher = () => {

  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (value) setTheme(value as Theme);
      }}
      className="border rounded-[0.5rem] h-6 p-0.5 gap-0.5"
    >
      <ToggleGroupItem value="light" aria-label="Light mode" className="h-[18px] w-[20px] rounded-[6px] px-[2px]">
        <Sun className="size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode" className="h-[18px] w-[20px] rounded-[6px] px-[2px]">
        <Moon className="size-3" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
export default ThemeSwitcher;