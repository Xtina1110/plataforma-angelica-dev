import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Settings, Globe, Heart, ArrowLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import ScrollIndicator from './ScrollIndicator';
import AudioButton from './AudioButton';
import fondoAngelico from '../assets/FondoAngelicoDashboard.png';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const DashboardHeader = ({ 
  cartCount = 0, 
  user = null,
  onSearchClick,
  onCartClick,
  onProfileClick,
  onLogout,
  onNavigateHome
}) => {
  const [userProfile, setUserProfile] = useState(null);
const { toast } = useToast();
  const { selectedLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Debug: Log user cuando cambie
  useEffect(() => {
    console.log('DashboardHeader - User object:', user);
    console.log('DashboardHeader - User email:', user?.email);
    console.log('DashboardHeader - User metadata:', user?.user_metadata);
    console.log('DashboardHeader - User ID:', user?.id);
  }, [user]);

  // Cargar datos del usuario desde Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        console.log('DashboardHeader - Loading profile for user ID:', user.id);
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('usuarios')
            .select('nombre, email')
            .eq('id', user.id)
            .maybeSingle();

          console.log('DashboardHeader - Profile data:', profileData);
          console.log('DashboardHeader - Profile error:', profileError);

          if (profileData && !profileError) {
            setUserProfile({
              nombre: profileData.nombre,
              email: profileData.email
            });
            console.log('DashboardHeader - UserProfile set to:', { nombre: profileData.nombre, email: profileData.email });
          } else {
            console.log('DashboardHeader - No profile data found, using user fallback');
          }
        } catch (error) {
          console.error('DashboardHeader - Error cargando perfil:', error);
        }
      } else {
        console.log('DashboardHeader - No user provided');
      }
    };

    loadUserProfile();
  }, [user]);

  const getUserName = () => {
    // Prioridad 1: Nombre desde la base de datos
    if (userProfile?.nombre) {
      console.log('Using nombre from DB:', userProfile.nombre);
      return userProfile.nombre;
    }

    // Prioridad 2: Datos del user_metadata de Supabase Auth
    if (user?.user_metadata?.nombre) {
      console.log('Using nombre from user_metadata:', user.user_metadata.nombre);
      return user.user_metadata.nombre;
    }

    if (user?.user_metadata?.name) {
      console.log('Using name from user_metadata:', user.user_metadata.name);
      return user.user_metadata.name;
    }

    if (user?.user_metadata?.full_name) {
      console.log('Using full_name from user_metadata:', user.user_metadata.full_name);
      return user.user_metadata.full_name;
    }

    // Prioridad 3: Extraer nombre del email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
      console.log('Using email-derived name:', formattedName, 'from', user.email);
      return formattedName;
    }

    // Fallback final
    console.log('Using fallback: Usuario');
    return 'Usuario';
  };

  const getUserEmail = () => {
    // Prioridad 1: Email desde la base de datos
    if (userProfile?.email) {
      return userProfile.email;
    }

    // Prioridad 2: Email desde user
    if (user?.email) {
      return user.email;
    }

    return '';
  };

  const getPersonalizedGreeting = () => {
    const name = getUserName();
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return `¡Buenos días, ${name}!`;
    } else if (hour < 18) {
      return `¡Buenas tardes, ${name}!`;
    } else {
      return `¡Buenas noches, ${name}!`;
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Header principal con gradiente morado */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl mx-2 sm:mx-3 md:mx-4 shadow-xl max-w-full">
        {/* Fondo con imagen angélica y degradación morada */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAngelico})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Capa morada transparente directa sobre la imagen */}
        <div className="absolute inset-0 bg-purple-600/40"></div>

        {/* Degradación morada adicional */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-purple-600/25 to-violet-500/20"></div>

        {/* Overlay adicional muy sutil para mejorar legibilidad */}
        <div className="absolute inset-0 bg-purple-900/10"></div>

        {/* Efectos de fondo decorativos */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-purple-400/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Contenido del header */}
        <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
            {/* Saludo personalizado */}
            <div className="flex items-center w-full lg:w-auto">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl">
                  {getPersonalizedGreeting()}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium drop-shadow-2xl">
                  Tu camino espiritual continúa evolucionando ✨
                </p>
              </div>
            </div>

            {/* Información adicional del usuario */}
            <div className="flex flex-col items-start lg:items-end space-y-3 sm:space-y-4 w-full lg:w-auto">
              {/* Stats del usuario */}
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border border-white/20 text-xs sm:text-sm md:text-base">
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs md:text-sm opacity-80">Nivel Espiritual</div>
                  <div className="font-bold text-sm sm:text-base md:text-lg">Iluminado</div>
                </div>
                <div className="w-px h-8 sm:h-10 md:h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs md:text-sm opacity-80">Puntos de Luz</div>
                  <div className="font-bold text-sm sm:text-base md:text-lg">1500</div>
                </div>
              </div>

              {/* Navegación integrada */}
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20">
                {/* Idioma */}
                <div className="flex items-center gap-2">
                  <LanguageSelector inline variant="header" />
                </div>

                {/* Separador */}
                <div className="w-px h-8 bg-white/30"></div>
                
                {/* Carrito */}
                <button 
                  onClick={onCartClick}
                  className="relative p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-white/90 hover:text-white"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
                
                {/* Gestión de Usuario */}
                <button 
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-white/90 hover:text-white"
                  aria-label="Gestión de usuario"
                >
                  <User size={20} />
                  <span className="font-medium text-sm">{getUserName()}</span>
                </button>

                {/* Logout */}
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-purple-200 hover:text-red-200"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
              
              {/* Audio debajo de la barra + Volver */}
              <div className="flex items-center space-x-3">
                <AudioButton 
                  variant="header" 
                  showText={false}
                />
                {onNavigateHome && (
                  <button 
                    onClick={onNavigateHome}
                    className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg"
                  >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Volver</span>
                  </button>
                )}
              </div>

            </div>
          </div>
          
          {/* Borde decorativo inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <ScrollIndicator />
    </div>
  );
};

export default DashboardHeader;