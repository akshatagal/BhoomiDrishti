import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  {
    id: 'light',
    name: 'Govt Emerald (Light)',
    icon: '🏛️',
    description: 'Official light theme with emerald accents',
    bgClass: 'bg-slate-100 text-slate-900',
    cardClass: 'bg-white border-slate-200 text-slate-900',
    navClass: 'bg-white border-slate-200',
  },
  {
    id: 'dark',
    name: 'Midnight Navy (Dark)',
    icon: '🌙',
    description: 'Sleek dark theme with amber & gold highlights',
    bgClass: 'bg-slate-950 text-slate-100',
    cardClass: 'bg-slate-900 border-slate-800 text-slate-100',
    navClass: 'bg-slate-900 border-slate-800',
  },
  {
    id: 'gis',
    name: 'Cyber Cadastre (GIS)',
    icon: '🛰️',
    description: 'High-contrast spatial theme for GIS operators',
    bgClass: 'bg-cyan-950 text-cyan-100',
    cardClass: 'bg-cyan-900/60 border-cyan-800 text-cyan-100',
    navClass: 'bg-cyan-900/80 border-cyan-800',
  }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bhoomi_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('bhoomi_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-gis');
    root.classList.add(`theme-${theme}`);
    if (theme === 'dark' || theme === 'gis') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const activeThemeObj = themes.find(t => t.id === theme) || themes[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeThemeObj, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
