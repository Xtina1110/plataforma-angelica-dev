/**
 * Header Angelical Unificado
 * Componente base para todos los headers de la plataforma
 * 
 * Características:
 * - Botones consistentes en todas las aplicaciones
 * - Color personalizable por aplicación
 * - Diseño angelical unificado
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';
import ScrollIndicator from '../ScrollIndicator';
import LanguageSelector from '../LanguageSelector';
import fondoAngelico from '../../assets/FondoAngelicoDashboard.png';

// Configuraciones de color por aplicación
const AppThemes = {
  apertura: {
    name: 'Apertura Angelical',
    subtitle: 'Abre tu corazón a la energía divina ✨',
    primaryColor: '#00BCD4', // Cyan/Turquesa
    overlayColor: 'bg-cyan-600/40',
    borderColor: 'border-cyan-500',
    hoverBorderColor: 'hover:border-cyan-400',
    buttonBg: 'bg-cyan-700',
    buttonHover: 'hover:bg-cyan-600',
    accentColor: 'bg-cyan-400/30'
  },
  canalizaciones: {
    name: 'Canalizaciones Angelicales',
    subtitle: 'Conecta con mensajes divinos 💖',
    primaryColor: '#9C27B0', // Morado/Púrpura
    overlayColor: 'bg-purple-600/40',
    borderColor: 'border-purple-500',
    hoverBorderColor: 'hover:border-purple-400',
    buttonBg: 'bg-purple-700',
    buttonHover: 'hover:bg-purple-600',
    accentColor: 'bg-purple-400/30'
  },
  sonoterapia: {
    name: 'Sonoterapia Angelical',
    subtitle: 'Sana con frecuencias divinas 🎵',
    primaryColor: '#9C27B0', // Morado/Púrpura
    overlayColor: 'bg-purple-600/40',
    borderColor: 'border-purple-500',
    hoverBorderColor: 'hover:border-purple-400',
    buttonBg: 'bg-purple-700',
    buttonHover: 'hover:bg-purple-600',
    accentColor: 'bg-purple-400/30'
  },
  terapias: {
    name: 'Terapias y Limpiezas',
    subtitle: 'Equilibra tu energía vital 💖',
    primaryColor: '#E91E63', // Rosa/Fucsia (Magenta)
    overlayColor: 'bg-pink-600/40',
    borderColor: 'border-pink-500',
    hoverBorderColor: 'hover:border-pink-400',
    buttonBg: 'bg-pink-700',
    buttonHover: 'hover:bg-pink-600',
    accentColor: 'bg-pink-400/30'
  },
  academia: {
    name: 'Academia Angélica',
    subtitle: 'Aprende el camino de la luz 📚',
    primaryColor: '#00C853', // Verde brillante
    overlayColor: 'bg-green-600/40',
    borderColor: 'border-green-500',
    hoverBorderColor: 'hover:border-green-400',
    buttonBg: 'bg-green-700',
    buttonHover: 'hover:bg-green-600',
    accentColor: 'bg-green-400/30'
  },
  tienda: {
    name: 'Tienda Angelical',
    subtitle: 'Productos espirituales bendecidos 🛍️',
    primaryColor: '#FF6D00', // Naranja intenso
    overlayColor: 'bg-orange-600/40',
    borderColor: 'border-orange-500',
    hoverBorderColor: 'hover:border-orange-400',
    buttonBg: 'bg-orange-700',
    buttonHover: 'hover:bg-orange-600',
    accentColor: 'bg-orange-400/30'
  },
  eventos: {
    name: 'Eventos Angelicales',
    subtitle: 'Experiencias espirituales únicas 🎉',
    primaryColor: '#0D47A1', // Azul intenso/Royal blue
    overlayColor: 'bg-blue-800/40',
    borderColor: 'border-blue-700',
    hoverBorderColor: 'hover:border-blue-600',
    buttonBg: 'bg-blue-800',
    buttonHover: 'hover:bg-blue-700',
    accentColor: 'bg-blue-600/30'
  },
  blog: {
    name: 'Blog & Podcast',
    subtitle: 'Sabiduría angelical compartida 📖',
    primaryColor: '#FFC107', // Amarillo/Dorado
    overlayColor: 'bg-yellow-600/40',
    borderColor: 'border-yellow-500',
    hoverBorderColor: 'hover:border-yellow-400',
    buttonBg: 'bg-yellow-700',
    buttonHover: 'hover:bg-yellow-600',
    accentColor: 'bg-yellow-400/30'
  }
};

const UnifiedAngelicalHeader = ({ 
  app = 'apertura', // apertura, canalizaciones, sonoterapia, terapias, academia, tienda, eventos, blog
  title, // Título personalizado (opcional)
  subtitle, // Subtítulo personalizado (opcional)
  cartCount = 0, 
  user = null,
  onCartClick,
  onProfileClick,
  onLogout,
  onNavigateHome,
  audioActive = false,
  onToggleAudio,
  showStats = true, // Mostrar stats del usuario
  showAudioControl = true, // Mostrar control de audio
  customStats // Stats personalizados
}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [audioReproduciendo, setAudioReproduciendo] = useState(audioActive);
  const { toast } = useToast();

  const theme = AppThemes[app] || AppThemes.apertura;

  // Cargar datos del usuario desde Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .select('nombre, apellidos, email')
            .eq('id', user.id)
            .maybeSingle();

          if (data && !error) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Error cargando perfil:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const getUserName = () => {
    if (userProfile?.nombre) {
      return userProfile.nombre;
    }
    
    if (user?.user_metadata?.nombre || user?.user_metadata?.name || user?.user_metadata?.full_name) {
      return user.user_metadata.nombre || user.user_metadata.name || user.user_metadata.full_name;
    }
    
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
    }
    
    return 'Usuario';
  };

  const handleToggleAudio = () => {
    setAudioReproduciendo(!audioReproduciendo);
    if (onToggleAudio) {
      onToggleAudio(!audioReproduciendo);
    }
  };

  // Clase de botón unificada
  const buttonClass = `
    flex items-center space-x-2 
    ${theme.buttonBg} ${theme.buttonHover} 
    border-2 ${theme.borderColor} ${theme.hoverBorderColor}
    text-white px-5 py-3 rounded-xl 
    transition-all duration-300 font-semibold 
    shadow-xl hover:shadow-2xl hover:scale-105
  `;

  return (
    <div className="w-full">
      {/* Header principal con gradiente del color de la aplicación */}
      <div className="relative overflow-hidden rounded-2xl mx-4 my-4 shadow-2xl">
        {/* Fondo con imagen angélica */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAngelico})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        {/* Overlay con color de la aplicación */}
        <div className={`absolute inset-0 ${theme.overlayColor}`}></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className={`absolute bottom-10 right-20 w-48 h-48 ${theme.accentColor} rounded-full blur-2xl`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${theme.accentColor} rounded-full blur-3xl`}></div>
        </div>
        
        {/* Contenido del header */}
        <div className="relative z-10 px-8 py-16">
          <div className="flex justify-between items-start">
            {/* Título y subtítulo */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                {title || theme.name}
              </h1>
              <p className="text-xl text-white font-medium drop-shadow-2xl">
                {subtitle || theme.subtitle}
              </p>
            </div>
            
            {/* Información adicional del usuario */}
            <div className="flex flex-col items-end space-y-4">
              {/* Stats del usuario */}
              {showStats && (
                <div 
                  className="flex items-center space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border-l-4"
                  style={{ borderColor: theme.primaryColor }}
                >
                  {customStats ? (
                    customStats
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-sm opacity-80">Nivel Espiritual</div>
                        <div className="font-bold text-lg">Iluminado</div>
                      </div>
                      <div className="w-px h-12 bg-white/30"></div>
                      <div className="text-center">
                        <div className="text-sm opacity-80">Puntos de Luz</div>
                        <div className="font-bold text-lg">1500</div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Navegación integrada */}
              <div className="flex items-center space-x-3">
                {/* Idioma */}
                <LanguageSelector inline variant="header" />
                
                {/* Carrito */}
                <button 
                  onClick={onCartClick}
                  className={buttonClass}
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
                
                {/* Gestión de Usuario */}
                <button 
                  onClick={onProfileClick}
                  className={buttonClass}
                  aria-label="Gestión de usuario"
                >
                  <User size={18} />
                  <span className="text-sm font-semibold">{getUserName()}</span>
                </button>

                {/* Logout */}
                <button 
                  onClick={onLogout}
                  className={buttonClass}
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
              
              {/* Botones de Audio y Volver */}
              <div className="flex items-center space-x-3">
                {showAudioControl && (
                  <button 
                    onClick={handleToggleAudio}
                    className={buttonClass}
                  >
                    {audioReproduciendo ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    <span className="text-sm font-semibold">{audioReproduciendo ? 'Silenciar' : 'Audio'}</span>
                  </button>
                )}
                
                <button 
                  onClick={onNavigateHome}
                  className={buttonClass}
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm font-semibold">Volver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Borde decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </div>
      
      {/* Indicador de scroll */}
      <ScrollIndicator />
    </div>
  );
};

export default UnifiedAngelicalHeader;
export { AppThemes };

