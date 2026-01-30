import { useEffect, useMemo, useState } from "react"
import { ThemeContext, type Theme } from "./ThemeContext"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme"
}: Readonly<ThemeProviderProps>) {

  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    root.classList.add(theme)
  }, [theme])

  const themeValue = useMemo(
    () => {
      return {
        theme,
        setTheme: (theme: Theme) => {
          localStorage.setItem(storageKey, theme)
          setTheme(theme)
        }
      }
    }, [theme])

  return (
    <ThemeContext value={themeValue}>{children}</ThemeContext>
  )
}