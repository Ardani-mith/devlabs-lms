"use client";

import { useContext } from 'react';
import { ThemeContext, ThemeContextProps } from '@/contexts/theme-provider'; // Pastikan path ini benar

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}