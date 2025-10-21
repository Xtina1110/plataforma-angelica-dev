import React, { useState } from 'react';
import { Heart, Shield, Sparkles, Zap } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { TerapiasHeader } from './headers';
import SistemaReservasCompleto from './BookingSystem/SistemaReservasCompleto';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import './Dashboard.css';

const TerapiasYLimpiezas = ({ onVolver, user, onLogout }) => {
  const [paso, setPaso] = useState('instrucciones'); // 'instrucciones' o 'reservas'

  // Página de instrucciones
  if (paso === 'instrucciones') {
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
            overflowY: 'auto',
            paddingTop: '80px'
          }}>

          <div className="max-w-5xl mx-auto px-4">
            {/* Título y descripción fuera del recuadro */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Terapias y Limpiezas Angelicales
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Sanación energética profunda y purificación espiritual guiada por ángeles. Restaura tu equilibrio, libera bloqueos y renueva tu campo áurico.
              </p>
            </div>

            {/* Recuadro de instrucciones */}
            <InstruccionesAngelicales
              colorPrimario="pink"
              instrucciones={[
                {
                  icono: Shield,
                  titulo: "Preparación Energética",
                  descripcion: "Llega con ropa cómoda y mente abierta. La sanación angelical trabaja en todos los niveles de tu ser."
                },
                {
                  icono: Heart,
                  titulo: "Intención de Sanación",
                  descripcion: "Define qué aspecto de tu vida necesita sanación: físico, emocional, mental o espiritual."
                },
                {
                  icono: Sparkles,
                  titulo: "Receptividad Total",
                  descripcion: "Permite que la energía angelical fluya a través de ti. La sanación ocurre cuando te entregas al proceso."
                }
              ]}
              llamadaAccion="Reservar mi Sesión"
              onAccionClick={() => setPaso('reservas')}
              maxWidth="max-w-5xl mx-auto"
            />
          </div>
        </main>
      </div>
    );
  }

  // Página de reservas
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

