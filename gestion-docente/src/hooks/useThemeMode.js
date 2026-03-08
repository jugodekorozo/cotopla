import { useEffect, useState } from "react";
import { G, THEMES } from "../constants/constants";

export function useThemeMode() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("ui-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const T = THEMES[theme] || THEMES.dark;

  useEffect(() => {
    localStorage.setItem("ui-theme", theme);
    const root = document.documentElement;
    root.style.setProperty("--t-bg", T.bg);
    root.style.setProperty("--t-header", T.header);
    root.style.setProperty("--g-accent", G.accentGradient);
    root.style.setProperty("--g-success", G.successGradient);
    root.style.setProperty("--g-warning", G.warningGradient);
    root.style.setProperty("--g-danger", G.dangerGradient);
    root.style.setProperty("--g-glass", G.glassGradient);
  }, [theme, T]);

  function toggleTheme() {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }

  return { theme, T, toggleTheme };
}
