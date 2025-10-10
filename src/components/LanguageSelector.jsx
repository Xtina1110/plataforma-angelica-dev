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

  // Mapeo de banderas e idiomas con URLs de banderas SVG
  const languageData = {
    'Español': { 
      code: 'ES', 
      flag: 'https://flagcdn.com/es.svg',
      flagEmoji: '🇪🇸'
    },
    'English': { 
      code: 'EN', 
      flag: 'https://flagcdn.com/us.svg',
      flagEmoji: '🇺🇸'
    },
    'Deutsch': { 
      code: 'DE', 
      flag: 'https://flagcdn.com/de.svg',
      flagEmoji: '🇩🇪'
    },
    'Italiano': { 
      code: 'IT', 
      flag: 'https://flagcdn.com/it.svg',
      flagEmoji: '🇮🇹'
    },
    'Français': { 
      code: 'FR', 
      flag: 'https://flagcdn.com/fr.svg',
      flagEmoji: '🇫🇷'
    }
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
        <span className="text-sm font-semibold flex items-center gap-1.5">
          <img 
            src={languageData[selectedLanguage]?.flag} 
            alt={languageData[selectedLanguage]?.code}
            className="w-5 h-4 object-cover rounded-sm"
          />
          <span>{languageData[selectedLanguage]?.code}</span>
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
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-purple-200 z-[9999] min-w-[160px] max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
            {availableLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageChange(language)}
                className={`w-full px-3 py-2 text-left hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2 ${
                  selectedLanguage === language ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
                }`}
              >
                <img 
                  src={languageData[language]?.flag} 
                  alt={languageData[language]?.code}
                  className="w-6 h-5 object-cover rounded-sm flex-shrink-0"
                />
                <span className="text-sm font-medium">{languageData[language]?.code}</span>
                <span className="text-sm text-gray-600 flex-1">{language}</span>
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

