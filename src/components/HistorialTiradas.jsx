import React, { useState } from 'react';
import { useAperturaAngelical } from '../contexts/AperturaAngelicalContext';
import { Search, Filter, Calendar, Star, Trash2, Eye, X } from 'lucide-react';
import './HistorialTiradas.css';

const HistorialTiradas = ({ onClose, onVerTirada }) => {
  const { aperturaState, buscarEnHistorial, agregarFavorito } = useAperturaAngelical();
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    tipo: '',
    tema: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const tiradas = buscarEnHistorial(busqueda, filtros);
  
  const handleAgregarFavorito = async (tirada) => {
    await agregarFavorito({
      tirada_id: tirada.id,
      tipo_tirada: tirada.tipo_tirada,
      tema: tirada.tema,
      cartas: tirada.cartas,
      interpretaciones: tirada.interpretaciones
    });
  };
  
  return (
    <div className="historial-modal-overlay" onClick={onClose}>
      <div className="historial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="historial-header">
          <div className="historial-header-content">
            <h2>📜 Historial de Tiradas</h2>
            <p className="historial-subtitle">
              {tiradas.length} {tiradas.length === 1 ? 'tirada' : 'tiradas'} encontradas
            </p>
          </div>
          <button onClick={onClose} className="btn-close" title="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="historial-filtros">
          <div className="search-box">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por tema, tipo o carta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`btn-toggle-filtros ${mostrarFiltros ? 'activo' : ''}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
        
        {mostrarFiltros && (
          <div className="filtros-avanzados">
            <select 
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              <option value="3 Cartas">3 Cartas</option>
              <option value="6 Cartas">6 Cartas</option>
              <option value="9 Cartas">9 Cartas</option>
            </select>
            
            <select 
              value={filtros.tema}
              onChange={(e) => setFiltros({ ...filtros, tema: e.target.value })}
              className="filter-select"
            >
              <option value="">Todos los temas</option>
              <option value="Amor y Relaciones">Amor y Relaciones</option>
              <option value="Trabajo y Abundancia">Trabajo y Abundancia</option>
              <option value="Salud y Bienestar">Salud y Bienestar</option>
              <option value="Propósito y Misión">Propósito y Misión</option>
              <option value="Crecimiento Espiritual">Crecimiento Espiritual</option>
              <option value="Tirada General">Tirada General</option>
            </select>
            
            <button 
              onClick={() => setFiltros({ tipo: '', tema: '', fechaDesde: '', fechaHasta: '' })}
              className="btn-limpiar-filtros"
            >
              Limpiar filtros
            </button>
          </div>
        )}
        
        <div className="historial-lista">
          {tiradas.length === 0 ? (
            <div className="empty-state">
              <Calendar className="w-16 h-16 opacity-20" />
              <p className="empty-title">No hay tiradas en el historial</p>
              <p className="empty-subtitle">
                {busqueda || filtros.tipo || filtros.tema 
                  ? 'Intenta con otros criterios de búsqueda'
                  : 'Realiza tu primera tirada angelical'}
              </p>
            </div>
          ) : (
            tiradas.map(tirada => (
              <div key={tirada.id} className="tirada-item">
                <div className="tirada-info">
                  <div className="tirada-header-item">
                    <h3>{tirada.tema}</h3>
                    <span className={`badge-tipo ${tirada.tipo_tirada.replace(' ', '-').toLowerCase()}`}>
                      {tirada.tipo_tirada}
                    </span>
                  </div>
                  
                  <p className="tirada-meta">
                    <Calendar className="w-3 h-3" />
                    {new Date(tirada.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  
                  <div className="tirada-cartas-preview">
                    {tirada.cartas.slice(0, 3).map((carta, i) => (
                      <div key={i} className="carta-preview-item">
                        <img 
                          src={carta.imagen || '/cartas/placeholder.png'} 
                          alt={carta.nombre}
                          className="carta-preview-img"
                        />
                        <span className="carta-nombre">{carta.nombre}</span>
                      </div>
                    ))}
                    {tirada.cartas.length > 3 && (
                      <span className="mas-cartas">+{tirada.cartas.length - 3} más</span>
                    )}
                  </div>
                  
                  {tirada.ambiente && (
                    <div className="tirada-ambiente">
                      <span className="ambiente-badge">🌟 {tirada.ambiente}</span>
                    </div>
                  )}
                </div>
                
                <div className="tirada-acciones">
                  <button 
                    onClick={() => onVerTirada(tirada)}
                    className="btn-accion btn-ver"
                    title="Ver tirada completa"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                  <button 
                    onClick={() => handleAgregarFavorito(tirada)}
                    className="btn-accion btn-favorito"
                    title="Agregar a favoritos"
                  >
                    <Star className="w-4 h-4" />
                    <span>Favorito</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="historial-stats">
          <div className="stat-item">
            <span className="stat-label">Total de tiradas:</span>
            <span className="stat-value">{aperturaState.estadisticas.totalTiradas}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Racha actual:</span>
            <span className="stat-value">{aperturaState.estadisticas.racha} días 🔥</span>
          </div>
          {aperturaState.estadisticas.ultima_tirada && (
            <div className="stat-item">
              <span className="stat-label">Última tirada:</span>
              <span className="stat-value">
                {new Date(aperturaState.estadisticas.ultima_tirada).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialTiradas;

