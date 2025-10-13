import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AperturaAngelicaHeader } from '../components/headers';
import SistemaReservasCompleto from '../components/BookingSystem/SistemaReservasCompleto';
import { supabase } from '../integrations/supabase/client';

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
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url(/FondoMarmoleado02.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header de Apertura Angelica */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
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

      {/* Sistema de reservas con padding superior MUY grande */}
      <div style={{ paddingTop: '8rem', paddingBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <SistemaReservasCompleto mode="apertura" />
      </div>
    </div>
  );
};

export default BookingPageApertura;
