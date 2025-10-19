import React, { useState } from 'react';
import { getCanalizaciones } from '../data/canalizacionesData';
import './MarketplaceCanalizaciones.css';

const MarketplaceCanalizaciones = () => {
  const [canalizaciones] = useState(getCanalizaciones());
  const [filtro, setFiltro] = useState('todas'); // todas, gratuitas, premium
  const [vistaGrid, setVistaGrid] = useState(true);

  // Filtrar canalizaciones
  const canalizacionesFiltradas = canalizaciones.filter(c => {
    if (filtro === 'gratuitas') return !c.premium || c.precio === 0;
    if (filtro === 'premium') return c.premium && c.precio > 0;
    return true;
  });

  // Función para manejar compra
  const handleCompra = (canalizacionId) => {
    // TODO: Integrar con sistema de pagos
    console.log('Comprar canalización:', canalizacionId);
    alert('Sistema de pagos en desarrollo. Pronto podrás comprar esta canalización.');
  };

  // Función para acceder a canalización
  const handleAcceso = (canalizacionId) => {
    // Redirigir a la página de la canalización
    window.location.href = `/dashboard/canalizaciones/${canalizacionId}`;
  };

  return (
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <div className="header-content">
          <h1>Canalizaciones Angelicales</h1>
          <p className="subtitle">
            Conecta con la sabiduría angelical a través de canalizaciones profundas y transformadoras
          </p>
        </div>

        {/* Filtros y vista */}
        <div className="marketplace-controls">
          <div className="filtros">
            <button
              className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltro('todas')}
            >
              Todas ({canalizaciones.length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'gratuitas' ? 'active' : ''}`}
              onClick={() => setFiltro('gratuitas')}
            >
              Gratuitas ({canalizaciones.filter(c => !c.premium || c.precio === 0).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'premium' ? 'active' : ''}`}
              onClick={() => setFiltro('premium')}
            >
              Premium ({canalizaciones.filter(c => c.premium && c.precio > 0).length})
            </button>
          </div>

          <div className="vista-toggle">
            <button
              className={`vista-btn ${vistaGrid ? 'active' : ''}`}
              onClick={() => setVistaGrid(true)}
              title="Vista en cuadrícula"
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`vista-btn ${!vistaGrid ? 'active' : ''}`}
              onClick={() => setVistaGrid(false)}
              title="Vista en lista"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de canalizaciones */}
      <div className={`canalizaciones-grid ${vistaGrid ? 'grid-view' : 'list-view'}`}>
        {canalizacionesFiltradas.map((canaliz) => (
          <div key={canaliz.id} className="canaliz-card">
            {/* Imagen */}
            <div className="card-image-container">
              <img
                src={canaliz.imagen}
                alt={canaliz.titulo}
                className="card-image"
              />
              
              {/* Badge de precio o gratis */}
              <div className="precio-badge">
                {!canaliz.premium || canaliz.precio === 0 ? (
                  <span className="badge-gratis">GRATIS</span>
                ) : (
                  <span className="badge-precio">${canaliz.precio}</span>
                )}
              </div>

              {/* Badge de duración */}
              <div className="duracion-badge">
                <i className="far fa-clock"></i> {canaliz.duracionMinutos} min
              </div>
            </div>

            {/* Contenido */}
            <div className="card-content">
              {/* Categoría */}
              <div className="card-categoria">
                <span className={`categoria-badge bg-gradient-to-r ${canaliz.color}`}>
                  {canaliz.categoria}
                </span>
              </div>

              {/* Título */}
              <h3 className="card-titulo">{canaliz.titulo}</h3>

              {/* Descripción corta */}
              <p className="card-descripcion">
                {canaliz.descripcionCorta || canaliz.descripcion.substring(0, 120) + '...'}
              </p>

              {/* Metadatos */}
              <div className="card-metadatos">
                <div className="metadato">
                  <i className="fas fa-music"></i>
                  <span>{canaliz.frecuenciaSonora}</span>
                </div>
                <div className="metadato">
                  <i className="fas fa-gem"></i>
                  <span>{canaliz.cristalRecomendado.split(' ')[0]}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="card-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < Math.floor(canaliz.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-text">
                  {canaliz.rating} ({canaliz.reproducciones} reproducciones)
                </span>
              </div>

              {/* Botón de acción */}
              <div className="card-action">
                {canaliz.comprado || (!canaliz.premium || canaliz.precio === 0) ? (
                  <button
                    className="btn-acceder"
                    onClick={() => handleAcceso(canaliz.id)}
                  >
                    <i className="fas fa-play-circle"></i>
                    Acceder ahora
                  </button>
                ) : (
                  <button
                    className="btn-comprar"
                    onClick={() => handleCompra(canaliz.id)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Comprar ${canaliz.precio}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {canalizacionesFiltradas.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-search"></i>
          <p>No se encontraron canalizaciones con este filtro</p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceCanalizaciones;

