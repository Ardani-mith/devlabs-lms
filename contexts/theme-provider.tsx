// /contexts/theme-provider.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = "light" | "dark";

// Ekspor interface ini jika digunakan oleh use-theme.ts secara terpisah
export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Pastikan ThemeContext diekspor
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    } else {
      setTheme("light"); // Default ke light jika tidak ada preferensi atau storage
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Fungsi useTheme dihapus dari sini jika dipindah ke /hooks/use-theme.ts