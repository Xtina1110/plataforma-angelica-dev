import React, { useState } from 'react';
import { getArticulosBlog, getCategoriasBlog, filtrarArticulos } from '../data/blogData';
import { BookOpen, Clock, Eye, Heart, Share2, X, Tag, Calendar, User, TrendingUp, Search } from 'lucide-react';
import './MarketplaceCanalizaciones.css';

const MarketplaceBlog = ({ onVolver }) => {
  const [articulos] = useState(getArticulosBlog());
  const [filtro, setFiltro] = useState('todos'); // todos, destacados, premium, gratuitos
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  // Filtrar artículos
  const articulosFiltrados = articulos.filter(a => {
    // Filtro por tipo
    let cumpleTipo = true;
    if (filtro === 'destacados') cumpleTipo = a.destacado;
    if (filtro === 'premium') cumpleTipo = a.premium;
    if (filtro === 'gratuitos') cumpleTipo = !a.premium;
    
    // Filtro por categoría
    let cumpleCategoria = true;
    if (categoriaFiltro !== 'Todas') cumpleCategoria = a.categoria === categoriaFiltro;
    
    // Filtro por búsqueda
    let cumpleBusqueda = true;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda = 
        a.titulo.toLowerCase().includes(busquedaLower) ||
        a.resumen.toLowerCase().includes(busquedaLower) ||
        a.tags.some(tag => tag.toLowerCase().includes(busquedaLower));
    }
    
    return cumpleTipo && cumpleCategoria && cumpleBusqueda;
  });

  // Función para abrir modal con detalle
  const handleCardClick = (articulo) => {
    setArticuloSeleccionado(articulo);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setArticuloSeleccionado(null);
  };

  // Obtener categorías
  const categorias = getCategoriasBlog();

  // Función para obtener color de categoría
  const getCategoryColor = (categoria) => {
    const colors = {
      'Guías Espirituales': '#9333ea',
      'Herramientas Espirituales': '#ec4899',
      'Arcángeles': '#d4af37',
      'Señales Angelicales': '#3b82f6',
      'Meditaciones': '#10b981',
      'Protección Espiritual': '#8b5cf6',
      'Abundancia': '#f59e0b',
      'Comunicación Angelical': '#06b6d4'
    };
    return colors[categoria] || '#6366f1';
  };

  return (
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
            <BookOpen className="inline-block mr-3" size={40} />
            Blog Angelical
          </h1>
          <p className="subtitle" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Artículos y guías sobre ángeles, arcángeles y espiritualidad
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
                color: '#6366f1'
              }} 
            />
            <input
              type="text"
              placeholder="Buscar artículos..."
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
                color: filtro === 'todos' ? '#6366f1' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Todos ({articulos.length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'destacados' ? 'active' : ''}`}
              onClick={() => setFiltro('destacados')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'destacados' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'destacados' ? '#6366f1' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Destacados ({articulos.filter(a => a.destacado).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'premium' ? 'active' : ''}`}
              onClick={() => setFiltro('premium')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'premium' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'premium' ? '#6366f1' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Premium ({articulos.filter(a => a.premium).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'gratuitos' ? 'active' : ''}`}
              onClick={() => setFiltro('gratuitos')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'gratuitos' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'gratuitos' ? '#6366f1' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Gratuitos ({articulos.filter(a => !a.premium).length})
            </button>
          </div>

          {/* Filtro de categoría */}
          <div style={{ marginTop: '15px' }}>
            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#6366f1',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de artículos */}
      <div className="marketplace-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        padding: '20px'
      }}>
        {articulosFiltrados.map(articulo => (
          <div 
            key={articulo.id}
            className="articulo-card"
            onClick={() => handleCardClick(articulo)}
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
                src={articulo.imagen} 
                alt={articulo.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Badges */}
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                {articulo.destacado && (
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
                {articulo.premium && (
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
                background: getCategoryColor(articulo.categoria),
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
                {articulo.categoria}
              </div>
            </div>

            {/* Contenido */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#1f2937',
                lineHeight: '1.4'
              }}>
                {articulo.titulo}
              </h3>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.95rem',
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                {articulo.resumen.substring(0, 120)}...
              </p>

              {/* Metadata */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '15px', 
                fontSize: '0.85rem',
                color: '#9ca3af',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} />
                  <span>{articulo.autor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} />
                  <span>{new Date(articulo.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} />
                  <span>{articulo.tiempoLectura}</span>
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
                  <Eye size={16} style={{ color: '#6366f1' }} />
                  <span>{articulo.vistas.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} style={{ color: '#ec4899' }} />
                  <span>{articulo.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={16} style={{ color: '#10b981' }} />
                  <span>{articulo.compartidos}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {articuloSeleccionado && (
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
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={handleCloseModal}
        >
          <div 
            className="modal-content"
            style={{
              background: 'white',
              borderRadius: '25px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              margin: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'sticky',
                top: '20px',
                right: '20px',
                float: 'right',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={24} />
            </button>

            {/* Imagen de portada */}
            <div style={{ height: '350px', overflow: 'hidden', borderRadius: '25px 25px 0 0' }}>
              <img 
                src={articuloSeleccionado.imagen} 
                alt={articuloSeleccionado.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Contenido del artículo */}
            <div style={{ padding: '40px' }}>
              {/* Header del artículo */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '8px 16px',
                    background: getCategoryColor(articuloSeleccionado.categoria) + '20',
                    color: getCategoryColor(articuloSeleccionado.categoria),
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Tag size={14} />
                    {articuloSeleccionado.categoria}
                  </span>
                  {articuloSeleccionado.destacado && (
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
                  {articuloSeleccionado.premium && (
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

                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '20px',
                  color: '#1f2937',
                  lineHeight: '1.2'
                }}>
                  {articuloSeleccionado.titulo}
                </h1>

                {/* Metadata */}
                <div style={{ 
                  display: 'flex', 
                  gap: '25px',
                  flexWrap: 'wrap',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f3f4f6',
                  color: '#6b7280',
                  fontSize: '0.95rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} style={{ color: '#6366f1' }} />
                    <span>{articuloSeleccionado.autor}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: '#6366f1' }} />
                    <span>{new Date(articuloSeleccionado.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} style={{ color: '#6366f1' }} />
                    <span>{articuloSeleccionado.tiempoLectura} de lectura</span>
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
                    <Eye size={20} style={{ color: '#6366f1' }} />
                    <span>{articuloSeleccionado.vistas.toLocaleString()} vistas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <Heart size={20} style={{ color: '#ec4899' }} />
                    <span>{articuloSeleccionado.likes} likes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <Share2 size={20} style={{ color: '#10b981' }} />
                    <span>{articuloSeleccionado.compartidos} compartidos</span>
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <div style={{
                background: '#f9fafb',
                padding: '25px',
                borderRadius: '15px',
                marginBottom: '30px',
                borderLeft: `4px solid ${getCategoryColor(articuloSeleccionado.categoria)}`
              }}>
                <p style={{ 
                  fontSize: '1.15rem',
                  lineHeight: '1.8',
                  color: '#4b5563',
                  fontStyle: 'italic'
                }}>
                  {articuloSeleccionado.resumen}
                </p>
              </div>

              {/* Contenido principal */}
              <div style={{
                fontSize: '1.05rem',
                lineHeight: '1.9',
                color: '#374151'
              }}>
                {articuloSeleccionado.contenido.split('\n\n').map((parrafo, idx) => (
                  <p key={idx} style={{ marginBottom: '20px', whiteSpace: 'pre-line' }}>
                    {parrafo}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div style={{ 
                marginTop: '40px',
                paddingTop: '30px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <h3 style={{ 
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: '#1f2937'
                }}>
                  Etiquetas
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {articuloSeleccionado.tags.map((tag, idx) => (
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
      {articulosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <BookOpen size={64} style={{ margin: '0 auto 20px', opacity: 0.3' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No se encontraron artículos</h3>
          <p>Intenta ajustar los filtros o la búsqueda para ver más opciones</p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceBlog;

