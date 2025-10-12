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
  userData = null,
  onSearchClick,
  onCartClick,
  onProfileClick,
  onLogout,
  onNavigateHome
}) => {
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();
  const { selectedLanguage, changeLanguage, availableLanguages } = useLanguage();

  // Cargar datos del usuario desde Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .maybeSingle();

          if (profileData && !profileError) {
            setUserProfile({
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              email: profileData.email
            });
          }
        } catch (error) {
          console.error('DashboardHeader - Error cargando perfil:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const getUserName = () => {
    // Prioridad 1: userData prop
    if (userData?.first_name) {
      return userData.first_name;
    }

    // Prioridad 2: Nombre desde la base de datos
    if (userProfile?.first_name) {
      return userProfile.first_name;
    }

    // Prioridad 3: Datos del user_metadata de Supabase Auth
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }

    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }

    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }

    // Prioridad 4: Extraer nombre del email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
      return formattedName;
    }

    // Fallback final
    return 'Usuario';
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
    <div className="w-full">
      {/* Header principal con gradiente morado */}
      <div className="relative overflow-hidden rounded-2xl mx-4 my-4 shadow-2xl">
        {/* Fondo con imagen angélica y degradación morada */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAngelico})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Transparencia sobre la imagen para mejor legibilidad */}
        <div className="absolute inset-0 bg-purple-600/40"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-purple-400/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Contenido del header */}
        <div className="relative z-10 px-8 py-16">
          <div className="flex justify-between items-start">
            {/* Saludo personalizado */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                {getPersonalizedGreeting()}
              </h1>
              <p className="text-xl text-white font-medium drop-shadow-2xl">
                Tu camino espiritual continúa evolucionando ✨
              </p>
            </div>

            {/* Información adicional del usuario */}
            <div className="flex flex-col items-end space-y-4">
              {/* Stats del usuario */}
              <div className="flex items-center space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border-l-4 border-purple-400">
                <div className="text-center">
                  <div className="text-sm opacity-80">Nivel Espiritual</div>
                  <div className="font-bold text-lg">{userData?.spiritual_level || 'Iniciado'}</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-sm opacity-80">Puntos de Luz</div>
                  <div className="font-bold text-lg">{userData?.light_points || 0}</div>
                </div>
              </div>

              {/* Navegación integrada - TODOS LOS BOTONES CON EL MISMO ESTILO */}
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-xl border-l-4 border-purple-400">
                {/* Idioma */}
                <LanguageSelector inline variant="header" />

                {/* Separador */}
                <div className="w-px h-8 bg-white/30"></div>
                
                {/* Carrito - ESTILO IGUAL AL DE IDIOMA */}
                <button 
                  onClick={onCartClick}
                  className="relative px-3 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-all duration-200 text-white border border-white/20 backdrop-blur-sm"
                  aria-label="Carrito de compras"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </button>
                
                {/* Gestión de Usuario - ESTILO IGUAL AL DE IDIOMA */}
                <button 
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-all duration-200 text-white border border-white/20 backdrop-blur-sm"
                  aria-label="Gestión de usuario"
                >
                  <User size={18} />
                  <span className="font-medium text-sm">{getUserName()}</span>
                </button>

                {/* Logout - ESTILO IGUAL AL DE IDIOMA */}
                <button 
                  onClick={onLogout}
                  className="px-3 py-2 bg-purple-600/50 hover:bg-red-600/70 rounded-lg transition-all duration-200 text-white border border-white/20 backdrop-blur-sm"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
              
              {/* Audio y Volver debajo */}
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
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <ScrollIndicator />
    </div>
  );
};

export default DashboardHeader;

