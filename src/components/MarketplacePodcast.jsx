import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import { getEpisodiosPodcast, getCategoriasPodcast, getTiposPodcast } from '../data/podcastData';
import { Headphones, Play, Clock, Eye, Heart, X, Tag, Calendar, TrendingUp, Youtube, Search } from 'lucide-react';
import './MarketplaceCanalizaciones.css';

const MarketplacePodcast = ({ onVolver }) => {
  const [episodios] = useState(getEpisodiosPodcast());
  const [filtro, setFiltro] = useState('todos'); // todos, destacados, premium, gratuitos
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [episodioSeleccionado, setEpisodioSeleccionado] = useState(null);

  // Filtrar episodios
  const episodiosFiltrados = episodios.filter(e => {
    // Filtro por tipo
    let cumpleTipo = true;
    if (filtro === 'destacados') cumpleTipo = e.destacado;
    if (filtro === 'premium') cumpleTipo = e.premium;
    if (filtro === 'gratuitos') cumpleTipo = !e.premium;
    
    // Filtro por categoría
    let cumpleCategoria = true;
    if (categoriaFiltro !== 'Todas') cumpleCategoria = e.categoria === categoriaFiltro;
    
    // Filtro por tipo de contenido
    let cumpleTipoContenido = true;
    if (tipoFiltro !== 'Todos') cumpleTipoContenido = e.tipo === tipoFiltro;
    
    // Filtro por búsqueda
    let cumpleBusqueda = true;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda = 
        e.titulo.toLowerCase().includes(busquedaLower) ||
        e.descripcion.toLowerCase().includes(busquedaLower) ||
        e.tags.some(tag => tag.toLowerCase().includes(busquedaLower));
    }
    
    return cumpleTipo && cumpleCategoria && cumpleTipoContenido && cumpleBusqueda;
  });

  // Función para abrir modal con detalle
  const handleCardClick = (episodio) => {
    setEpisodioSeleccionado(episodio);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setEpisodioSeleccionado(null);
  };

  // Función para abrir en YouTube
  const handleOpenYoutube = (url) => {
    window.open(url, '_blank');
  };

  // Obtener categorías y tipos
  const categorias = getCategoriasPodcast();
  const tipos = getTiposPodcast();

  // Función para obtener color de categoría
  const getCategoryColor = (categoria) => {
    const colors = {
      'Meditaciones': '#10b981',
      'Enseñanzas': '#6366f1',
      'Desarrollo Personal': '#ec4899',
      'Inspiración': '#f59e0b',
      'Mensajes Especiales': '#8b5cf6',
      'Relaciones': '#ef4444',
      'Canalizaciones': '#d4af37',
      'Arcángeles': '#3b82f6',
      'Educación Angelical': '#06b6d4',
      'Desarrollo Espiritual': '#9333ea',
      'Herramientas Espirituales': '#ec4899',
      'Protección Espiritual': '#8b5cf6',
      'Sanación': '#10b981',
      'Rituales': '#d4af37'
    };
    return colors[categoria] || '#6366f1';
  };

  return (
    <ContentWrapper>
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header" style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        padding: '40px 30px',
        borderRadius: '20px',
        marginBottom: '30px',
        color: 'white'
      }}>
        <div className="header-content">
          <button 
            onClick={onVolver}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              marginBottom: '20px',
              fontWeight: '600'
            }}
          >
            ← Volver
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            <Headphones className="inline-block mr-3" size={40} />
            Podcast - El Angelólogo
          </h1>
          <p className="subtitle" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Episodios de Juan Carlos Ávila sobre ángeles y espiritualidad
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div style={{ marginTop: '20px', marginBottom: '15px' }}>
          <div style={{ 
            position: 'relative',
            maxWidth: '500px'
          }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#f59e0b'
              }} 
            />
            <input
              type="text"
              placeholder="Buscar episodios..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px 12px 45px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="marketplace-controls">
          <div className="filtros" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltro('todos')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'todos' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'todos' ? '#f59e0b' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Todos ({episodios.length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'destacados' ? 'active' : ''}`}
              onClick={() => setFiltro('destacados')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'destacados' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'destacados' ? '#f59e0b' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Destacados ({episodios.filter(e => e.destacado).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'premium' ? 'active' : ''}`}
              onClick={() => setFiltro('premium')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'premium' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'premium' ? '#f59e0b' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Premium ({episodios.filter(e => e.premium).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'gratuitos' ? 'active' : ''}`}
              onClick={() => setFiltro('gratuitos')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'gratuitos' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'gratuitos' ? '#f59e0b' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Gratuitos ({episodios.filter(e => !e.premium).length})
            </button>
          </div>

          {/* Filtros adicionales */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#f59e0b',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select 
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#f59e0b',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '180px'
              }}
            >
              <option value="Todos">Todos los tipos</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de episodios */}
      <div className="marketplace-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        padding: '20px'
      }}>
        {episodiosFiltrados.map(episodio => (
          <div 
            key={episodio.id}
            className="episodio-card"
            onClick={() => handleCardClick(episodio)}
            style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            {/* Imagen */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img 
                src={episodio.imagen} 
                alt={episodio.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Overlay con play button */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  <Play size={28} style={{ color: '#f59e0b', marginLeft: '4px' }} />
                </div>
              </div>

              {/* Duración */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Clock size={14} />
                {episodio.duracion}
              </div>

              {/* Badges */}
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
                {episodio.destacado && (
                  <div style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <TrendingUp size={14} />
                    Destacado
                  </div>
                )}
                {episodio.premium && (
                  <div style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    Premium
                  </div>
                )}
              </div>

              {/* Categoría */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '15px',
                background: getCategoryColor(episodio.categoria),
                color: 'white',
                padding: '8px 15px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Tag size={14} />
                {episodio.categoria}
              </div>
            </div>

            {/* Contenido */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#1f2937',
                lineHeight: '1.4'
              }}>
                {episodio.titulo}
              </h3>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.95rem',
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                {episodio.descripcion.substring(0, 100)}...
              </p>

              {/* Metadata */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '12px', 
                fontSize: '0.85rem',
                color: '#9ca3af',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} />
                  <span>{new Date(episodio.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Tag size={14} />
                  <span>{episodio.tipo}</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ 
                display: 'flex', 
                gap: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #f3f4f6',
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} style={{ color: '#f59e0b' }} />
                  <span>{episodio.reproducciones.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} style={{ color: '#ec4899' }} />
                  <span>{episodio.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {episodioSeleccionado && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={handleCloseModal}
        >
          <div 
            className="modal-content"
            style={{
              background: 'white',
              borderRadius: '25px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                color: 'white'
              }}
            >
              <X size={24} />
            </button>

            {/* Imagen de portada con play overlay */}
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '25px 25px 0 0' }}>
              <img 
                src={episodioSeleccionado.imagen} 
                alt={episodioSeleccionado.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Overlay oscuro */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
              }} />

              {/* Botón de reproducir grande */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <button
                  onClick={() => handleOpenYoutube(episodioSeleccionado.youtubeUrl)}
                  style={{
                    background: '#ff0000',
                    border: 'none',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(255,0,0,0.4)',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Youtube size={40} style={{ color: 'white' }} />
                </button>
                <p style={{ 
                  color: 'white',
                  textAlign: 'center',
                  marginTop: '15px',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  Ver en YouTube
                </p>
              </div>

              {/* Duración en esquina */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={18} />
                {episodioSeleccionado.duracion}
              </div>
            </div>

            {/* Contenido del episodio */}
            <div style={{ padding: '35px' }}>
              {/* Header */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '8px 16px',
                    background: getCategoryColor(episodioSeleccionado.categoria) + '20',
                    color: getCategoryColor(episodioSeleccionado.categoria),
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Tag size={14} />
                    {episodioSeleccionado.categoria}
                  </span>
                  <span style={{
                    padding: '8px 16px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {episodioSeleccionado.tipo}
                  </span>
                  {episodioSeleccionado.destacado && (
                    <span style={{
                      padding: '8px 16px',
                      background: '#fef3c7',
                      color: '#f59e0b',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <TrendingUp size={14} />
                      Destacado
                    </span>
                  )}
                  {episodioSeleccionado.premium && (
                    <span style={{
                      padding: '8px 16px',
                      background: '#ede9fe',
                      color: '#8b5cf6',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      Premium
                    </span>
                  )}
                </div>

                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#1f2937',
                  lineHeight: '1.3'
                }}>
                  {episodioSeleccionado.titulo}
                </h2>

                {/* Metadata */}
                <div style={{ 
                  display: 'flex', 
                  gap: '20px',
                  flexWrap: 'wrap',
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: '#f59e0b' }} />
                    <span>{new Date(episodioSeleccionado.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} style={{ color: '#f59e0b' }} />
                    <span>{episodioSeleccionado.duracion}</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ 
                  display: 'flex', 
                  gap: '30px',
                  marginTop: '20px',
                  fontSize: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <Eye size={20} style={{ color: '#f59e0b' }} />
                    <span>{episodioSeleccionado.reproducciones.toLocaleString()} reproducciones</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <Heart size={20} style={{ color: '#ec4899' }} />
                    <span>{episodioSeleccionado.likes} likes</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div style={{
                background: '#f9fafb',
                padding: '25px',
                borderRadius: '15px',
                marginBottom: '25px',
                borderLeft: `4px solid ${getCategoryColor(episodioSeleccionado.categoria)}`
              }}>
                <h3 style={{ 
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  Descripción
                </h3>
                <p style={{ 
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  color: '#4b5563'
                }}>
                  {episodioSeleccionado.descripcion}
                </p>
              </div>

              {/* Botón de YouTube */}
              <button
                onClick={() => handleOpenYoutube(episodioSeleccionado.youtubeUrl)}
                style={{
                  width: '100%',
                  background: '#ff0000',
                  color: 'white',
                  border: 'none',
                  padding: '18px',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '25px',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#cc0000'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ff0000'}
              >
                <Youtube size={24} />
                Escuchar en YouTube
              </button>

              {/* Tags */}
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  Etiquetas
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {episodioSeleccionado.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {episodiosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <Headphones size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No se encontraron episodios</h3>
          <p>Intenta ajustar los filtros o la búsqueda para ver más opciones</p>
        </div>
      )}
    </div>
    </ContentWrapper>
  );
};

export default MarketplacePodcast;

