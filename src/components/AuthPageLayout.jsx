import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoAngelico from './LogoAngelico';
import FooterLegal from './FooterLegal';
import fondoMarmol from '../assets/Fondomarmoleado.jpg';
import sanMiguel from '../assets/FondoPantallaIniciovf.png';

const AuthPageLayout = ({ 
  children, 
  title = "Authentication",
  headerImage,
  icon: IconComponent,
  showLanguageSelector = false,
  availableLanguages = [],
  language = "",
  changeLanguage = () => {}
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative bg-cover bg-center">
      {/* Fondo principal - igual que antes */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${fondoMarmol})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-white/60 z-0" />
      
      {/* Imagen San Miguel Arcángel igual que en inicio */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-30 z-10 transition-opacity duration-500 hover:opacity-40"
        style={{ 
          backgroundImage: `url(${sanMiguel})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
      />

      {/* Logo */}
      <LogoAngelico />

      {/* Ventana modal centrada */}
      <div className="relative z-30 flex-1 flex items-center justify-center px-4 lg:px-12 py-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg mx-auto border border-white/20">
          
          {/* Barra superior de la ventana con imagen temática */}
          <div className="relative h-20 overflow-hidden rounded-t-3xl">
            {/* Imagen de fondo de la barra */}
            {headerImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${headerImage})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80" />
            
            {/* Contenido de la barra */}
            <div className="relative z-10 h-full flex items-center justify-between px-6">
              {/* Título con icono - lado izquierdo */}
              <div className="flex items-center space-x-3">
                {IconComponent && (
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <IconComponent size={24} className="text-white" />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  {title}
                </h1>
              </div>

              {/* Botones volver y cerrar - lado derecho */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 text-white hover:text-purple-200 transition-colors duration-200 bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  <span className="font-medium">Volver</span>
                </button>

                <button
                  onClick={() => navigate('/inicio')}
                  className="inline-flex items-center justify-center w-10 h-10 text-white hover:text-red-300 hover:bg-red-500/20 rounded-full transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Footer al final de la página */}
      <div className="relative z-40 mt-auto">
        <FooterLegal />
      </div>
    </div>
  );
};

export default AuthPageLayout;