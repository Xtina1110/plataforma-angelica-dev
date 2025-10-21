import React, { useState } from 'react';
import { Calendar, Users, Sparkles, Heart } from 'lucide-react';
import EventosModernos from './EventosModernos';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import './EventosModernos.css';

const EventosAngelicales = ({ 
  eventos = [], 
  eventosInscritos = [], 
  onEventoClick = () => {}, 
  onToggleInscripcion = () => {},
  searchValue = '',
  filters = { categoria: 'todos' }
}) => {
  const [paso, setPaso] = useState('instrucciones'); // 'instrucciones' o 'eventos'

  // Página de instrucciones
  if (paso === 'instrucciones') {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '60px'
      }}>
        <div className="max-w-5xl mx-auto px-4">
          {/* Título y descripción fuera del recuadro */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eventos Angelicales
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Ceremonias, talleres y encuentros espirituales para conectar con la comunidad angelical. Experiencias transformadoras presenciales y virtuales.
            </p>
          </div>

          {/* Recuadro de instrucciones */}
          <InstruccionesAngelicales
            colorPrimario="cyan"
            instrucciones={[
              {
                icono: Calendar,
                titulo: "Planifica tu Asistencia",
                descripcion: "Revisa las fechas y horarios con anticipación. Reserva tu lugar para garantizar tu participación."
              },
              {
                icono: Heart,
                titulo: "Preparación Interior",
                descripcion: "Llega con el corazón abierto y disposición para conectar con otros buscadores espirituales."
              },
              {
                icono: Users,
                titulo: "Comunidad Angelical",
                descripcion: "Comparte tu experiencia con otros participantes. La energía grupal amplifica la conexión divina."
              }
            ]}
            llamadaAccion="Explorar Eventos"
            onAccionClick={() => setPaso('eventos')}
            maxWidth="max-w-5xl mx-auto"
          />
        </div>
      </div>
    );
  }

  // Página de eventos (grid de EventosModernos)
  return (
    <EventosModernos
      eventos={eventos}
      eventosInscritos={eventosInscritos}
      onEventoClick={onEventoClick}
      onToggleInscripcion={onToggleInscripcion}
      searchValue={searchValue}
      filters={filters}
    />
  );
};

export default EventosAngelicales;

