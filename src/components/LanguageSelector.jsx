import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ inline = false, variant = 'default' }) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { selectedLanguage, changeLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setShowLanguageSelector(false);
  };

  const isHeader = variant === 'header';

  const btnClass = isHeader
    ? 'flex items-center gap-2 p-2 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 border border-white/20'
    : 'bg-white/95 backdrop-blur-sm border border-purple-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-lg text-sm sm:text-base';

  const iconCls = isHeader ? 'text-white' : 'text-purple-700';
  const textCls = isHeader ? 'text-white font-medium' : 'text-purple-700 font-medium';
  const caretCls = isHeader ? 'text-white' : 'text-purple-700';

  const SelectorContent = (
    <div className="relative">
      <button
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className={btnClass}
        aria-label="Cambiar idioma"
      >
        <Globe size={16} className={iconCls} />
        <span className={textCls}>{selectedLanguage}</span>
        <svg 
          className={`w-4 h-4 ${caretCls} transition-transform duration-300 ${showLanguageSelector ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showLanguageSelector && (
        <div className="absolute top-full mt-2 right-0 transform translate-x-0 bg-white rounded-lg shadow-xl border border-purple-200 z-[9999] min-w-[160px]" style={{right: 0}}>
          {availableLanguages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageChange(language)}
              className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-200 text-sm sm:text-base ${
                selectedLanguage === language ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
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