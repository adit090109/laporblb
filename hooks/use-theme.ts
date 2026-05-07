"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Disable transition on initial load to prevent flash
    document.documentElement.classList.add("no-transition");
    
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
    
    // Re-enable transition after initial load
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transition");
      });
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newValue);
      return newValue;
    });
  }, []);

  return { isDark, toggleTheme };
}
