import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { AperturaAngelicaHeader } from '../components/headers';
import SistemaReservasCompleto from '../components/BookingSystem/SistemaReservasCompleto';
import DashboardSidebar from '../components/DashboardSidebar';
import { useCart } from '../contexts/CartContext';
import '../components/Dashboard.css';
import '../components/Dashboard-sidebar-colors.css';

const BookingPageApertura = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Usar CartContext para gestión del carrito
  const { cartCount } = useCart();

  // Cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar usando el componente reutilizable del Dashboard */}
      <DashboardSidebar
        user={user}
        onLogout={handleLogout}
        activeSection="tirada"
        onNavigate={(sectionId) => {
          // Mapeo de secciones a rutas
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
          
          if (routes[sectionId]) {
            navigate(routes[sectionId]);
          }
        }}
        cartCount={cartCount}
        unreadNotifications={unreadNotifications}
        onCartClick={() => navigate('/carrito')}
        onNotificationsClick={() => {}}
        onSearchClick={() => {}}
        onProfileClick={() => navigate('/perfil')}
      />
      
      <main className="main-content">
        <div style={{ 
          minHeight: '100vh',
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          {/* Header con posición sticky */}
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 1000,
            marginBottom: '2rem'
          }}>
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
          
          {/* Contenido del sistema de reservas con padding adecuado */}
          <div style={{ 
            paddingLeft: '1rem', 
            paddingRight: '1rem',
            paddingBottom: '2rem'
          }}>
            <SistemaReservasCompleto mode="apertura" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPageApertura;

