import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingCart, LogOut, Bell, Search, Menu, X } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import AudioButton from './AudioButton';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/Logosinfondo.png';
import './Dashboard.css';
import './Dashboard-sidebar-colors.css';

/**
 * DashboardSidebar - Componente reutilizable del sidebar del Dashboard
 * Mantiene el diseño exacto del Dashboard principal sin modificaciones
 */
const DashboardSidebar = ({ 
  user,
  onLogout,
  activeSection = 'home',
  onNavigate,
  cartCount = 0,
  unreadNotifications = 0,
  onCartClick,
  onNotificationsClick,
  onSearchClick,
  onProfileClick,
  isMobile = false
}) => {
  const navigate = useNavigate();
  const { getCurrentTranslation } = useLanguage();
  const translations = getCurrentTranslation();
  const t = translations.dashboard;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .select('email, subscription_plan')
            .eq('id', user.id)
            .maybeSingle();

          if (data && !error) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [user]);

  const menuItems = [
    { 
      id: 'home', 
      icon: '/iconos-apps/icono-3d-inicio.png', 
      label: 'Inicio', 
      color: '#6E3CBC',
      route: '/dashboard'
    },
    { 
      id: 'tirada', 
      icon: '/iconos-apps/icono-3d-apertura.png', 
      label: 'Apertura Angelica', 
      color: '#00BCD4',
      route: '/apertura-angelica'
    },
    { 
      id: 'canalizaciones', 
      icon: '/iconos-apps/icono-3d-sonoterapia.png', 
      label: 'Sonoterapia y Canalizaciones', 
      color: '#9C27B0',
      route: '/sonoterapia-canalizaciones'
    },
    { 
      id: 'terapias', 
      icon: '/iconos-apps/icono-3d-terapias.png', 
      label: 'Terapias y Limpiezas', 
      color: '#E91E63',
      route: '/terapias-limpiezas'
    },
    { 
      id: 'academia', 
      icon: '/iconos-apps/icono-3d-academia.png', 
      label: 'Academia Angelica', 
      color: '#4CAF50',
      route: '/academia-angelical'
    },
    { 
      id: 'mensaje', 
      icon: '/iconos-apps/icono-3d-mensaje.png', 
      label: 'Mensaje Diario', 
      color: '#B388FF',
      route: '/mensaje-diario'
    },
    { 
      id: 'eventos', 
      icon: '/iconos-apps/icono-3d-eventos.png', 
      label: 'Eventos Angelicales', 
      color: '#3F51B5',
      route: '/eventos-angelicales'
    },
    { 
      id: 'blog', 
      icon: '/iconos-apps/icono-3d-blog.png', 
      label: 'Blog y Podcast', 
      color: '#FFC107',
      route: '/podcast-blog'
    },
    { 
      id: 'tienda', 
      icon: '/iconos-apps/icono-3d-tienda.png', 
      label: 'Tienda', 
      color: '#FF9800',
      route: '/tienda'
    },
  ];

  const handleMenuNavigation = (item) => {
    if (onNavigate) {
      onNavigate(item.id);
    }
    if (item.route) {
      navigate(item.route);
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      navigate('/carrito');
    }
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/perfil');
    }
  };

  return (
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
        {menuItems.map(item => (
          <li
            key={item.id}
            onClick={() => handleMenuNavigation(item)}
            className={activeSection === item.id ? 'active' : ''}
            style={{
              '--item-color': item.color,
              '--hover-color': item.color,
              '--active-color': item.color
            }}
          >
            <div className="nav-item-content">
              <img src={item.icon} alt={item.label} className="nav-item-icon-3d" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar" onClick={handleProfileClick}>
            <User size={20} />
          </div>
          {!sidebarCollapsed && (
            <div className="user-details">
              <span className="user-email">{userData?.email || user?.email || 'usuario@email.com'}</span>
              <span className="user-status">{userData?.subscription_plan || 'Free'}</span>
            </div>
          )}
        </div>
        
        {/* Botón de audio */}
        <div className="audio-button-container">
          <AudioButton 
            variant="sidebar" 
            showText={!sidebarCollapsed}
            className="w-full"
          />
        </div>
        
        {/* Botón del carrito */}
        <div className="cart-button-container">
          <button onClick={handleCartClick} className="cart-button cart-button-orange">
            <ShoppingCart size={16} />
            {!sidebarCollapsed && <span>{t.cart}</span>}
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
        
        {/* Botón de notificaciones */}
        <div className="notifications-button-container">
          <button onClick={handleNotificationsClick} className="cart-button cart-button-blue">
            <Bell size={16} />
            {!sidebarCollapsed && <span>Notificaciones</span>}
            {unreadNotifications > 0 && (
              <span className="cart-badge">{unreadNotifications}</span>
            )}
          </button>
        </div>
        
        {/* Botón de búsqueda */}
        <div className="search-button-container">
          <button onClick={handleSearchClick} className="cart-button cart-button-teal" title="Buscar (Ctrl+K)">
            <Search size={16} />
            {!sidebarCollapsed && <span>Buscar</span>}
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
  );
};

export default DashboardSidebar;

