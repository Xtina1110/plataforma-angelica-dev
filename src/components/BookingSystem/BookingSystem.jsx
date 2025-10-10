import React from 'react';
import AppSidebar from '../AppSidebar';
import { AperturaAngelicaHeader } from '../headers';
import SistemaReservasCompleto from './SistemaReservasCompleto';
import '../Dashboard.css';

const BookingSystem = ({ onBack, user, onLogout, mode = 'general' }) => {
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
          theme="purple"
        />

        <SistemaReservasCompleto />
      </main>
    </div>
  );
};

export default BookingSystem;
