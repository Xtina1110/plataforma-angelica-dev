import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Settings, Globe, Mic, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';
import ScrollIndicator from '../ScrollIndicator';
import LanguageSelector from '../LanguageSelector';
import fondoAngelico from '../../assets/FondoAngelicoDashboard.png';

const BlogHeader = ({ 
  cartCount = 0, 
  user = null,
  onSearchClick,
  onCartClick,
  onProfileClick,
  onLogout,
  onNavigateHome,
  audioActive = false,
  onToggleAudio
}) => {
  const [userProfile, setUserProfile] = useState(null);
  
  const [audioReproduciendo, setAudioReproduciendo] = useState(audioActive);
  const { toast } = useToast();

  // Cargar datos del usuario desde Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, email')
            .eq('id', user.id)
            .maybeSingle();

          if (profileData && !profileError) {
            setUserProfile({
              first_name: profileData.first_name,
              email: profileData.email
            });
          }
        } catch (error) {
          console.error('Error cargando perfil:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const getUserName = () => {
    // Prioridad 1: Nombre desde la base de datos
    if (userProfile?.first_name) {
      return userProfile.first_name;
    }
    
    // Prioridad 2: Datos del user_metadata de Supabase Auth
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }

    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }

    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // Prioridad 3: Extraer nombre del email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
      return formattedName;
    }
    
    // Fallback final
    return 'Usuario';
  };


  const handleToggleAudio = () => {
    setAudioReproduciendo(!audioReproduciendo);
    if (onToggleAudio) {
      onToggleAudio(!audioReproduciendo);
    }
  };

  return (
    <div className="w-full">
      {/* Header principal con gradiente amarillo */}
      <div className="relative overflow-hidden rounded-2xl mx-4 my-4 shadow-2xl">
        {/* Fondo con imagen angélica y degradación amarilla */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAngelico})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        {/* Transparencia con color específico #FFC107 (Amarillo/Dorado) sobre la imagen para mejor legibilidad */}
        <div className="absolute inset-0" style={{ backgroundColor: '#FFC10730' }}></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full blur-2xl" style={{ backgroundColor: '#FFC10740' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#FFC10725' }}></div>
        </div>
        
        {/* Contenido del header */}
        <div className="relative z-10 px-8 py-16">
          <div className="flex justify-between items-start">
            {/* Título */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                Blog & Podcast
              </h1>
              <p className="text-xl text-white font-medium drop-shadow-2xl">
                Sabiduría y experiencias espirituales ✨
              </p>
              
            </div>
            
            {/* Información adicional del usuario */}
            <div className="flex flex-col items-end space-y-4">
              {/* Stats del usuario */}
              <div className="flex items-center space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border-l-4" style={{ borderLeftColor: '#FFCC00' }}>
                <div className="text-center">
                  <div className="text-sm opacity-80">Nivel Espiritual</div>
                  <div className="font-bold text-lg">Iluminado</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-sm opacity-80">Puntos de Luz</div>
                  <div className="font-bold text-lg">1500</div>
                </div>
              </div>
              
              {/* Navegación integrada */}
              <div className="flex items-center space-x-3">
                {/* Idioma */}
                <LanguageSelector inline variant="header" colorClasses="flex items-center space-x-2 bg-yellow-800 hover:bg-yellow-700 border-2 border-yellow-600 hover:border-yellow-500 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105" />
                
                {/* Carrito */}
                <button 
                  onClick={onCartClick}
                  className="relative flex items-center space-x-2 bg-yellow-800 hover:bg-yellow-700 border-2 border-yellow-600 hover:border-yellow-500 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
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
                  className="flex items-center space-x-2 bg-yellow-800 hover:bg-yellow-700 border-2 border-yellow-600 hover:border-yellow-500 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
                  aria-label="Gestión de usuario"
                >
                  <User size={18} />
                  <span className="text-sm font-semibold">{getUserName()}</span>
                </button>

                {/* Logout */}
                <button 
                  onClick={onLogout}
                  className="flex items-center space-x-2 bg-yellow-800 hover:bg-yellow-700 border-2 border-yellow-600 hover:border-yellow-500 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
              
              {/* Botones de Audio y Volver */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleToggleAudio}
                  className="flex items-center space-x-2 bg-yellow-800 hover:bg-yellow-700 border-2 border-yellow-600 hover:border-yellow-500 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  {audioReproduciendo ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className="text-sm font-semibold">{audioReproduciendo ? 'Silenciar' : 'Audio'}</span>
                </button>
                
                <button 
                  onClick={onNavigateHome}
                  className="flex items-center space-x-2 bg-yellow-800 hover:bg-yellow-700 border-2 border-yellow-600 hover:border-yellow-500 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
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

export default BlogHeader;