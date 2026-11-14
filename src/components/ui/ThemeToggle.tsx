import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { appState } from '../../state/appState';
import { ThemeMode } from '../../types';

interface ThemeToggleProps {
  currentTheme: ThemeMode;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme }) => {
  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    appState.setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-300 hover:text-[#d4af37] hover:bg-white/5 border border-transparent hover:border-[#c5a059]/30 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
      title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle visual theme"
    >
      {currentTheme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-[#e2c275]" />
          <span className="hidden sm:inline text-xs text-gray-300">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          <span className="hidden sm:inline text-xs text-slate-800 font-medium">Dark</span>
        </>
      )}
    </button>
  );
};
