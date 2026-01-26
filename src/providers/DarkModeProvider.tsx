'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Initialize dark mode on client side
    const htmlElement = document.documentElement;
    
    // Get initial dark mode preference from localStorage or system
    const savedMode = localStorage.getItem('darkMode');
    let shouldBeDark = false;

    if (savedMode !== null) {
      shouldBeDark = JSON.parse(savedMode);
    } else {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDark(shouldBeDark);

    // Immediately apply the class without waiting for state update
    if (shouldBeDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const htmlElement = document.documentElement;

    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark, isMounted]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
