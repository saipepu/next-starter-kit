"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type Theme = 'light' | 'dark' | 'system'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [theme, setTheme] = React.useState<Theme>('system')

  React.useEffect(() => {
    const root = window.document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'system') {
      root.classList.remove('light', 'dark')
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') return 'dark'
      if (prevTheme === 'dark') return 'system'
      return 'light'
    })
  }

  return <NextThemesProvider {...props} defaultTheme={theme}>{children}</NextThemesProvider>
}