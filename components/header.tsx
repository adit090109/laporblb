"use client";

import { Moon, Sun, Wifi } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="https://app.biznet.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Wifi className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">Biznet Blimbing</h1>
            <p className="text-xs text-muted-foreground">Jadwal Installer</p>
          </div>
        </a>

        <button
          onClick={toggleTheme}
          className="relative w-14 h-7 rounded-full bg-secondary border border-border transition-colors hover:bg-muted group"
          aria-label="Toggle theme"
        >
          <div
            className={`absolute top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-all duration-300 ${
              isDark ? "left-1" : "left-8"
            }`}
          >
            {isDark ? (
              <Moon className="w-3 h-3 text-primary-foreground" />
            ) : (
              <Sun className="w-3 h-3 text-primary-foreground" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
