'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Always default to light mode — dark mode available via manual toggle only
    const saved = window.localStorage?.getItem('staybookt-theme') as Theme;
    if (saved === 'dark') {
      // Clear stale dark preference — we want light mode as the default experience
      try { window.localStorage?.setItem('staybookt-theme', 'light'); } catch {}
      setTheme('light');
    } else if (saved) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { window.localStorage?.setItem('staybookt-theme', theme); } catch {}
  }, [theme]);

  // Clean up dark class only when ThemeProvider fully unmounts (e.g. navigating to marketing pages)
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
