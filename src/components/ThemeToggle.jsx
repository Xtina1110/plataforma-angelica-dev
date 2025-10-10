import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ variant = 'default' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const variants = {
    default: {
      container: 'p-2 rounded-lg bg-white/90 hover:bg-white shadow-md hover:shadow-lg',
      icon: 'text-gray-700'
    },
    loading: {
      container: 'p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm',
      icon: 'text-white'
    },
    minimal: {
      container: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
      icon: 'text-gray-700 dark:text-gray-300'
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <button
      onClick={toggleTheme}
      className={`${style.container} transition-all duration-300 transform hover:scale-105 active:scale-95`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <div className="relative w-6 h-6">
        {/* Sol - visible en modo oscuro */}
        <Sun 
          size={24} 
          className={`${style.icon} absolute inset-0 transition-all duration-500 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
        />
        
        {/* Luna - visible en modo claro */}
        <Moon 
          size={24} 
          className={`${style.icon} absolute inset-0 transition-all duration-500 ${
            !isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;

