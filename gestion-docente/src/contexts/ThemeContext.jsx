import { createContext, useContext } from "react";
import { useThemeMode } from "../hooks/useThemeMode";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const value = useThemeMode();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
