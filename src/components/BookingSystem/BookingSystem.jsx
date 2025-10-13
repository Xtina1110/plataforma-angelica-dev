import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../AppSidebar';
import { AperturaAngelicaHeader } from '../headers';
import SistemaReservasCompleto from './SistemaReservasCompleto';
import '../Dashboard.css';

const BookingSystem = ({ onBack, user, onLogout, mode = 'general' }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Cargar contador del carrito desde localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('angelical_cart') || '[]');
      setCartCount(cart.length);
    };

    // Cargar inicial
    updateCartCount();

    // Escuchar evento de actualización del carrito
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const handleCartClick = () => {
    navigate('/carrito');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />

      <main
        className="main-content"
        style={{
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflowY: 'auto'
        }}
      >
        <AperturaAngelicaHeader
          user={user}
          onLogout={onLogout}
          onNavigateHome={onBack}
          onCartClick={handleCartClick}
          onProfileClick={handleProfileClick}
          cartCount={cartCount}
          theme="purple"
        />

        <SistemaReservasCompleto mode={mode} />
      </main>
    </div>
  );
};

export default BookingSystem;
