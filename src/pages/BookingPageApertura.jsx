import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import { AperturaAngelicaHeader } from '../components/headers';
import SistemaReservasCompleto from '../components/BookingSystem/SistemaReservasCompleto';
import { supabase } from '../integrations/supabase/client';
import '../components/Dashboard.css';

const BookingPageApertura = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

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

  const handleCartClick = () => {
    navigate('/carrito');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleBack = () => {
    navigate('/apertura-angelica');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar correcto */}
      <AppSidebar />

      {/* Main content */}
      <main
        className="main-content"
        style={{
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Header de Apertura Angelica con botones morados */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          backgroundColor: 'transparent'
        }}>
          <AperturaAngelicaHeader
            user={user}
            onLogout={handleLogout}
            onNavigateHome={handleBack}
            onCartClick={handleCartClick}
            onProfileClick={handleProfileClick}
            cartCount={cartCount}
            theme="purple"
          />
        </div>

        {/* Sistema de reservas con padding superior adecuado */}
        <div style={{ paddingTop: '2rem' }}>
          <SistemaReservasCompleto mode="apertura" />
        </div>
      </main>
    </div>
  );
};

export default BookingPageApertura;
