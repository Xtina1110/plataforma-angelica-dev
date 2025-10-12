import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';
import { toast, Toaster } from 'react-hot-toast';

// Importar componentes premium
import PremiumSidebar from './PremiumSidebar';
import EnhancedDashboardHeader from './EnhancedDashboardHeader';
import AIDailyMessage from './AIDailyMessage';
import FunctionalEventCalendar from './FunctionalEventCalendar';
import AnalyticsDashboard from './AnalyticsDashboard';
import GlobalSearch from './GlobalSearch';
import NotificationsCenter from './NotificationsCenter';

// Importar secciones existentes
import TiradaAngelical from './TiradaAngelical';
import CanalizacionesSonoterapia from './CanalizacionesSonoterapia';
import TerapiasLimpiezas from './TerapiasLimpiezas';
import AcademiaAngelical from './AcademiaAngelical';
import TiendaAngelical from './TiendaAngelical';
import EventosModernos from './EventosModernos';
import MensajeDelDia from './MensajeDelDia';

// Importar headers
import { 
  AperturaAngelicaHeader, 
  SonoterapiaHeader, 
  TerapiasHeader, 
  AcademiaHeader, 
  TiendaHeader, 
  BlogHeader,
  MensajeHeader,
  EventosHeader 
} from './headers';

import FooterLegal from './FooterLegal';

import './DashboardPremium.css';

const DashboardPremium = ({ user, onLogout, initialSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { changeSectionMusic } = useAudio();
  
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [theme, setTheme] = useState('light');

  // Efecto para manejar navegación desde URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sectionParam = urlParams.get('section');

    if (sectionParam) {
      setActiveSection(sectionParam);
    } else if (location.state?.section) {
      setActiveSection(location.state.section);
    } else if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [location.search, location.state, initialSection]);

  // Cambiar música según sección
  useEffect(() => {
    changeSectionMusic(activeSection);
  }, [activeSection, changeSectionMusic]);

  // Cambiar color de acento según sección
  useEffect(() => {
    const accentColors = {
      home: '#6E3CBC',
      tirada: '#00BCD4',
      canalizaciones: '#9C27B0',
      terapias: '#E91E63',
      academia: '#4CAF50',
      mensaje: '#B388FF',
      eventos: '#3F51B5',
      blog: '#FFC107',
      tienda: '#FF6F00'
    };

    document.documentElement.style.setProperty(
      '--accent-color',
      accentColors[activeSection] || '#6E3CBC'
    );
  }, [activeSection]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/inicio?section=${section}`);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    toast.success(`${item.nombre} añadido al carrito`);
  };

  const handleOpenCart = () => {
    setShowCart(true);
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // Implementar cambio de tema en el futuro
  };

  const handleNavigate = (section, data) => {
    setActiveSection(section);
    navigate(`/inicio?section=${section}`);
  };

  const renderSectionHeader = () => {
    switch (activeSection) {
      case 'tirada':
        return <AperturaAngelicaHeader />;
      case 'canalizaciones':
        return <SonoterapiaHeader />;
      case 'terapias':
        return <TerapiasHeader />;
      case 'academia':
        return <AcademiaHeader />;
      case 'tienda':
        return <TiendaHeader />;
      case 'blog':
        return <BlogHeader />;
      case 'mensaje':
        return <MensajeHeader />;
      case 'eventos':
        return <EventosHeader />;
      default:
        return null;
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="dashboard-home">
            {/* Dashboard Header */}
            <EnhancedDashboardHeader
              user={user}
              onLogout={onLogout}
              cartCount={cartItems.length}
              onOpenCart={handleOpenCart}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />

            {/* Búsqueda Global y Notificaciones */}
            <div className="dashboard-tools">
              <GlobalSearch onNavigate={handleNavigate} />
              <NotificationsCenter userId={user?.id} />
            </div>

            {/* Mensaje del Día con IA */}
            <AIDailyMessage />

            {/* Analytics Dashboard */}
            <AnalyticsDashboard userId={user?.id} />

            {/* Calendario de Eventos */}
            <div className="section-container">
              <h2 className="section-title">Próximos Eventos</h2>
              <FunctionalEventCalendar onAddToCart={handleAddToCart} />
            </div>

            {/* Footer */}
            <FooterLegal />
          </div>
        );

      case 'tirada':
        return (
          <>
            {renderSectionHeader()}
            <TiradaAngelical user={user} />
            <FooterLegal />
          </>
        );

      case 'canalizaciones':
        return (
          <>
            {renderSectionHeader()}
            <CanalizacionesSonoterapia user={user} />
            <FooterLegal />
          </>
        );

      case 'terapias':
        return (
          <>
            {renderSectionHeader()}
            <TerapiasLimpiezas user={user} />
            <FooterLegal />
          </>
        );

      case 'academia':
        return (
          <>
            {renderSectionHeader()}
            <AcademiaAngelical user={user} />
            <FooterLegal />
          </>
        );

      case 'mensaje':
        return (
          <>
            {renderSectionHeader()}
            <MensajeDelDia user={user} />
            <FooterLegal />
          </>
        );

      case 'eventos':
        return (
          <>
            {renderSectionHeader()}
            <EventosModernos user={user} onAddToCart={handleAddToCart} />
            <FooterLegal />
          </>
        );

      case 'blog':
        return (
          <>
            {renderSectionHeader()}
            <div className="blog-section">
              <h2>Blog & Podcast</h2>
              <p>Contenido espiritual próximamente...</p>
            </div>
            <FooterLegal />
          </>
        );

      case 'tienda':
        return (
          <>
            {renderSectionHeader()}
            <TiendaAngelical user={user} onAddToCart={handleAddToCart} />
            <FooterLegal />
          </>
        );

      default:
        return (
          <div className="dashboard-home">
            <EnhancedDashboardHeader
              user={user}
              onLogout={onLogout}
              cartCount={cartItems.length}
              onOpenCart={handleOpenCart}
            />
            <AIDailyMessage />
            <AnalyticsDashboard userId={user?.id} />
            <FunctionalEventCalendar onAddToCart={handleAddToCart} />
            <FooterLegal />
          </div>
        );
    }
  };

  return (
    <div className={`dashboard-premium ${theme}`}>
      <Toaster position="top-right" />
      
      {/* Premium Sidebar */}
      <PremiumSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        user={user}
      />

      {/* Main Content */}
      <div className={`dashboard-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderSectionContent()}
      </div>

      {/* Shopping Cart Modal (si se implementa) */}
      {showCart && (
        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Carrito de Compra</h2>
            {cartItems.length === 0 ? (
              <p>Tu carrito está vacío</p>
            ) : (
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <h4>{item.nombre}</h4>
                    <p>{item.precio}€</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowCart(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPremium;

