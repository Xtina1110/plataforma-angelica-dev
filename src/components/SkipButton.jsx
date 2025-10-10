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
    loading: "flex items-center space-x-2 bg-purple-600/80 hover:bg-purple-500/90 border-2 border-purple-400/50 hover:border-purple-300/70 text-white px-5 py-3 rounded-xl transition-all duration-300 backdrop-filter backdrop-blur-md font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105",
    header: "flex items-center space-x-2 bg-purple-600/80 hover:bg-purple-500/90 border-2 border-purple-400/50 hover:border-purple-300/70 text-white px-5 py-3 rounded-xl transition-all duration-300 backdrop-filter backdrop-blur-md font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105"
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
      aria-label={label}
    >
      <FastForward size={20} />
      <span className="text-base font-semibold">{label}</span>
    </button>
  );
};

export default SkipButton;

