import React, { useState } from 'react';
import { getCanalizaciones } from '../data/canalizacionesData';
import { generateCanalizacionPDF } from '../utils/canalizacionPDFGenerator';
import './MarketplaceCanalizaciones.css';

// Marketplace de Canalizaciones Angelicales
const MarketplaceCanalizaciones = () => {
  const [canalizaciones] = useState(getCanalizaciones());
  const [filtro, setFiltro] = useState('todas'); // todas, gratuitas, premium
  const [vistaGrid, setVistaGrid] = useState(true);
  const [canalizacionSeleccionada, setCanalizacionSeleccionada] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('preparacion');

  // Filtrar canalizaciones
  const canalizacionesFiltradas = canalizaciones.filter(c => {
    if (filtro === 'gratuitas') return !c.premium || c.precio === 0;
    if (filtro === 'premium') return c.premium && c.precio > 0;
    return true;
  });

  // Función para abrir modal con detalle
  const handleCardClick = (canaliz) => {
    setCanalizacionSeleccionada(canaliz);
    setSeccionActiva('preparacion');
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setCanalizacionSeleccionada(null);
  };

  // Función para manejar compra
  const handleCompra = (canalizacionId) => {
    // TODO: Integrar con sistema de pagos
    console.log('Comprar canalización:', canalizacionId);
    alert('Sistema de pagos en desarrollo. Pronto podrás comprar esta canalización.');
  };

  // Función para acceder a canalización
  const handleAcceso = (canaliz) => {
    // Si ya está en el modal, solo cerrar
    if (canalizacionSeleccionada) {
      handleCloseModal();
    }
    // Aquí podrías agregar lógica adicional como marcar como "reproducida"
  };

  // Función para descargar PDF
  const handleDescargarPDF = (canaliz) => {
    generateCanalizacionPDF(canaliz);
  };

  // Verificar si el usuario tiene acceso
  const tieneAcceso = (canaliz) => {
    return !canaliz.premium || canaliz.precio === 0 || canaliz.comprado;
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
          <div 
            key={canaliz.id} 
            className="canaliz-card"
            onClick={() => handleCardClick(canaliz)}
          >
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
                ) : canaliz.comprado ? (
                  <span className="badge-comprado">COMPRADO</span>
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
                  <span>{canaliz.frecuenciaSonora.split(' ')[0]}</span>
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

              {/* Botón de ver más */}
              <div className="card-action">
                <button className="btn-ver-mas">
                  <i className="fas fa-info-circle"></i>
                  Ver detalles
                </button>
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

      {/* Modal de detalle */}
      {canalizacionSeleccionada && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button className="modal-close" onClick={handleCloseModal}>
              <i className="fas fa-times"></i>
            </button>

            {/* Header del modal */}
            <div className="modal-header">
              <img 
                src={canalizacionSeleccionada.imagen} 
                alt={canalizacionSeleccionada.titulo}
                className="modal-image"
              />
              <div className="modal-header-overlay">
                <div className="modal-header-content">
                  <span className={`modal-categoria bg-gradient-to-r ${canalizacionSeleccionada.color}`}>
                    {canalizacionSeleccionada.categoria}
                  </span>
                  <h2>{canalizacionSeleccionada.titulo}</h2>
                  <p className="modal-arcangel">{canalizacionSeleccionada.arcangel}</p>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="modal-body">
              {/* Metadatos destacados */}
              <div className="modal-metadatos">
                <div className="metadato-item">
                  <i className="far fa-clock"></i>
                  <div>
                    <strong>Duración</strong>
                    <span>{canalizacionSeleccionada.duracion}</span>
                  </div>
                </div>
                <div className="metadato-item">
                  <i className="fas fa-music"></i>
                  <div>
                    <strong>Frecuencia</strong>
                    <span>{canalizacionSeleccionada.frecuenciaSonora}</span>
                  </div>
                </div>
                <div className="metadato-item">
                  <i className="fas fa-gem"></i>
                  <div>
                    <strong>Cristal</strong>
                    <span>{canalizacionSeleccionada.cristalRecomendado}</span>
                  </div>
                </div>
                <div className="metadato-item">
                  <i className="fas fa-palette"></i>
                  <div>
                    <strong>Color</strong>
                    <span>{canalizacionSeleccionada.colorVibracional}</span>
                  </div>
                </div>
              </div>

              {/* Descripción y propósito */}
              <div className="modal-descripcion">
                <h3>Descripción</h3>
                <p>{canalizacionSeleccionada.descripcion}</p>
                
                <h3>Propósito</h3>
                <p>{canalizacionSeleccionada.proposito}</p>
              </div>

              {/* Navegación de secciones */}
              {tieneAcceso(canalizacionSeleccionada) && canalizacionSeleccionada.contenido && (
                <>
                  <div className="modal-secciones-nav">
                    <button
                      className={`seccion-btn ${seccionActiva === 'preparacion' ? 'active' : ''}`}
                      onClick={() => setSeccionActiva('preparacion')}
                    >
                      🕯️ Preparación
                    </button>
                    <button
                      className={`seccion-btn ${seccionActiva === 'visualizacion' ? 'active' : ''}`}
                      onClick={() => setSeccionActiva('visualizacion')}
                    >
                      🌈 Visualización
                    </button>
                    <button
                      className={`seccion-btn ${seccionActiva === 'mensaje' ? 'active' : ''}`}
                      onClick={() => setSeccionActiva('mensaje')}
                    >
                      👼 Mensaje
                    </button>
                    <button
                      className={`seccion-btn ${seccionActiva === 'integracion' ? 'active' : ''}`}
                      onClick={() => setSeccionActiva('integracion')}
                    >
                      🌿 Integración
                    </button>
                    <button
                      className={`seccion-btn ${seccionActiva === 'cierre' ? 'active' : ''}`}
                      onClick={() => setSeccionActiva('cierre')}
                    >
                      🔔 Cierre
                    </button>
                  </div>

                  {/* Contenido de la sección activa */}
                  <div className="modal-seccion-contenido">
                    {seccionActiva === 'preparacion' && canalizacionSeleccionada.contenido.preparacionEnergetica && (
                      <div className="seccion-detalle">
                        <h3>{canalizacionSeleccionada.contenido.preparacionEnergetica.titulo}</h3>
                        <p className="seccion-duracion">
                          <i className="far fa-clock"></i> {canalizacionSeleccionada.contenido.preparacionEnergetica.duracion}
                        </p>
                        {canalizacionSeleccionada.contenido.preparacionEnergetica.pasos.map((paso) => (
                          <div key={paso.numero} className="paso-box">
                            <div className="paso-numero">{paso.numero}</div>
                            <div className="paso-contenido">
                              <h4>{paso.titulo}</h4>
                              <p>{paso.descripcion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {seccionActiva === 'visualizacion' && canalizacionSeleccionada.contenido.visualizacionGuiada && (
                      <div className="seccion-detalle">
                        <h3>{canalizacionSeleccionada.contenido.visualizacionGuiada.titulo}</h3>
                        <p className="seccion-duracion">
                          <i className="far fa-clock"></i> {canalizacionSeleccionada.contenido.visualizacionGuiada.duracion}
                        </p>
                        <div className="texto-guiado">
                          {canalizacionSeleccionada.contenido.visualizacionGuiada.texto}
                        </div>
                      </div>
                    )}

                    {seccionActiva === 'mensaje' && canalizacionSeleccionada.contenido.mensajeCanalizado && (
                      <div className="seccion-detalle">
                        <h3>{canalizacionSeleccionada.contenido.mensajeCanalizado.titulo}</h3>
                        <p className="seccion-duracion">
                          <i className="far fa-clock"></i> {canalizacionSeleccionada.contenido.mensajeCanalizado.duracion}
                        </p>
                        <div className="mensaje-canalizado">
                          {canalizacionSeleccionada.contenido.mensajeCanalizado.texto}
                        </div>
                      </div>
                    )}

                    {seccionActiva === 'integracion' && canalizacionSeleccionada.contenido.integracionPractica && (
                      <div className="seccion-detalle">
                        <h3>{canalizacionSeleccionada.contenido.integracionPractica.titulo}</h3>
                        <p className="seccion-duracion">
                          <i className="far fa-clock"></i> {canalizacionSeleccionada.contenido.integracionPractica.duracion}
                        </p>
                        {canalizacionSeleccionada.contenido.integracionPractica.pasos.map((paso) => (
                          <div key={paso.numero} className="paso-box">
                            <div className="paso-numero">{paso.numero}</div>
                            <div className="paso-contenido">
                              <h4>{paso.titulo}</h4>
                              <p>{paso.descripcion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {seccionActiva === 'cierre' && canalizacionSeleccionada.contenido.cierreEnergetico && (
                      <div className="seccion-detalle">
                        <h3>{canalizacionSeleccionada.contenido.cierreEnergetico.titulo}</h3>
                        <p className="seccion-duracion">
                          <i className="far fa-clock"></i> {canalizacionSeleccionada.contenido.cierreEnergetico.duracion}
                        </p>
                        <div className="texto-guiado">
                          {canalizacionSeleccionada.contenido.cierreEnergetico.texto}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Decreto y afirmación */}
                  <div className="modal-decretos">
                    <div className="decreto-box">
                      <h4>💎 Decreto Final</h4>
                      <p>{canalizacionSeleccionada.decretoFinal}</p>
                    </div>
                    <div className="afirmacion-box">
                      <h4>🌸 Afirmación Diaria</h4>
                      <p>{canalizacionSeleccionada.afirmacionDiaria}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Preview limitado para premium no comprado */}
              {!tieneAcceso(canalizacionSeleccionada) && (
                <div className="preview-limitado">
                  <div className="preview-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <h3>Contenido Premium</h3>
                  <p>Esta canalización incluye 5 secciones completas de contenido profundo y transformador.</p>
                  <ul className="preview-lista">
                    <li><i className="fas fa-check"></i> 🕯️ Preparación Energética completa</li>
                    <li><i className="fas fa-check"></i> 🌈 Visualización Guiada profunda</li>
                    <li><i className="fas fa-check"></i> 👼 Mensaje Canalizado exclusivo</li>
                    <li><i className="fas fa-check"></i> 🌿 Integración Práctica diaria</li>
                    <li><i className="fas fa-check"></i> 🔔 Cierre Energético poderoso</li>
                    <li><i className="fas fa-check"></i> 💎 Decreto y Afirmación</li>
                    <li><i className="fas fa-check"></i> 📄 PDF descargable</li>
                  </ul>
                </div>
              )}

              {/* Botones de acción */}
              <div className="modal-actions">
                {tieneAcceso(canalizacionSeleccionada) ? (
                  <>
                    <button
                      className="btn-modal-principal"
                      onClick={() => handleAcceso(canalizacionSeleccionada)}
                    >
                      <i className="fas fa-play-circle"></i>
                      Comenzar Canalización
                    </button>
                    <button
                      className="btn-modal-secundario"
                      onClick={() => handleDescargarPDF(canalizacionSeleccionada)}
                    >
                      <i className="fas fa-download"></i>
                      Descargar PDF
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-modal-comprar"
                    onClick={() => handleCompra(canalizacionSeleccionada.id)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Comprar por ${canalizacionSeleccionada.precio}
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

export default MarketplaceCanalizaciones;

