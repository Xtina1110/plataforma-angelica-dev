import React, { useState } from 'react';
import './CanalizacionesSonoterapia.css';
import './Dashboard.css';
import { ArrowLeft, Music, MessageCircle, Headphones, Heart, Star, Clock, Users, Sparkles } from 'lucide-react';
import IconoEspacioSagrado from './IconoEspacioSagrado';
import IconoIntencionClara from './IconoIntencionClara';
import IconoReceptividadTotal from './IconoReceptividadTotal';
import AppSidebar from './AppSidebar';
import MarketplaceSonoterapia from './MarketplaceSonoterapia';
import MarketplaceCanalizaciones from './MarketplaceCanalizaciones';
import InstruccionesAngelicales from './InstruccionesAngelicales';
// FooterLegal removed - now handled by Dashboard
const CanalizacionesSonoterapia = ({ onVolver, onNavigate, addToCart }) => {
  const [paso, setPaso] = useState('instrucciones'); // 'instrucciones', 'servicios', 'sonoterapia', 'canalizaciones'

  // Si está en sonoterapia, mostrar MarketplaceSonoterapia
  if (paso === 'sonoterapia') {
    return <MarketplaceSonoterapia onVolver={() => setPaso('servicios')} addToCart={addToCart} />;
  }

  // Si está en canalizaciones, mostrar solo MarketplaceCanalizaciones
  if (paso === 'canalizaciones') {
    return <MarketplaceCanalizaciones onVolver={() => setPaso('servicios')} addToCart={addToCart} />;
  }

  // Página de instrucciones
  if (paso === 'instrucciones') {
    return (
      <div className="canalizaciones-sonoterapia-wrapper">
        {/* Título y descripción fuera del recuadro */}
        <div className="titulo-descripcion-section">
          <h1 className="titulo-principal-sonoterapia">Canalizaciones y Sonoterapia</h1>
          <p className="descripcion-principal-sonoterapia">
            Eleva tu vibración a través de mensajes angelicales y frecuencias sagradas. Cada experiencia está diseñada para tu sanación y conexión divina.
          </p>
        </div>

        {/* Recuadro morado con instrucciones */}
        <div className="recuadro-morado-instrucciones">
          <InstruccionesAngelicales
            colorPrimario="cyan"
            instrucciones={[
              {
                icono: IconoEspacioSagrado,
                titulo: "Espacio Sagrado",
                descripcion: "Busca un lugar tranquilo donde puedas conectar sin interrupciones con las energías angelicales."
              },
              {
                icono: IconoIntencionClara,
                titulo: "Intención Clara",
                descripcion: "Define qué tipo de sanación o mensaje necesitas. Tu intención guía la experiencia."
              },
              {
                icono: IconoReceptividadTotal,
                titulo: "Receptividad Total",
                descripcion: "Mantén tu corazón y mente abiertos para recibir la sanación y sabiduría que los ángeles te ofrecen."
              }
            ]}
            llamadaAccion="Elegir Mi Experiencia"
            onAccionClick={() => setPaso('servicios')}
            maxWidth="max-w-5xl mx-auto"
          />
        </div>
      </div>
    );
  }

  // Página de servicios (Sonoterapia o Canalizaciones) - NUEVO DISEÑO
  return (
    <div className="canalizaciones-sonoterapia-seleccion">
      {/* Fondo marmolado morado */}
      <div className="seleccion-background-morado">
        {/* Contenedor principal con borde dorado */}
        <div className="seleccion-container-principal">
          {/* Header de selección */}
          <div className="seleccion-header">
            <h2 className="seleccion-titulo">Elige tu Experiencia</h2>
            <p className="seleccion-descripcion">
              Selecciona el tipo de sanación que resuena con tu alma en este momento
            </p>
          </div>

          {/* Grid de opciones - estilo Apertura Angelical */}
          <div className="seleccion-grid-opciones">
            {/* Sonoterapia Angelical */}
            <div 
              className="seleccion-opcion-card"
              onClick={() => setPaso('sonoterapia')}
            >
              <div className="seleccion-card-inner">
                {/* Icono circular dorado */}
                <div className="seleccion-icono-circular sonoterapia-color">
                  <Headphones className="w-12 h-12" />
                </div>
                
                {/* Título */}
                <h3 className="seleccion-card-titulo">Sonoterapia Angelical</h3>
                
                {/* Descripción */}
                <p className="seleccion-card-descripcion">
                  Frecuencias sagradas y ondas binaurales para armonizar tu ser
                </p>

                {/* Badge "Nuevo" */}
                <div className="seleccion-badge nuevo">Nuevo</div>
              </div>
            </div>

            {/* Canalizaciones Angelicales */}
            <div 
              className="seleccion-opcion-card"
              onClick={() => setPaso('canalizaciones')}
            >
              <div className="seleccion-card-inner">
                {/* Icono circular dorado */}
                <div className="seleccion-icono-circular canalizaciones-color">
                  <MessageCircle className="w-12 h-12" />
                </div>
                
                {/* Título */}
                <h3 className="seleccion-card-titulo">Canalizaciones Angelicales</h3>
                
                {/* Descripción */}
                <p className="seleccion-card-descripcion">
                  Mensajes directos de los ángeles para guiar tu camino espiritual
                </p>

                {/* Badge "Popular" */}
                <div className="seleccion-badge popular">Popular</div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="seleccion-info-adicional">
            <div className="info-stat">
              <Clock className="w-5 h-5" />
              <span>150+ contenidos disponibles</span>
            </div>
            <div className="info-stat">
              <Users className="w-5 h-5" />
              <span>40k+ usuarios transformados</span>
            </div>
            <div className="info-stat">
              <Star className="w-5 h-5" />
              <span>4.9 valoración promedio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanalizacionesSonoterapia;

