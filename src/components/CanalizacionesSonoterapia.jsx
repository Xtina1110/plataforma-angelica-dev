import React, { useState } from 'react';
import './CanalizacionesSonoterapia.css';
import './Dashboard.css';
import { ArrowLeft, Music, MessageCircle, Headphones, Heart, Star, Clock, Users, Sparkles } from 'lucide-react';
import IconoEspacioSagrado from './IconoEspacioSagrado';
import IconoIntencionClara from './IconoIntencionClara';
import IconoReceptividadTotal from './IconoReceptividadTotal';
import AppSidebar from './AppSidebar';
import Sonoterapia from './Sonoterapia';
import CanalizacionesAngelicales from './CanalizacionesAngelicales';
import InstruccionesAngelicales from './InstruccionesAngelicales';
// FooterLegal removed - now handled by Dashboard
import { useShoppingCart } from '../hooks/useShoppingCart';

const CanalizacionesSonoterapia = ({ onVolver, onNavigate }) => {
  const [paso, setPaso] = useState('instrucciones'); // 'instrucciones', 'servicios', 'sonoterapia', 'canalizaciones'
  const { addToCart } = useShoppingCart();

  // Si está en sonoterapia o canalizaciones, mostrar el componente correspondiente
  if (paso === 'sonoterapia') {
    return <Sonoterapia onVolver={() => setPaso('servicios')} addToCart={addToCart} />;
  }

  if (paso === 'canalizaciones') {
    return <CanalizacionesAngelicales onVolver={() => setPaso('servicios')} addToCart={addToCart} />;
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

  // Página de servicios (Sonoterapia o Canalizaciones)
  return (
    <div className="canalizaciones-sonoterapia-principal">
      {/* Contenido principal */}
      <main className="contenido-principal">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-icono">
              <Music className="w-16 h-16" />
            </div>
            <h2 className="hero-titulo">Sanación a través del Sonido y la Palabra</h2>
            <p className="hero-descripcion">
              Descubre el poder transformador de las frecuencias sagradas y los mensajes angelicales. 
              Cada experiencia está diseñada para elevar tu vibración y conectarte con tu esencia divina.
            </p>
          </div>
        </div>

        {/* Opciones principales */}
        <div className="opciones-principales">
          {/* Sonoterapia */}
          <div 
            className="opcion-card sonoterapia"
            onClick={() => setPaso('sonoterapia')}
          >
            <div className="card-header">
              <div className="card-icono sonoterapia-icono">
                <Headphones className="w-12 h-12" />
              </div>
              <div className="card-badge">Nuevo</div>
            </div>
            
            <div className="card-content">
              <h3 className="card-titulo">Sonoterapia Angelical</h3>
              <p className="card-descripcion">
                Frecuencias sagradas y ondas binaurales para armonizar cuerpo, mente y alma. 
                Experimenta la sanación a través del poder del sonido.
              </p>
              
              <div className="card-beneficios">
                <div className="beneficio">
                  <span className="beneficio-icono">🎵</span>
                  <span>Frecuencias de 432Hz, 528Hz, 741Hz</span>
                </div>
                <div className="beneficio">
                  <span className="beneficio-icono">🧘‍♀️</span>
                  <span>Meditación y concentración profunda</span>
                </div>
                <div className="beneficio">
                  <span className="beneficio-icono">😴</span>
                  <span>Sueño reparador y relajación</span>
                </div>
                <div className="beneficio">
                  <span className="beneficio-icono">✨</span>
                  <span>Limpieza energética y sanación</span>
                </div>
              </div>
              
              <div className="card-stats">
                <div className="stat">
                  <Clock className="w-4 h-4" />
                  <span>50+ audios</span>
                </div>
                <div className="stat">
                  <Users className="w-4 h-4" />
                  <span>15k+ usuarios</span>
                </div>
                <div className="stat">
                  <Star className="w-4 h-4" />
                  <span>4.9 rating</span>
                </div>
              </div>
              
              <button className="btn-acceder sonoterapia-btn">
                <Music className="w-5 h-5" />
                Explorar Sonoterapia
              </button>
            </div>
          </div>

          {/* Canalizaciones */}
          <div 
            className="opcion-card canalizaciones"
            onClick={() => setPaso('canalizaciones')}
          >
            <div className="card-header">
              <div className="card-icono canalizaciones-icono">
                <MessageCircle className="w-12 h-12" />
              </div>
              <div className="card-badge popular">Popular</div>
            </div>
            
            <div className="card-content">
              <h3 className="card-titulo">Canalizaciones Angelicales</h3>
              <p className="card-descripcion">
                Mensajes directos de los ángeles para guiar tu camino. Recibe orientación divina 
                personalizada para tus desafíos y preguntas más profundas.
              </p>
              
              <div className="card-beneficios">
                <div className="beneficio">
                  <span className="beneficio-icono">👼</span>
                  <span>Conexión directa con guías angelicales</span>
                </div>
                <div className="beneficio">
                  <span className="beneficio-icono">💫</span>
                  <span>Mensajes personalizados y profundos</span>
                </div>
                <div className="beneficio">
                  <span className="beneficio-icono">🌟</span>
                  <span>Claridad y orientación divina</span>
                </div>
                <div className="beneficio">
                  <span className="beneficio-icono">🕊️</span>
                  <span>Sanación emocional y espiritual</span>
                </div>
              </div>
              
              <div className="card-stats">
                <div className="stat">
                  <Clock className="w-4 h-4" />
                  <span>100+ mensajes</span>
                </div>
                <div className="stat">
                  <Users className="w-4 h-4" />
                  <span>25k+ usuarios</span>
                </div>
                <div className="stat">
                  <Star className="w-4 h-4" />
                  <span>4.9 rating</span>
                </div>
              </div>
              
              <button className="btn-acceder canalizaciones-btn">
                <MessageCircle className="w-5 h-5" />
                Explorar Canalizaciones
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CanalizacionesSonoterapia;

