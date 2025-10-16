import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, ArrowRight, Sparkles } from 'lucide-react';

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
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fffbeb, #ffedd5, #fef3c7)',
      padding: '3rem 2rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <Sparkles style={{ color: '#fbbf24' }} />
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            Elige tu Camino de Luz
          </h1>
          <Sparkles style={{ color: '#fbbf24' }} />
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          fontWeight: '400',
          margin: 0
        }}>
          Explora contenido angelical que resuena con tu alma
        </p>
      </div>

      {/* Tarjetas de selección */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '3rem'
      }}>
        {opciones.map((opcion) => {
          const IconComponent = opcion.icono;
          const isHovered = hoveredCard === opcion.id;
          
          return (
            <div
              key={opcion.id}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                boxShadow: isHovered 
                  ? '0 20px 60px rgba(251, 191, 36, 0.3)' 
                  : '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: `2px solid ${isHovered ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.1)'}`,
                transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)'
              }}
              onMouseEnter={() => setHoveredCard(opcion.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleSeleccion(opcion.ruta)}
            >
              {/* Icono */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: opcion.color === 'amber' 
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: 'white',
                  transition: 'all 0.4s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
                }}>
                  <IconComponent size={48} />
                </div>
              </div>

              {/* Contenido */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 1rem 0'
                }}>
                  {opcion.titulo}
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: '0 0 2rem 0'
                }}>
                  {opcion.descripcion}
                </p>

                {/* Estadísticas */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: '1rem',
                  marginBottom: '2rem',
                  padding: '1.5rem 0',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  {Object.entries(opcion.stats).map(([key, value]) => (
                    <div key={key} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1f2937'
                      }}>
                        {value}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        textTransform: 'capitalize'
                      }}>
                        {key}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botón */}
                <button style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  background: opcion.color === 'amber'
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                }}>
                  <span>Explorar</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje angelical */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1.5rem 2.5rem',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(251, 191, 36, 0.2)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <Sparkles size={20} style={{ color: '#fbbf24' }} />
        <p style={{
          fontSize: '1rem',
          color: '#4b5563',
          fontStyle: 'italic',
          margin: 0
        }}>
          Los ángeles te guían hacia el contenido que tu alma necesita
        </p>
        <Sparkles size={20} style={{ color: '#fbbf24' }} />
      </div>
    </div>
  );
};

export default SeleccionBlogPodcast;

