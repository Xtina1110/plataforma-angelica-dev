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

  // Iconos de banderas - componentes directos
  const FlagIcon = ({ country }) => {
    const flags = {
      'ES': '🇪🇸',
      'US': '🇺🇸', 
      'DE': '🇩🇪',
      'IT': '🇮🇹',
      'FR': '🇫🇷'
    };
    return <span role="img" aria-label={country}>{flags[country]}</span>;
  };

  const languageCodes = {
    'Español': 'ES',
    'English': 'EN',
    'Deutsch': 'DE',
    'Italiano': 'IT',
    'Français': 'FR'
  };

  const isHeader = variant === 'header';
  const isLoading = variant === 'loading';

  // Estilo estándar de headers (como Sonoterapia)
  const btnClass = isHeader || isLoading
    ? 'flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 border-2 border-purple-500 hover:border-purple-400 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105'
    : 'bg-white/95 backdrop-blur-sm border border-purple-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-lg text-sm sm:text-base';

  const SelectorContent = (
    <div className="relative">
      <button
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className={btnClass}
        aria-label="Cambiar idioma"
      >
        <Globe size={18} />
        <span className="text-sm font-semibold flex items-center gap-1">
          <FlagIcon country={languageCodes[selectedLanguage]} />
          {languageCodes[selectedLanguage]}
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
            className="fixed inset-0 z-[48]" 
            onClick={() => setShowLanguageSelector(false)}
          />
          
          {/* Dropdown with scroll - más compacto */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-purple-200 z-[60] min-w-[160px] max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
            {availableLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageChange(language)}
                className={`w-full px-3 py-2 text-left hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2 ${
                  selectedLanguage === language ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="text-lg"><FlagIcon country={languageCodes[language]} /></span>
                <span className="text-xs font-medium">{languageCodes[language]}</span>
                <span className="text-xs text-gray-500 flex-1">{language}</span>
                {selectedLanguage === language && (
                  <span className="text-purple-600 font-bold text-sm">✓</span>
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

