import React from 'react';
import { Video } from 'lucide-react';
import AppSidebar from '../AppSidebar';
import { AperturaAngelicaHeader } from '../headers';
import SistemaReservasCompleto from '../BookingSystem/SistemaReservasCompleto';
import '../Dashboard.css';

const ConsultasOnlineVivo = ({ user, onLogout }) => {
  return (
    <div className="dashboard-container">
      <AppSidebar />

      <main className="main-content"
        style={{
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflowY: 'auto'
        }}>

        <AperturaAngelicaHeader
          user={user}
          onLogout={onLogout}
          onNavigateHome={() => window.history.back()}
        />

        <SistemaReservasCompleto />
      </main>
    </div>
  );
};

export default ConsultasOnlineVivo;
