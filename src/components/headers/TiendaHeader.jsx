import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Settings, Globe, Store, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';
import ScrollIndicator from '../ScrollIndicator';
import LanguageSelector from '../LanguageSelector';
import fondoAngelico from '../../assets/FondoAngelicoDashboard.png';

const TiendaHeader = ({ 
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
            .select('display_name, email')
            .eq('user_id', user.id)
            .maybeSingle();

          if (profileData && !profileError) {
            setUserProfile({
              nombre: profileData.display_name,
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
    if (userProfile?.nombre) return userProfile.nombre;
    if (user?.user_metadata?.nombre || user?.user_metadata?.name) {
      return user.user_metadata.nombre || user.user_metadata.name;
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

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl mx-4 my-4 shadow-2xl">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAngelico})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        {/* Capa transparente directa sobre la imagen - Color Anaranjado */}
        <div className="absolute inset-0" style={{ backgroundColor: '#FF6D00', opacity: 0.4 }}></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FF6D0020, #FF6D0030, #FF6D0025)' }}></div>
        <div className="absolute inset-0" style={{ backgroundColor: '#FF6D00', opacity: 0.1 }}></div>
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-amber-400/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 px-8 py-16">
          <div className="flex justify-between items-start">
            {/* Título principal */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                Tienda Angélica
              </h1>
              <p className="text-xl text-white font-medium drop-shadow-2xl">
                Productos espirituales para tu evolución ✨
              </p>
            </div>
            
            {/* Información adicional del usuario */}
            <div className="flex flex-col items-end space-y-4">
              {/* Stats del usuario */}
              <div className="flex items-center space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border-l-4 border-orange-400">
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
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-xl border-l-4 border-orange-400">
                {/* Idioma (lista completa) */}
                <LanguageSelector inline variant="header" />
                
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
                  className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-orange-200 hover:text-red-200"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
              
              {/* Botones de Audio y Volver al Dashboard */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleToggleAudio}
                  className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg"
                >
                  {audioReproduciendo ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className="text-sm">{audioReproduciendo ? 'Silenciar' : 'Audio'}</span>
                </button>
                
                <button 
                  onClick={onNavigateHome}
                  className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Volver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </div>
      
      <ScrollIndicator />
    </div>
  );
};

export default TiendaHeader;