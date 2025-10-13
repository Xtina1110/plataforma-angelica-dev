import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { User, ShoppingCart, LogOut, Bell, Search, Menu, X } from 'lucide-react';
import { AperturaAngelicaHeader } from '../components/headers';
import SistemaReservasCompleto from '../components/BookingSystem/SistemaReservasCompleto';
import AudioButton from '../components/AudioButton';
import '../components/Dashboard.css';
import '../components/Dashboard-sidebar-colors.css';

const logo = '/Logosinfondo.png';

const BookingPageApertura = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  // Cargar contador del carrito
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('angelical_cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleMenuNavigation = (id) => {
    const routes = {
      'home': '/dashboard',
      'tirada': '/apertura-angelica',
      'canalizaciones': '/sonoterapia-canalizaciones',
      'terapias': '/terapias-limpiezas',
      'academia': '/academia-angelical',
      'mensaje': '/mensaje-diario',
      'eventos': '/eventos-angelicales',
      'blog': '/podcast-blog',
      'tienda': '/tienda'
    };
    
    if (routes[id]) {
      navigate(routes[id]);
    }
  };

  const menuItems = [
    { id: 'home', icon: '/iconos-apps/icono-3d-inicio.png', label: 'Inicio', color: '#6E3CBC' },
    { id: 'tirada', icon: '/iconos-apps/icono-3d-apertura.png', label: 'Apertura Angelica', color: '#00BCD4' },
    { id: 'canalizaciones', icon: '/iconos-apps/icono-3d-sonoterapia.png', label: 'Sonoterapia y Canalizaciones', color: '#9C27B0' },
    { id: 'terapias', icon: '/iconos-apps/icono-3d-terapias.png', label: 'Terapias y Limpiezas', color: '#E91E63' },
    { id: 'academia', icon: '/iconos-apps/icono-3d-academia.png', label: 'Academia Angelica', color: '#4CAF50' },
    { id: 'mensaje', icon: '/iconos-apps/icono-3d-mensaje.png', label: 'Mensaje Diario', color: '#B388FF' },
    { id: 'eventos', icon: '/iconos-apps/icono-3d-eventos.png', label: 'Eventos Angelicales', color: '#3F51B5' },
    { id: 'blog', icon: '/iconos-apps/icono-3d-blog.png', label: 'Blog y Podcast', color: '#FFC107' },
    { id: 'tienda', icon: '/iconos-apps/icono-3d-tienda.png', label: 'Tienda', color: '#FF9800' },
  ];

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo JCA" className="sidebar-logo" />
          {!sidebarCollapsed && <h3 className="sidebar-title">PLATAFORMA ANGÉLICA</h3>}
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
              onClick={() => handleMenuNavigation(item.id)}
              className={item.id === 'tirada' ? 'active' : ''}
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
            <div className="user-avatar">
              <User size={20} />
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-email">{user?.email || 'usuario@email.com'}</span>
                <span className="user-status">PREMIUM</span>
              </div>
            )}
          </div>
          
          <div className="audio-button-container">
            <AudioButton 
              variant="sidebar" 
              showText={!sidebarCollapsed}
              className="w-full"
            />
          </div>
          
          <div className="cart-button-container">
            <button onClick={() => navigate('/carrito')} className="cart-button cart-button-orange">
              <ShoppingCart size={16} />
              {!sidebarCollapsed && <span>Carrito de Compra</span>}
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
          
          <div className="notifications-button-container">
            <button onClick={() => {}} className="cart-button cart-button-blue">
              <Bell size={16} />
              {!sidebarCollapsed && <span>Notificaciones</span>}
              {unreadNotifications > 0 && (
                <span className="cart-badge">{unreadNotifications}</span>
              )}
            </button>
          </div>
          
          <div className="search-button-container">
            <button onClick={() => {}} className="cart-button cart-button-teal">
              <Search size={16} />
              {!sidebarCollapsed && <span>Buscar</span>}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          )}
        </div>
      </aside>
      
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div style={{ 
          minHeight: '100vh',
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <AperturaAngelicaHeader
              user={user}
              onLogout={handleLogout}
              onNavigateHome={() => navigate('/apertura-angelica')}
              onCartClick={() => navigate('/carrito')}
              onProfileClick={() => navigate('/perfil')}
              cartCount={cartCount}
              theme="purple"
            />
          </div>
          
          <div style={{ paddingTop: '2rem', paddingBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <SistemaReservasCompleto mode="apertura" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPageApertura;
