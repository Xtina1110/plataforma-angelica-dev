import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoAngelico from './LogoAngelico';
import FooterLegal from './FooterLegal';
import fondoAngelico from '../assets/FondoAngelicoDashboard.png';

const AuthPageLayout = ({ 
  children, 
  title = "Authentication",
  headerImage,
  icon: IconComponent,
  showLanguageSelector = false,
  availableLanguages = [],
  language = "",
  changeLanguage = () => {},
  maxWidth = "max-w-lg" // Permite personalizar el ancho máximo
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative bg-cover bg-center overflow-hidden">
      {/* Fondo idéntico al onboarding */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${fondoAngelico})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Capa azul transparente sobre la imagen (en lugar de morada) */}
      <div className="absolute inset-0 bg-blue-600/40" />
      
      {/* Degradación azul adicional (en lugar de morada) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-blue-600/25 to-cyan-500/20" />
      
      {/* Overlay adicional muy sutil para mejorar legibilidad */}
      <div className="absolute inset-0 bg-blue-900/10" />
      
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-blue-400/30 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <LogoAngelico />

      {/* Ventana modal centrada ultra-compacta */}
      <div className="relative z-30 flex-1 flex items-center justify-center px-4 lg:px-12 py-2">
        <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full ${maxWidth} mx-auto border border-white/20`}>
          
          {/* Barra superior compacta */}
          <div className="relative h-12 overflow-hidden rounded-t-3xl">
            {/* Imagen de fondo de la barra */}
            {headerImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${headerImage})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/80" />
            
            {/* Contenido compacto */}
            <div className="relative z-10 h-full flex items-center justify-between px-4">
              {/* Título con icono */}
              <div className="flex items-center space-x-2">
                {IconComponent && (
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <IconComponent size={16} className="text-white" />
                  </div>
                )}
                <h1 className="text-base font-bold text-white drop-shadow-lg">
                  {title}
                </h1>
              </div>

              {/* Botones compactos */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-2 py-1 text-white hover:text-cyan-200 transition-colors duration-200 bg-white/10 rounded-lg backdrop-blur-sm text-xs"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  <span className="font-medium">Volver</span>
                </button>

                <button
                  onClick={() => navigate('/inicio')}
                  className="inline-flex items-center justify-center w-7 h-7 text-white hover:text-red-300 hover:bg-red-500/20 rounded-full transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido ultra-compacto */}
          <div className="p-3">
            {children}
          </div>
        </div>
      </div>

      {/* Footer al final de la página con margen reducido */}
      <div className="relative z-40 mt-auto">
        <FooterLegal />
      </div>
    </div>
  );
};

export default AuthPageLayout;

