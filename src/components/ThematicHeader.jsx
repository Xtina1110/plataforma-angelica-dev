import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import ScrollIndicator from './ScrollIndicator';
import LanguageSelector from './LanguageSelector';
import fondoAngelico from '../assets/FondoAngelicoDashboard.png';

// Configuración de colores y mensajes por aplicación
const APP_CONFIG = {
  dashboard: {
    title: null, // Usará saludo personalizado
    subtitle: 'Tu camino espiritual continúa evolucionando ✨',
    color: '#9333EA', // purple-600
    usePersonalizedGreeting: true
  },
  
  apertura: {
    title: 'Apertura Angelical',
    subtitle: 'Abre tu corazón a la energía divina ✨',
    color: '#2563EB', // blue-600
    usePersonalizedGreeting: false
  },
  
  sonoterapia: {
    title: 'Sonoterapia',
    subtitle: 'Armoniza tu ser con vibraciones sanadoras 🎵',
    color: '#BB46D6', // purple custom
    usePersonalizedGreeting: false
  },
  
  terapias: {
    title: 'Terapias y Limpiezas',
    subtitle: 'Sana y purifica tu energía espiritual ✨',
    color: '#EC4899', // pink-600
    usePersonalizedGreeting: false
  },
  
  academia: {
    title: 'Academia Angelical',
    subtitle: 'Aprende y crece en sabiduría divina ✨',
    color: '#16A34A', // green-600
    usePersonalizedGreeting: false
  },
  
  mensajes: {
    title: 'Mensajes Angelicos',
    subtitle: 'Recibe la sabiduría angelical para tu día ✨',
    color: '#7C3AED', // violet-600
    usePersonalizedGreeting: false
  },
  
  tienda: {
    title: 'Tienda Angelical',
    subtitle: 'Productos espirituales para tu evolución ✨',
    color: '#EA580C', // orange-600
    usePersonalizedGreeting: false
  },
  
  eventos: {
    title: 'Eventos Angelicos',
    subtitle: 'Talleres, ceremonias y experiencias espirituales ✨',
    color: '#9333EA', // purple-600
    usePersonalizedGreeting: false
  },
  
  blog: {
    title: 'Blog Angelical',
    subtitle: 'Sabiduría y experiencias espirituales ✨',
    color: '#CA8A04', // yellow-600
    usePersonalizedGreeting: false
  },
  
  podcast: {
    title: 'Podcast Angelical',
    subtitle: 'Conversaciones iluminadoras sobre espiritualidad ✨',
    color: '#4F46E5', // indigo-600
    usePersonalizedGreeting: false
  },
  
  reservas: {
    title: 'Sistema de Reservas',
    subtitle: 'Agenda tu sesión espiritual personalizada ✨',
    color: '#0D9488', // teal-600
    usePersonalizedGreeting: false
  },
  
  consulta: {
    title: 'Consulta en Vivo',
    subtitle: 'Conexión espiritual en tiempo real ✨',
    color: '#8B5CF6', // violet-500
    usePersonalizedGreeting: false
  }
};

const ThematicHeader = ({ 
  appType = 'dashboard',
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

  // Obtener configuración para la app actual
  const config = APP_CONFIG[appType] || APP_CONFIG.dashboard;

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
    // Prioridad 1: Nombre desde la base de datos
    if (userProfile?.nombre) {
      return userProfile.nombre;
    }
    
    // Prioridad 2: Datos del user_metadata de Supabase Auth
    if (user?.user_metadata?.nombre || user?.user_metadata?.name || user?.user_metadata?.full_name) {
      return user.user_metadata.nombre || user.user_metadata.name || user.user_metadata.full_name;
    }
    
    // Prioridad 3: Extraer nombre del email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
    }
    
    return 'Usuario';
  };

  const getTitle = () => {
    // Si la app usa saludo personalizado (Dashboard)
    if (config.usePersonalizedGreeting) {
      const name = getUserName();
      const hour = new Date().getHours();
      
      if (hour < 12) {
        return `¡Buenos días, ${name}!`;
      } else if (hour < 18) {
        return `¡Buenas tardes, ${name}!`;
      } else {
        return `¡Buenas noches, ${name}!`;
      }
    }
    
    // Para otras apps, usar el título configurado
    return config.title;
  };

  const handleToggleAudio = () => {
    setAudioReproduciendo(!audioReproduciendo);
    if (onToggleAudio) {
      onToggleAudio(!audioReproduciendo);
    }
  };

  return (
    <div className="w-full">
      {/* Header principal con gradiente personalizado */}
      <div className="relative overflow-hidden rounded-2xl mx-4 my-4 shadow-2xl">
        {/* Fondo con imagen angélica */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAngelico})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Transparencia con color específico sobre la imagen */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: `${config.color}40` }}
        />
        
        {/* Efectos decorativos */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl" />
          <div 
            className="absolute bottom-10 right-20 w-48 h-48 rounded-full blur-2xl" 
            style={{ backgroundColor: `${config.color}30` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" 
            style={{ backgroundColor: `${config.color}20` }}
          />
        </div>
        
        {/* Contenido del header */}
        <div className="relative z-10 px-8 py-16">
          <div className="flex justify-between items-start">
            {/* Izquierda: Título y mensaje */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                {getTitle()}
              </h1>
              <p className="text-xl text-white font-medium drop-shadow-2xl">
                {config.subtitle}
              </p>
            </div>
            
            {/* Derecha: Información y navegación */}
            <div className="flex flex-col items-end space-y-4">
              {/* Stats del usuario */}
              <div 
                className="flex items-center space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border-l-4"
                style={{ borderLeftColor: config.color }}
              >
                <div className="text-center">
                  <div className="text-sm opacity-80">Nivel Espiritual</div>
                  <div className="font-bold text-lg">Iluminado</div>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <div className="text-sm opacity-80">Puntos de Luz</div>
                  <div className="font-bold text-lg">1500</div>
                </div>
              </div>
              
              {/* Navegación integrada */}
              <div 
                className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-xl border-l-4"
                style={{ borderLeftColor: config.color }}
              >
                {/* Idioma */}
                <LanguageSelector inline variant="header" />
                
                {/* Separador */}
                <div className="w-px h-8 bg-white/30" />
                
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
                
                {/* Usuario */}
                <button 
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-white/90 hover:text-white"
                  aria-label="Perfil de usuario"
                >
                  <User size={20} />
                  <span className="font-medium text-sm">{getUserName()}</span>
                </button>

                {/* Logout */}
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:text-red-200"
                  style={{ color: config.color }}
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
              
              {/* Botones de Audio y Volver */}
              <div className="flex items-center space-y-3">
                <button 
                  onClick={handleToggleAudio}
                  className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg"
                >
                  {audioReproduciendo ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className="text-sm">{audioReproduciendo ? 'Silenciar' : 'Audio'}</span>
                </button>
                
                {onNavigateHome && (
                  <button 
                    onClick={onNavigateHome}
                    className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg ml-3"
                  >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Volver</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Borde decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
      
      {/* Indicador de scroll */}
      <ScrollIndicator />
    </div>
  );
};

export default ThematicHeader;

