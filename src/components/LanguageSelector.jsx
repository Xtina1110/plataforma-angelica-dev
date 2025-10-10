import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector = ({ inline = false, variant = 'default' }) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { selectedLanguage, changeLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setShowLanguageSelector(false);
  };

  // Iconos de banderas
  const flags = {
    'Español': '🇪🇸',
    'English': '🇬🇧',
    'Deutsch': '🇩🇪',
    'Italiano': '🇮🇹',
    'Français': '🇫🇷'
  };

  const isHeader = variant === 'header';
  const isLoading = variant === 'loading';

  // Estilo estándar de headers (como Sonoterapia)
  const btnClass = isHeader || isLoading
    ? 'flex items-center space-x-2 bg-purple-600/80 hover:bg-purple-500/90 border-2 border-purple-400/50 hover:border-purple-300/70 text-white px-5 py-3 rounded-xl transition-all duration-300 backdrop-filter backdrop-blur-md font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105'
    : 'bg-white/95 backdrop-blur-sm border border-purple-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-lg text-sm sm:text-base';

  const SelectorContent = (
    <div className="relative">
      <button
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className={btnClass}
        aria-label="Cambiar idioma"
      >
        <Globe size={20} />
        <span className="text-base font-semibold">
          {flags[selectedLanguage]} {selectedLanguage}
        </span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${showLanguageSelector ? 'rotate-180' : ''}`}
        />
      </button>
      
      {showLanguageSelector && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowLanguageSelector(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-purple-200 z-[9999] min-w-[180px] overflow-hidden">
            {availableLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageChange(language)}
                className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2 ${
                  selectedLanguage === language ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{flags[language]}</span>
                <span className="text-sm">{language}</span>
                {selectedLanguage === language && (
                  <span className="ml-auto text-purple-600 font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (inline) {
    return SelectorContent;
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      {SelectorContent}
    </div>
  );
};

export default LanguageSelector;

