import React, { useState } from 'react';
import { getSonoterapias, getCategoriasSonoterapia } from '../data/sonoterapiaData';
import './MarketplaceCanalizaciones.css'; // Reutilizamos los estilos

// Marketplace de Sonoterapias Angelicales
const MarketplaceSonoterapia = ({ onVolver, addToCart }) => {
  const [sonoterapias] = useState(getSonoterapias());
  const [filtro, setFiltro] = useState('todas'); // todas, gratuitas, premium
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [vistaGrid, setVistaGrid] = useState(true);
  const [sonoterapiaSeleccionada, setSonoterapiaSeleccionada] = useState(null);

  // Filtrar sonoterapias
  const sonoterapiasFiltradas = sonoterapias.filter(s => {
    // Filtro por precio
    let cumplePrecio = true;
    if (filtro === 'gratuitas') cumplePrecio = !s.premium || s.precio === 0;
    if (filtro === 'premium') cumplePrecio = s.premium && s.precio > 0;
    
    // Filtro por categoría
    let cumpleCategoria = true;
    if (categoriaFiltro !== 'todas') cumpleCategoria = s.categoria === categoriaFiltro;
    
    return cumplePrecio && cumpleCategoria;
  });

  // Función para abrir modal con detalle
  const handleCardClick = (sono) => {
    setSonoterapiaSeleccionada(sono);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setSonoterapiaSeleccionada(null);
  };

  // Función para manejar compra
  const handleCompra = (sonoterapiaId) => {
    console.log('Comprar sonoterapia:', sonoterapiaId);
    alert('Sistema de pagos en desarrollo. Pronto podrás comprar esta sonoterapia.');
  };

  // Función para reproducir
  const handleReproducir = (sono) => {
    console.log('Reproducir sonoterapia:', sono.titulo);
    // TODO: Integrar reproductor de audio
    alert(`Reproduciendo: ${sono.titulo}\n\nReproductor de audio en desarrollo.`);
  };

  // Verificar si el usuario tiene acceso
  const tieneAcceso = (sono) => {
    return !sono.premium || sono.precio === 0 || sono.comprado;
  };

  // Obtener categorías únicas
  const categorias = getCategoriasSonoterapia();

  return (
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 30px',
        borderRadius: '20px',
        marginBottom: '30px',
        color: 'white'
      }}>
        <div className="header-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            Sonoterapia Angelical
          </h1>
          <p className="subtitle" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Armoniza tu ser con frecuencias sagradas y vibraciones sanadoras
          </p>
        </div>

        {/* Filtros y vista */}
        <div className="marketplace-controls" style={{ marginTop: '20px' }}>
          <div className="filtros">
            <button
              className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltro('todas')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'todas' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'todas' ? '#667eea' : 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Todas ({sonoterapias.length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'gratuitas' ? 'active' : ''}`}
              onClick={() => setFiltro('gratuitas')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'gratuitas' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'gratuitas' ? '#667eea' : 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginLeft: '10px'
              }}
            >
              Gratuitas ({sonoterapias.filter(s => !s.premium || s.precio === 0).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'premium' ? 'active' : ''}`}
              onClick={() => setFiltro('premium')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'premium' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'premium' ? '#667eea' : 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginLeft: '10px'
              }}
            >
              Premium ({sonoterapias.filter(s => s.premium && s.precio > 0).length})
            </button>
          </div>
        </div>

        {/* Filtro por categoría */}
        <div style={{ marginTop: '20px' }}>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={{
              padding: '12px 20px',
              borderRadius: '25px',
              border: 'none',
              background: 'white',
              color: '#667eea',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              minWidth: '200px'
            }}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de sonoterapias */}
      <div className={`canalizaciones-grid ${vistaGrid ? 'grid-view' : 'list-view'}`}>
        {sonoterapiasFiltradas.map((sono) => (
          <div 
            key={sono.id} 
            className="canaliz-card"
            onClick={() => handleCardClick(sono)}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              borderRadius: '15px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {/* Imagen */}
            <div className="card-image-container" style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img
                src={sono.imagen}
                alt={sono.titulo}
                className="card-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Badge de precio o gratis */}
              <div className="precio-badge" style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 15px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>
                {!sono.premium || sono.precio === 0 ? (
                  <span className="badge-gratis" style={{ background: '#10b981', color: 'white' }}>GRATIS</span>
                ) : sono.comprado ? (
                  <span className="badge-comprado" style={{ background: '#3b82f6', color: 'white' }}>COMPRADO</span>
                ) : (
                  <span className="badge-precio" style={{ background: '#f59e0b', color: 'white' }}>${sono.precio}</span>
                )}
              </div>

              {/* Badge de duración */}
              <div className="duracion-badge" style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="far fa-clock"></i> {sono.duracionMinutos} min
              </div>
            </div>

            {/* Contenido */}
            <div className="card-content" style={{ padding: '20px' }}>
              {/* Categoría */}
              <div className="card-categoria" style={{ marginBottom: '10px' }}>
                <span className={`categoria-badge bg-gradient-to-r ${sono.color}`} style={{
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'white',
                  display: 'inline-block'
                }}>
                  {sono.categoria}
                </span>
              </div>

              {/* Título */}
              <h3 className="card-titulo" style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '10px',
                lineHeight: '1.4'
              }}>
                {sono.titulo}
              </h3>

              {/* Descripción corta */}
              <p className="card-descripcion" style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                marginBottom: '15px',
                lineHeight: '1.5'
              }}>
                {sono.descripcion.substring(0, 100)}...
              </p>

              {/* Arcángel */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '15px',
                color: '#667eea',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <i className="fas fa-angel"></i>
                <span>{sono.arcangel}</span>
              </div>

              {/* Botón de ver más */}
              <div className="card-action">
                <button 
                  className="btn-ver-mas"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <i className="fas fa-play-circle"></i>
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sonoterapiasFiltradas.length === 0 && (
        <div className="empty-state" style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#9ca3af'
        }}>
          <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
          <p style={{ fontSize: '1.1rem' }}>No se encontraron sonoterapias con este filtro</p>
        </div>
      )}

      {/* Modal de detalle */}
      {sonoterapiaSeleccionada && (
        <div 
          className="modal-overlay" 
          onClick={handleCloseModal}
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
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            {/* Botón cerrar */}
            <button 
              className="modal-close" 
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Header del modal */}
            <div className="modal-header" style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
              <img 
                src={sonoterapiaSeleccionada.imagen} 
                alt={sonoterapiaSeleccionada.titulo}
                className="modal-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="modal-header-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '30px'
              }}>
                <div className="modal-header-content">
                  <span className={`modal-categoria bg-gradient-to-r ${sonoterapiaSeleccionada.color}`} style={{
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'white',
                    display: 'inline-block',
                    marginBottom: '10px'
                  }}>
                    {sonoterapiaSeleccionada.categoria}
                  </span>
                  <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                    {sonoterapiaSeleccionada.titulo}
                  </h2>
                  <p className="modal-arcangel" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                    <i className="fas fa-angel"></i> {sonoterapiaSeleccionada.arcangel}
                  </p>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="modal-body" style={{ padding: '30px' }}>
              {/* Metadatos destacados */}
              <div className="modal-metadatos" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div className="metadato-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px',
                  background: '#f3f4f6',
                  borderRadius: '10px'
                }}>
                  <i className="far fa-clock" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Duración</strong>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                      {sonoterapiaSeleccionada.duracionMinutos} min
                    </span>
                  </div>
                </div>
                <div className="metadato-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px',
                  background: '#f3f4f6',
                  borderRadius: '10px'
                }}>
                  <i className="fas fa-tag" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Precio</strong>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                      {!sonoterapiaSeleccionada.premium || sonoterapiaSeleccionada.precio === 0 ? 'GRATIS' : `$${sonoterapiaSeleccionada.precio}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción completa */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937', marginBottom: '15px' }}>
                  Descripción
                </h3>
                <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.7' }}>
                  {sonoterapiaSeleccionada.descripcion}
                </p>
              </div>

              {/* Beneficios */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937', marginBottom: '15px' }}>
                  Beneficios
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {sonoterapiaSeleccionada.beneficios.map((beneficio, index) => (
                    <span 
                      key={index}
                      style={{
                        padding: '8px 16px',
                        background: '#e0e7ff',
                        color: '#667eea',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      <i className="fas fa-check-circle"></i> {beneficio}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                {tieneAcceso(sonoterapiaSeleccionada) ? (
                  <button
                    onClick={() => handleReproducir(sonoterapiaSeleccionada)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <i className="fas fa-play"></i>
                    Reproducir Ahora
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompra(sonoterapiaSeleccionada.id)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Comprar ${sonoterapiaSeleccionada.precio}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceSonoterapia;

