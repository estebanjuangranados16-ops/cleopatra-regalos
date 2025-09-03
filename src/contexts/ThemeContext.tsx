import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  gifts: {
    primary: '#FFD300',
    primaryDark: '#FFA500',
    primaryLight: '#FFF5CC',
    secondary: '#1E293B',
    accent: '#F59E0B',
  },
  tech: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#DBEAFE',
    secondary: '#1E293B',
    accent: '#3B82F6',
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('gifts');

  const value: ThemeContextType = {
    theme,
    setTheme,
    colors: themeColors[theme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};