import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import './SeleccionBlogPodcast.css';

const SeleccionBlogPodcast = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const opciones = [
    {
      id: 'blog',
      titulo: 'Blog Angelical',
      descripcion: 'Artículos inspiradores sobre ángeles, arcángeles y espiritualidad',
      icono: BookOpen,
      color: 'amber',
      ruta: '/blog-podcast/blog',
      stats: {
        articulos: '50+',
        categorias: '8',
        lecturas: '10K+'
      }
    },
    {
      id: 'podcast',
      titulo: 'Podcast Angelical',
      descripcion: 'Episodios de audio con canalizaciones y enseñanzas espirituales',
      icono: Headphones,
      color: 'purple',
      ruta: '/blog-podcast/podcast',
      stats: {
        episodios: '16',
        duracion: '20 min',
        oyentes: '50K+'
      }
    }
  ];

  const handleSeleccion = (ruta) => {
    navigate(ruta);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Contenido principal */}
      <div className="seleccion-content-wrapper">
        {/* Header */}
        <div className="seleccion-header">
          <div className="seleccion-sparkles">
            <Sparkles className="seleccion-sparkle" />
            <h1 className="seleccion-title">Elige tu Camino de Luz</h1>
            <Sparkles className="seleccion-sparkle seleccion-sparkle-delayed" />
          </div>
          <p className="seleccion-subtitle">
            Explora contenido angelical que resuena con tu alma
          </p>
        </div>

        {/* Tarjetas de selección */}
        <div className="seleccion-cards">
          {opciones.map((opcion) => {
            const IconComponent = opcion.icono;
            const isHovered = hoveredCard === opcion.id;
            
            return (
              <div
                key={opcion.id}
                className={`seleccion-card seleccion-card-${opcion.color} ${isHovered ? 'seleccion-card-hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(opcion.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleSeleccion(opcion.ruta)}
              >
                {/* Icono */}
                <div className="seleccion-card-icon-wrapper">
                  <div className={`seleccion-card-icon seleccion-card-icon-${opcion.color}`}>
                    <IconComponent size={48} />
                  </div>
                </div>

                {/* Contenido */}
                <div className="seleccion-card-content">
                  <h2 className="seleccion-card-title">{opcion.titulo}</h2>
                  <p className="seleccion-card-description">{opcion.descripcion}</p>

                  {/* Estadísticas */}
                  <div className="seleccion-card-stats">
                    {Object.entries(opcion.stats).map(([key, value]) => (
                      <div key={key} className="seleccion-card-stat">
                        <span className="seleccion-card-stat-value">{value}</span>
                        <span className="seleccion-card-stat-label">{key}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botón */}
                  <button className={`seleccion-card-button seleccion-card-button-${opcion.color}`}>
                    <span>Explorar</span>
                    <ArrowRight size={20} className="seleccion-card-button-icon" />
                  </button>
                </div>

                {/* Efecto de brillo */}
                <div className="seleccion-card-shine" />
              </div>
            );
          })}
        </div>

        {/* Mensaje angelical */}
        <div className="seleccion-message">
          <Sparkles size={20} className="seleccion-message-icon" />
          <p className="seleccion-message-text">
            Los ángeles te guían hacia el contenido que tu alma necesita
          </p>
          <Sparkles size={20} className="seleccion-message-icon seleccion-message-icon-delayed" />
        </div>
      </div>
    </div>
  );
};

export default SeleccionBlogPodcast;

