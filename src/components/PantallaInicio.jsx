import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LogoAngelico from './LogoAngelico';
import FooterLegal from './FooterLegal';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';
import fondoMarmol from '../assets/Fondomarmoleado.jpg';
import sanMiguel from '../assets/FondoPantallaIniciovf.png';

const PantallaInicio = () => {
  const navigate = useNavigate();
  // Eliminado: selector de idioma local (usamos LanguageSelector global)

  // Usar el contexto global de idiomas
  const { selectedLanguage, changeLanguage, availableLanguages, getCurrentTranslation } = useLanguage();

// Eliminado: handleLanguageChange (usamos LanguageSelector global)

  const currentTranslation = getCurrentTranslation();

  return (
    <div className="min-h-screen max-h-screen flex relative bg-cover bg-center overflow-hidden"
         style={{ overflow: 'hidden' }}>
      {/* Fondo responsivo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${fondoMarmol})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Capa de transparencia */}
      <div className="absolute inset-0 bg-white/60 z-0" />

      {/* Logo - responsive */}
      <div className="absolute top-4 left-4 z-30">
        <LogoAngelico />
      </div>

      {/* Controles superiores: idioma + audio */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg">
        <LanguageSelector inline />
        <AudioButton variant="header" />
      </div>

      {/* Imagen San Miguel - responsive */}
      <div
        className="absolute top-0 left-8 sm:left-16 md:left-20 lg:left-24 w-2/3 sm:w-3/5 md:w-1/2 h-full bg-contain bg-center bg-no-repeat opacity-25 sm:opacity-30 md:opacity-40 z-10"
        style={{
          backgroundImage: `url(${sanMiguel})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center left'
        }}
      />

      {/* Contenido del panel derecho - completamente responsive y centrado en pantalla */}
      <div className="flex-1 flex items-center justify-center sm:justify-end px-3 sm:px-4 md:pr-8 lg:pr-12 relative z-20 h-screen py-20 sm:py-16">
        <div className="bg-white/95 glass-effect rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-xl backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out hover:bg-white/98 animate-fade-in-up">
          
          {/* Contenedor flex para ángel y mensaje */}
          <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
            {/* Imagen del ángel */}
            <div className="flex-shrink-0 w-24 sm:w-32 md:w-36 lg:w-40">
              <img
                src="/image.png"
                alt="Ángel Guardián"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Contenido del mensaje */}
            <div className="flex-1">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-yellow-700 font-semibold mb-2 sm:mb-3 text-center lg:text-left italic text-shadow">
                {currentTranslation.blessing}
              </p>

              <h1
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 text-center lg:text-left tracking-wide drop-shadow-md text-shadow"
                style={{
                  color: '#6a0dad',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                {currentTranslation.title}
              </h1>

              <div className="text-center lg:text-left mb-2 sm:mb-3">
                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-tight">
                  {currentTranslation.subtitle}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-tight">
                  {currentTranslation.subtitle2}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-white text-xs sm:text-sm md:text-base font-semibold py-2 sm:py-2.5 md:py-3 rounded-full shadow-md hover:scale-105 hover:shadow-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 ease-in-out transform active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">{currentTranslation.login}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => navigate('/registro')}
              className="border-2 border-purple-600 text-purple-700 text-xs sm:text-sm md:text-base font-semibold py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-purple-50 hover:scale-105 hover:shadow-lg hover:border-purple-700 hover:text-purple-800 transition-all duration-300 ease-in-out transform active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">{currentTranslation.register}</span>
              <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

{/* Eliminado: indicadores decorativos (3 puntos) para cumplir con requerimiento */}
        </div>
      </div>

      {/* Footer legal - responsive */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <FooterLegal />
      </div>
    </div>
  );
};

export default PantallaInicio;