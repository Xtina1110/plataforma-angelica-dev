import React from 'react';
import { FastForward } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SkipButton = ({ onClick, className = "", variant = "loading" }) => {
  const { selectedLanguage } = useLanguage();

  const labels = {
    Español: 'Saltar',
    English: 'Skip',
    Deutsch: 'Überspringen',
    Italiano: 'Salta',
    Français: 'Passer'
  };

  const label = labels[selectedLanguage] || labels['Español'];

  const variants = {
    loading: "flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg hover:scale-105",
    header: "flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg"
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
      aria-label={label}
    >
      <FastForward size={18} />
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default SkipButton;

