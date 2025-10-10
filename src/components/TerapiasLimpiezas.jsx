import React from 'react';
import { Heart } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { TerapiasHeader } from './headers';
import SistemaReservasCompleto from './BookingSystem/SistemaReservasCompleto';
import './Dashboard.css';

const TerapiasYLimpiezas = ({ onVolver, user, onLogout }) => {
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

        <TerapiasHeader
          title="Terapias y Limpiezas Angelicales"
          subtitle="Sanación Energética y Purificación Espiritual"
          description="Sesiones terapéuticas y limpiezas guiadas por ángeles para sanar cuerpo, mente y espíritu. Equilibra tus chakras, restaura tu campo energético y purifica tu aura."
          icon={Heart}
        />

        <SistemaReservasCompleto />
      </main>
    </div>
  );
};

export default TerapiasYLimpiezas;
