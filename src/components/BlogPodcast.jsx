import React, { useState, useEffect } from 'react';
import './CanalizacionesSonoterapia.css';
import './Dashboard.css';
import { ArrowLeft, BookOpen, Headphones, Sparkles, Users, Clock, Star } from 'lucide-react';
import MarketplaceBlog from './MarketplaceBlog';
import MarketplacePodcast from './MarketplacePodcast';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import ContentWrapper from './ContentWrapper';
import { BlogHeader } from './headers';
import { supabase } from '../integrations/supabase/client';

const BlogPodcast = ({ onVolver, onNavigate }) => {
  const [paso, setPaso] = useState('instrucciones'); // 'instrucciones', 'servicios', 'blog', 'podcast'
  const [user, setUser] = useState(null);

  // Cargar usuario de Supabase
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  // Si está en blog, mostrar MarketplaceBlog
  if (paso === 'blog') {
    return <MarketplaceBlog onVolver={() => setPaso('servicios')} />;
  }

  // Si está en podcast, mostrar MarketplacePodcast
  if (paso === 'podcast') {
    return <MarketplacePodcast onVolver={() => setPaso('servicios')} />;
  }

  // Página de instrucciones
  if (paso === 'instrucciones') {
    return (
      <ContentWrapper>
      <BlogHeader user={user} onNavigateHome={() => window.history.back()} />
      <div className="canalizaciones-sonoterapia-wrapper">
        {/* Título y descripción fuera del recuadro */}
        <div className="titulo-descripcion-section">
          <h1 className="titulo-principal-sonoterapia">Blog & Podcast Angelical</h1>
          <p className="descripcion-principal-sonoterapia">
            Contenido educativo y espiritual sobre ángeles, arcángeles y desarrollo espiritual. Artículos profundos y episodios inspiradores de El Angelólogo.
          </p>
        </div>

        {/* Recuadro morado con instrucciones */}
        <div className="recuadro-morado-instrucciones">
          <InstruccionesAngelicales
            colorPrimario="indigo"
            instrucciones={[
              {
                icono: BookOpen,
                titulo: "Espacio de Lectura",
                descripcion: "Encuentra un momento tranquilo para leer y reflexionar. Permite que las palabras resuenen en tu corazón."
              },
              {
                icono: Headphones,
                titulo: "Escucha Consciente",
                descripcion: "Para los podcasts, usa audífonos y elimina distracciones. La voz de El Angelólogo te guiará en tu camino."
              },
              {
                icono: Sparkles,
                titulo: "Mente Abierta",
                descripcion: "Recibe el conocimiento con humildad y discernimiento. Cada enseñanza es una semilla de sabiduría angelical."
              }
            ]}
            llamadaAccion="Explorar Contenido"
            onAccionClick={() => setPaso('servicios')}
            maxWidth="max-w-5xl mx-auto"
          />
        </div>
      </div>
      </ContentWrapper>
    );
  }

  // Página de selección de servicios (Blog o Podcast)
  return (
    <ContentWrapper>
    <BlogHeader onNavigateHome={() => window.history.back()} />
    <div className="canalizaciones-sonoterapia-seleccion">
      {/* Fondo marmolado morado */}
      <div className="seleccion-background-morado">
        {/* Contenedor principal con borde dorado */}
        <div className="seleccion-container-principal">
          {/* Header de selección */}
          <div className="seleccion-header">
            <h2 className="seleccion-titulo">Elige Tu Formato de Aprendizaje</h2>
            <p className="seleccion-descripcion">
              Selecciona cómo prefieres recibir el conocimiento angelical
            </p>
          </div>

          {/* Grid de opciones */}
          <div className="seleccion-grid-opciones">
            {/* Blog Angelical */}
            <div 
              className="seleccion-opcion-card"
              onClick={() => setPaso('blog')}
            >
              <div className="seleccion-card-inner">
                {/* Icono circular dorado */}
                <div className="seleccion-icono-circular" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                  <BookOpen className="w-12 h-12" />
                </div>
                
                {/* Título */}
                <h3 className="seleccion-card-titulo">Blog Angelical</h3>
                
                {/* Descripción */}
                <p className="seleccion-card-descripcion">
                  Artículos profundos y guías completas sobre ángeles, arcángeles, meditaciones y herramientas espirituales. Contenido para leer y reflexionar.
                </p>

                {/* Lista de beneficios */}
                <ul className="seleccion-beneficios-lista">
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#6366f1' }} />
                    <span>Guías espirituales detalladas</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#6366f1' }} />
                    <span>Técnicas de meditación</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#6366f1' }} />
                    <span>Interpretación de señales</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#6366f1' }} />
                    <span>Rituales y herramientas</span>
                  </li>
                </ul>

                {/* Estadísticas */}
                <div className="seleccion-stats">
                  <div className="stat-item">
                    <Users className="w-5 h-5" style={{ color: '#6366f1' }} />
                    <span>8 artículos</span>
                  </div>
                  <div className="stat-item">
                    <Clock className="w-5 h-5" style={{ color: '#6366f1' }} />
                    <span>6-15 min lectura</span>
                  </div>
                  <div className="stat-item">
                    <Star className="w-5 h-5" style={{ color: '#6366f1' }} />
                    <span>Contenido premium</span>
                  </div>
                </div>

                {/* Botón */}
                <button className="seleccion-card-button" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                  Leer Artículos
                  <ArrowLeft className="w-5 h-5 transform rotate-180" />
                </button>
              </div>
            </div>

            {/* Podcast - El Angelólogo */}
            <div 
              className="seleccion-opcion-card"
              onClick={() => setPaso('podcast')}
            >
              <div className="seleccion-card-inner">
                {/* Icono circular dorado */}
                <div className="seleccion-icono-circular" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}>
                  <Headphones className="w-12 h-12" />
                </div>
                
                {/* Título */}
                <h3 className="seleccion-card-titulo">Podcast - El Angelólogo</h3>
                
                {/* Descripción */}
                <p className="seleccion-card-descripcion">
                  Episodios de Juan Carlos Ávila sobre ángeles, arcángeles, meditaciones guiadas y enseñanzas espirituales. Contenido migrado de YouTube.
                </p>

                {/* Lista de beneficios */}
                <ul className="seleccion-beneficios-lista">
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span>Meditaciones guiadas</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span>Enseñanzas angelicales</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span>Canalizaciones y mensajes</span>
                  </li>
                  <li>
                    <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span>Rituales y protección</span>
                  </li>
                </ul>

                {/* Estadísticas */}
                <div className="seleccion-stats">
                  <div className="stat-item">
                    <Users className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <span>17 episodios</span>
                  </div>
                  <div className="stat-item">
                    <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <span>1-25 min audio</span>
                  </div>
                  <div className="stat-item">
                    <Star className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <span>En YouTube</span>
                  </div>
                </div>

                {/* Botón */}
                <button className="seleccion-card-button" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}>
                  Escuchar Podcast
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

export default BlogPodcast;

