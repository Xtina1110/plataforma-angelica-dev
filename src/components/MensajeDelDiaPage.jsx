import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAutoScrollToContent from '../hooks/useAutoScrollToContent';
import {
  Home, Heart, Headphones, Zap, BookOpen, GraduationCap,
  MessageSquare, Mic, ShoppingCart, LogOut, User, Menu, X,
  ArrowLeft, Search, Star, Sparkles
} from 'lucide-react';
import fondoPaisaje from '../assets/FondoPaisajeTranquilo.png';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';
import { useIsMobile } from '../hooks/use-mobile';
import ScrollIndicator from './ScrollIndicator';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import LanguageSelector from './LanguageSelector';
import logo from '../assets/Logosinfondo.png';
import './Dashboard.css';

const MensajeDelDiaPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { getCurrentTranslation } = useLanguage();
  const { isPlaying, toggleAudio } = useAudio();
  const isMobile = useIsMobile();
  
  // Auto-scroll to main content after 5 seconds
  useAutoScrollToContent('.main-content', 5000);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const translations = getCurrentTranslation();
  const t = translations.dashboard;

  // Sistema de mensajes diarios con rotación automática
  const mensajesAngelicales = [
    { mensaje: "Tu luz interior brilla más fuerte cada día. Los ángeles amplifican tu radiancia espiritual.", arcangel: "Arcángel Miguel", energia: "Protección y Fuerza" },
    { mensaje: "Encuentra la belleza en cada momento. Los ángeles te invitan a celebrar la alegría que existe en tu vida.", arcangel: "Arcángel Gabriel", energia: "Comunicación Divina" },
    { mensaje: "La sanación fluye a través de ti como un río de luz dorada. Permite que tu corazón se abra a nuevas posibilidades.", arcangel: "Arcángel Rafael", energia: "Sanación y Renovación" },
    { mensaje: "Tu sabiduría interior es un faro que guía a otros hacia la luz. Confía en tu intuición angelical.", arcangel: "Arcángel Uriel", energia: "Sabiduría y Claridad" },
    { mensaje: "El amor incondicional fluye desde tu corazón hacia todo lo que te rodea. Eres un canal de amor divino.", arcangel: "Arcángel Chamuel", energia: "Amor Incondicional" },
    { mensaje: "La creatividad divina se manifiesta a través de tus acciones. Cada paso que das crea belleza en el mundo.", arcangel: "Arcángel Jofiel", energia: "Belleza y Creatividad" },
    { mensaje: "La justicia divina trabaja a tu favor. Confía en que el universo conspira para tu mayor bien.", arcangel: "Arcángel Raguel", energia: "Justicia Divina" }
  ];

  const obtenerMensajeDelDia = () => {
    const hoy = new Date();
    const inicioAño = new Date(hoy.getFullYear(), 0, 1);
    const diaDelAño = Math.floor((hoy - inicioAño) / (24 * 60 * 60 * 1000));
    const indiceMensaje = diaDelAño % mensajesAngelicales.length;
    
    const opcionesFecha = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return {
      fecha: hoy.toLocaleDateString('es-ES', opcionesFecha),
      ...mensajesAngelicales[indiceMensaje]
    };
  };

  const mensajeDelDia = obtenerMensajeDelDia();


  // Función para manejar la navegación del menú
  const handleMenuNavigation = (sectionId) => {
    if (sectionId === 'home') {
      navigate('/dashboard');
    } else if (sectionId === 'mensaje') {
      // Ya estamos en mensaje del día
      return;
    } else {
      navigate('/dashboard');
      // Aquí podrías agregar lógica para navegar a otras secciones específicas
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: t.home, color: '#6a0dad' },
    { id: 'tirada', icon: Heart, label: t.angelicReading, color: '#4fc3f7' },
    { id: 'canalizaciones', icon: Headphones, label: t.soundTherapy, color: '#b39ddb' },
    { id: 'terapias', icon: Zap, label: t.therapies, color: '#f48fb1' },
    { id: 'academia', icon: GraduationCap, label: t.academy, color: '#81c784' },
    { id: 'mensaje', icon: MessageSquare, label: t.dailyMessage, color: '#9575cd' },
    { id: 'blog', icon: Mic, label: t.blogPodcast, color: '#d4af37' },
    { id: 'tienda', icon: ShoppingCart, label: t.store, color: '#ff8a65' },
  ];

  const renderCart = () => (
    <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>{t.cart}</h2>
          <button onClick={() => setShowCart(false)} className="close-cart">
            <X size={24} />
          </button>
        </div>
        <div className="cart-content">
          <div className="cart-empty">
            <ShoppingCart size={48} />
            <p>{t.emptyCart}</p>
            <span>{t.addProducts}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>{t.settings}</h2>
          <button onClick={() => setShowSettings(false)} className="close-settings">
            <X size={24} />
          </button>
        </div>
        <div className="settings-content">
          <div className="settings-section">
            <h3>{t.personalInfo}</h3>
            <p>Configuraciones de usuario...</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar lateral igual al Dashboard */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile-sidebar' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo JCA" className="sidebar-logo" />
          {!sidebarCollapsed && <h3 className="sidebar-title">{translations.title}</h3>}
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        
        <ul className="sidebar-nav">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <li 
                key={item.id}
                onClick={() => handleMenuNavigation(item.id)}
                className={item.id === 'mensaje' ? 'active' : ''}
                style={{ '--item-color': item.color }}
              >
                <IconComponent size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </li>
            );
          })}
        </ul>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar" onClick={() => setShowSettings(true)}>
              <User size={20} />
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-email">{user?.email || 'usuario@email.com'}</span>
                <span className="user-role">Usuario Premium</span>
              </div>
            )}
          </div>
          
          {/* Botón del carrito */}
          <div className="cart-button-container">
            <button onClick={() => setShowCart(true)} className="cart-button">
              <ShoppingCart size={16} />
              {!sidebarCollapsed && <span>{t.cart}</span>}
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <button onClick={onLogout} className="logout-button">
              <LogOut size={16} />
              {t.logout}
            </button>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''} ${isMobile ? 'mobile-main' : ''}`}>
        <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${fondoPaisaje})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80" />
        
        {/* Contenido del header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          {/* Barra de navegación */}
          <div className="flex items-center justify-between mb-8">
            {/* Botón volver */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver al Dashboard</span>
            </button>

            {/* Controles derecha */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Título y búsqueda */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mensaje del Día
            </h1>
            
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Conecta con la sabiduría angelical y recibe orientación divina para tu día
            </p>

          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Sección del mensaje del día */}
        <div className="mensaje-del-dia-hero" style={{
          backgroundImage: `url(${fondoPaisaje})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          borderRadius: '25px',
          overflow: 'hidden',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 50px',
          marginBottom: '50px'
        }}>
          
          {/* Overlay con gradiente morado a azul */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.4) 0%, rgba(138, 43, 226, 0.35) 50%, rgba(30, 144, 255, 0.3) 100%)',
            backdropFilter: 'blur(3px)',
            zIndex: 1
          }}></div>
          
          {/* Contenido del texto - lado izquierdo */}
          <div className="mensaje-content" style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'left',
            flex: 1,
            maxWidth: '65%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Mensaje principal con más transparencia */}
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#2D1B69',
              lineHeight: 1.6,
              margin: '15px 0',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.3px',
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              {mensajeDelDia.mensaje}
            </h2>
            
            {/* Información del arcángel sin fondo - color dorado SIN SOMBRA */}
            <div style={{
              fontSize: '1.2rem',
              color: '#d4af37',
              fontWeight: 700,
              marginBottom: '20px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px',
              padding: '12px 0'
            }}>
              — {mensajeDelDia.arcangel} • {mensajeDelDia.energia}
            </div>
          </div>

          {/* Ícono de ángel y botón - lado derecho */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '-50px'
          }}>
            {/* Imagen del ángel con alas doradas y moradas - MUCHO MÁS GRANDE */}
            <img 
              src="/lovable-uploads/f657261f-fea1-4c3a-b494-b1fb44c8dc94.png" 
              alt="Ángel Guardián"
              style={{
                width: '300px',
                height: 'auto',
                filter: 'drop-shadow(0 8px 16px rgba(106, 13, 173, 0.4)) drop-shadow(0 4px 8px rgba(30, 144, 255, 0.3))',
                transform: 'perspective(100px) rotateX(5deg)',
                marginBottom: '15px',
                animation: 'float 3s ease-in-out infinite'
              }}
            />
            
            {/* Botón de audio */}
            <button 
              onClick={toggleAudio}
              style={{
                background: isPlaying 
                  ? 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)' 
                  : 'linear-gradient(135deg, #6a0dad 0%, #8a2be2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '1px',
                boxShadow: isPlaying 
                  ? '0 8px 25px rgba(255, 71, 87, 0.4)' 
                  : '0 8px 25px rgba(106, 13, 173, 0.4)',
                transition: 'all 0.3s ease',
                outline: 'none',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = isPlaying 
                  ? '0 12px 35px rgba(255, 71, 87, 0.6)' 
                  : '0 12px 35px rgba(106, 13, 173, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isPlaying 
                  ? '0 8px 25px rgba(255, 71, 87, 0.4)' 
                  : '0 8px 25px rgba(106, 13, 173, 0.4)';
              }}
            >
              <Headphones size={16} />
              {isPlaying ? 'Pausar Audio' : 'Música Angelical'}
            </button>
          </div>
        </div>

        {/* Sección de instrucciones */}
        <InstruccionesAngelicales 
          titulo="Conexión Angelical Diaria"
          descripcion="Recibe mensajes personalizados de tus ángeles para guiar tu día con luz y sabiduría"
          colorPrimario="purple"
          instrucciones={[
            {
              icono: Heart,
              titulo: "Momento Sagrado",
              descripcion: "Dedica unos minutos cada mañana para conectar con tu mensaje angelical en silencio."
            },
            {
              icono: Star,
              titulo: "Reflexión Profunda",
              descripcion: "Medita sobre el mensaje y cómo se aplica a los desafíos o alegrías de tu día."
            },
            {
              icono: Sparkles,
              titulo: "Integración Diaria",
              descripcion: "Lleva la sabiduría del mensaje contigo y permite que guíe tus decisiones."
            }
          ]}
          llamadaAccion="Recibe tu mensaje"
        />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

          {/* Estilos para la animación de flotación */}
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: perspective(100px) rotateX(5deg) translateY(0); }
              50% { transform: perspective(100px) rotateX(5deg) translateY(-10px); }
            }
          `}</style>
        </div>
      </main>

      {/* Modales */}
      {showSettings && renderSettings()}
      {showCart && renderCart()}
    </div>
  );
};

export default MensajeDelDiaPage;