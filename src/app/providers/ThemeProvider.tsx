import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { theme as baseTheme, type AppTheme } from '../../shared/theme';

type ThemeContextValue = { theme: AppTheme };
const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = { children: ReactNode; override?: Partial<AppTheme> };

export function ThemeProvider({ children, override }: Props) {
  const value = useMemo<ThemeContextValue>(() => {
    const merged: AppTheme = override
      ? {
          ...baseTheme,
          ...override,
          colors: { ...baseTheme.colors, ...(override.colors ?? {}) },
        }
      : baseTheme;
    return { theme: merged };
  }, [override]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside <ThemeProvider>');
  return ctx;
}