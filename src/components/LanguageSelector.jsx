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
    ? 'flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg'
    : 'bg-white/95 backdrop-blur-sm border border-purple-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-lg text-sm sm:text-base';

  const SelectorContent = (
    <div className="relative">
      <button
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className={btnClass}
        aria-label="Cambiar idioma"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">
          {flags[selectedLanguage]} {selectedLanguage}
        </span>
        <ChevronDown 
          size={16} 
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

