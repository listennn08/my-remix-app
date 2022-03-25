import { createContext, useContext, useEffect, useRef, useState } from "react";

import type { Dispatch, ReactNode, SetStateAction  } from "react";
import { useFetcher } from "remix";

export enum Theme {
  DARK = "dark",
  LIGHT = "light"
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const getPreferredTheme = () =>  (
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Theme.DARK
    : Theme.LIGHT
)

export function ThemeProvider ({ children, specifiedTheme }: {children: ReactNode, specifiedTheme: Theme | null }) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme))  return specifiedTheme;
      return null;
    }

    if (typeof window !== "object") return null
    return getPreferredTheme();
  });

  const persistTheme = useFetcher();
  const persistThemeRef = useRef(persistTheme);

  useEffect(() => {
    persistThemeRef.current = persistTheme
  }, [persistTheme]);

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    console.log(theme)
    if (!theme) return;

    persistThemeRef.current.submit({ theme }, { action: "actions/setTheme", method: "post" });
  }, [theme])
  
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  const dataset = document.documentElement.dataset;
  dataset.theme = theme;
})();
`;

export function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  return <>{ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}</>
}

const themes: Array<Theme> = Object.values(Theme);

export function isTheme(theme: unknown): theme is Theme {
  return typeof theme === "string" && themes.includes(theme as Theme);
}