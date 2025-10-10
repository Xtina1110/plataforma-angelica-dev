import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LogoAngelico from './LogoAngelico';
import FooterLegal from './FooterLegal';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';
import fondoMarmol from '../assets/Fondomarmoleado.jpg';
import sanMiguel from '../assets/FondoPantallaIniciovf.png';
import angelSinFondo from '../assets/AngelEleganteSinFondo.png';

const PantallaInicio = () => {
  const navigate = useNavigate();
  const { getCurrentTranslation } = useLanguage();
  const currentTranslation = getCurrentTranslation();

  return (
    <div className="min-h-screen max-h-screen flex relative bg-cover bg-center overflow-hidden">
      {/* Fondo con efecto parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `url(${fondoMarmol})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Capa de transparencia con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-purple-50/40 z-0" />

      {/* Logo con animación de entrada */}
      <div className="absolute top-4 left-4 z-30 animate-fade-in">
        <LogoAngelico />
      </div>

      {/* Controles superiores: idioma + audio - Con más margen para evitar overlap */}
      <div className="absolute top-4 sm:top-5 md:top-6 right-3 sm:right-4 z-50 flex items-center gap-2 animate-fade-in-down">
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>

      {/* Imagen San Miguel - ajustada para ver la cara completa */}
      <div
        className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-20 sm:opacity-25 md:opacity-30 z-10 transition-opacity duration-700"
        style={{
          backgroundImage: `url(${sanMiguel})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Contenido del panel derecho - diseño premium con borde dorado */}
      <div className="flex-1 flex items-center justify-center sm:justify-end px-4 sm:px-6 md:pr-12 lg:pr-16 relative z-20 h-screen pt-32 pb-24 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="bg-white/98 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 w-full max-w-[300px] sm:max-w-sm md:max-w-md backdrop-blur-md border-2 border-yellow-500/60 hover:border-yellow-500/80 hover:shadow-purple-200/50 hover:shadow-3xl hover:scale-[1.01] transition-all duration-500 ease-out animate-fade-in-up relative overflow-hidden z-[70]">
          
          {/* Efecto de brillo sutil en el fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl -z-10" />
          
          {/* Contenedor principal */}
          <div className="flex flex-col items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
            {/* Imagen del ángel - sin fondo, totalmente transparente */}
            <div className="flex-shrink-0 w-28 sm:w-32 md:w-36 animate-float">
              <img
                src={angelSinFondo}
                alt="Ángel Guardián"
                className="w-full h-auto object-contain drop-shadow-lg"
                style={{ 
                  filter: 'drop-shadow(0 10px 20px rgba(106, 13, 173, 0.2))'
                }}
              />
            </div>

            {/* Contenido del mensaje - Todo centrado con mejor espaciado */}
            <div className="w-full space-y-2 sm:space-y-3">
              {/* Bendición */}
              <p className="text-xs sm:text-sm md:text-base text-yellow-600 font-bold text-center italic leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {currentTranslation.blessing}
              </p>

              {/* Título principal */}
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-center tracking-wide drop-shadow-lg leading-tight animate-fade-in"
                style={{
                  color: '#6a0dad',
                  fontFamily: "'Playfair Display', serif",
                  animationDelay: '0.3s'
                }}
              >
                {currentTranslation.title}
              </h1>

              {/* Subtítulos */}
              <div className="text-center space-y-1 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                  {currentTranslation.subtitle}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                  {currentTranslation.subtitle2}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción - mejorados */}
          <div className="flex flex-col gap-2.5 sm:gap-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>            {/* Botón Iniciar Sesión */}
            <button
              onClick={() => navigate('/login')}
              className="relative bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-white text-xs sm:text-sm md:text-base font-bold py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-yellow-300/50 hover:scale-[1.03] transition-all duration-300 ease-out transform active:scale-95 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {currentTranslation.login}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>

            {/* Botón Registrarse */}
            <button
              onClick={() => navigate('/registro')}
              className="relative bg-white border-2 border-purple-600 text-purple-700 text-xs sm:text-sm md:text-base font-bold py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-300/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 hover:text-white hover:border-purple-700 hover:scale-[1.03] transition-all duration-300 ease-out transform active:scale-95 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {currentTranslation.register}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>


        </div>
      </div>

      {/* Footer legal */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <FooterLegal />
      </div>
    </div>
  );
};

export default PantallaInicio;

