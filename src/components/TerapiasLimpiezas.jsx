import React, { useState } from 'react';
import './CanalizacionesSonoterapia.css';
import './Dashboard.css';
import { ArrowLeft, Heart, Shield, Sparkles, Users, Clock, Star } from 'lucide-react';
import IconoEspacioSagrado from './IconoEspacioSagrado';
import IconoIntencionClara from './IconoIntencionClara';
import IconoReceptividadTotal from './IconoReceptividadTotal';
import AppSidebar from './AppSidebar';
import MarketplaceTerapias from './MarketplaceTerapias';
import MarketplaceLimpiezas from './MarketplaceLimpiezas';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import ContentWrapper from './ContentWrapper';
// TerapiasHeader removed - now handled by Dashboard

const TerapiasLimpiezas = ({ onVolver, onNavigate, addToCart }) => {
  const [paso, setPaso] = useState('instrucciones'); // 'instrucciones', 'servicios', 'terapias', 'limpiezas'

  // Si está en terapias, mostrar MarketplaceTerapias
  if (paso === 'terapias') {
    return <MarketplaceTerapias onVolver={() => setPaso('servicios')} addToCart={addToCart} />;
  }

  // Si está en limpiezas, mostrar MarketplaceLimpiezas
  if (paso === 'limpiezas') {
    return <MarketplaceLimpiezas onVolver={() => setPaso('servicios')} addToCart={addToCart} />;
  }

  // Página de instrucciones
  if (paso === 'instrucciones') {
    return (
      <ContentWrapper>
      <div className="canalizaciones-sonoterapia-wrapper">
        {/* Título y descripción fuera del recuadro */}
        <div className="titulo-descripcion-section">
          <h1 className="titulo-principal-sonoterapia">Terapias y Limpiezas Angelicales</h1>
          <p className="descripcion-principal-sonoterapia">
            Sanación energética profunda y purificación espiritual guiada por arcángeles. Cada sesión está diseñada para tu transformación y equilibrio divino.
          </p>
        </div>

        {/* Recuadro morado con instrucciones */}
        <div className="recuadro-morado-instrucciones">
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
            llamadaAccion="Elegir Mi Servicio"
            onAccionClick={() => setPaso('servicios')}
            maxWidth="max-w-5xl mx-auto"
          />
        </div>
      </div>
      </ContentWrapper>
    );
  }

  // Página de selección de servicios (Terapias o Limpiezas)
  return (
    <ContentWrapper>
    <div className="canalizaciones-sonoterapia-seleccion">
      {/* Fondo marmolado morado */}
      <div className="seleccion-background-morado">
        {/* Contenedor principal con borde dorado */}
        <div className="seleccion-container-principal">
          {/* Header de selección */}
          <div className="seleccion-header">
            <h2 className="seleccion-titulo">Elige tu Servicio de Sanación</h2>
            <p className="seleccion-descripcion">
              Selecciona el tipo de sanación que resuena con tu alma en este momento
            </p>
          </div>

          {/* Grid de opciones */}
          <div className="seleccion-grid-opciones">
            {/* Terapias Angelicales */}
            <div 
              className="seleccion-opcion-card"
              onClick={() => setPaso('terapias')}
            >
              <div className="seleccion-card-inner">
                {/* Icono circular dorado */}
                <div className="seleccion-icono-circular" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}>
                  <Heart className="w-12 h-12" />
                </div>
                
                {/* Título */}
                <h3 className="seleccion-card-titulo">Terapias Angelicales</h3>
                
                {/* Descripción */}
                <p className="seleccion-card-descripcion">
                  Sanación energética profunda para cuerpo, mente y espíritu. Trabaja con arcángeles para sanar heridas emocionales, físicas y espirituales.
                </p>

                {/* Lista de beneficios */}
                <ul className="seleccion-beneficios-lista">
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#ec4899' }} />
                    <span>Sanación emocional y física</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#ec4899' }} />
                    <span>Equilibrio de chakras</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#ec4899' }} />
                    <span>Activación espiritual</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#ec4899' }} />
                    <span>Conexión con arcángeles</span>
                  </li>
                </ul>

                {/* Estadísticas */}
                <div className="seleccion-stats">
                  <div className="stat-item">
                    <Users className="w-5 h-5" style={{ color: '#ec4899' }} />
                    <span>15 terapias</span>
                  </div>
                  <div className="stat-item">
                    <Clock className="w-5 h-5" style={{ color: '#ec4899' }} />
                    <span>45-120 min</span>
                  </div>
                  <div className="stat-item">
                    <Star className="w-5 h-5" style={{ color: '#ec4899' }} />
                    <span>Desde gratis</span>
                  </div>
                </div>

                {/* Botón */}
                <button className="seleccion-card-button" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}>
                  Explorar Terapias
                  <ArrowLeft className="w-5 h-5 transform rotate-180" />
                </button>
              </div>
            </div>

            {/* Limpiezas Energéticas */}
            <div 
              className="seleccion-opcion-card"
              onClick={() => setPaso('limpiezas')}
            >
              <div className="seleccion-card-inner">
                {/* Icono circular dorado */}
                <div className="seleccion-icono-circular" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                  <Shield className="w-12 h-12" />
                </div>
                
                {/* Título */}
                <h3 className="seleccion-card-titulo">Limpiezas Energéticas</h3>
                
                {/* Descripción */}
                <p className="seleccion-card-descripcion">
                  Purificación espiritual y protección angelical. Elimina energías densas, bloqueos y entidades de tu campo energético y espacios.
                </p>

                {/* Lista de beneficios */}
                <ul className="seleccion-beneficios-lista">
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span>Limpieza áurica completa</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span>Purificación de espacios</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span>Protección energética</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span>Liberación kármica</span>
                  </li>
                </ul>

                {/* Estadísticas */}
                <div className="seleccion-stats">
                  <div className="stat-item">
                    <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                    <span>18 limpiezas</span>
                  </div>
                  <div className="stat-item">
                    <Clock className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                    <span>30-180 min</span>
                  </div>
                  <div className="stat-item">
                    <Star className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                    <span>Desde gratis</span>
                  </div>
                </div>

                {/* Botón */}
                <button className="seleccion-card-button" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                  Explorar Limpiezas
                  <ArrowLeft className="w-5 h-5 transform rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Botón volver */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => setPaso('instrucciones')}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #d4af37',
                color: '#1f2937',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <ArrowLeft size={20} />
              Volver a Instrucciones
            </button>
          </div>
        </div>
      </div>
    </div>
    </ContentWrapper>
  );
};

export default TerapiasLimpiezas;

