import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Square, Grid, LayoutGrid } from 'lucide-react';
import './EventosModernos.css';

const EventosModernos = ({ eventos = [], eventosInscritos = [], onEventoClick = () => {}, onToggleInscripcion = () => {}, searchValue = '', filters = { categoria: 'todos' } }) => {
  const [layoutCols, setLayoutCols] = useState(3); // 2, 3, o 4 columnas
  const [selectedEventos, setSelectedEventos] = useState([]);

  // Filtrar eventos basado en búsqueda y filtros
  const eventosFiltrados = eventos.filter(evento => {
    const cumpleBusqueda = !searchValue || 
      evento.titulo.toLowerCase().includes(searchValue.toLowerCase()) ||
      evento.descripcion.toLowerCase().includes(searchValue.toLowerCase()) ||
      evento.categoria.toLowerCase().includes(searchValue.toLowerCase());
    
    const cumpleFiltro = !filters.categoria || 
      filters.categoria === 'todos' || 
      evento.categoria.toLowerCase() === filters.categoria.toLowerCase();
    
    return cumpleBusqueda && cumpleFiltro;
  });

  // Calcular estadísticas para el resumen
  const totalInscritos = eventosInscritos.length;
  const eventosDisponibles = eventosFiltrados.filter(e => e.inscritos < e.cupos).length;
  const eventosCompletos = eventosFiltrados.filter(e => e.inscritos >= e.cupos).length;
  const categorias = [...new Set(eventosFiltrados.map(e => e.categoria))].length;

  const handleEventoSelect = (evento) => {
    setSelectedEventos(prev => {
      const isSelected = prev.includes(evento.id);
      if (isSelected) {
        return prev.filter(id => id !== evento.id);
      } else {
        return [...prev, evento.id];
      }
    });
    onEventoClick(evento);
  };

  const getLayoutClass = () => {
    switch(layoutCols) {
      case 2: return 'eventos-grid-2';
      case 3: return 'eventos-grid-3';
      case 4: return 'eventos-grid-4';
      default: return 'eventos-grid-3';
    }
  };

  return (
    <div className="eventos-modernos-container">
      {/* Resumen Dashboard */}
      <div className="eventos-dashboard-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Calendar size={24} />
          </div>
          <div className="summary-content">
            <h3>{eventosFiltrados.length}</h3>
            <p>Eventos Totales</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Users size={24} />
          </div>
          <div className="summary-content">
            <h3>{totalInscritos}</h3>
            <p>Mis Inscripciones</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Clock size={24} />
          </div>
          <div className="summary-content">
            <h3>{eventosDisponibles}</h3>
            <p>Disponibles</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Star size={24} />
          </div>
          <div className="summary-content">
            <h3>{categorias}</h3>
            <p>Categorías</p>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="eventos-results-info">
        <span>{eventosFiltrados.length} resultado{eventosFiltrados.length !== 1 ? 's' : ''} de {eventos.length} eventos</span>
      </div>
      
      {/* Controles de layout */}
      <div className="eventos-header-controls">
        <div className="eventos-layout-controls">
          <button 
            className={`layout-btn ${layoutCols === 2 ? 'active' : ''}`}
            onClick={() => setLayoutCols(2)}
            title="2 por línea"
          >
            <Square size={20} />
          </button>
          <button 
            className={`layout-btn ${layoutCols === 3 ? 'active' : ''}`}
            onClick={() => setLayoutCols(3)}
            title="3 por línea"
          >
            <Grid size={20} />
          </button>
          <button 
            className={`layout-btn ${layoutCols === 4 ? 'active' : ''}`}
            onClick={() => setLayoutCols(4)}
            title="4 por línea"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Grid de eventos */}
      <div className={`eventos-modern-grid ${getLayoutClass()}`}>
        {eventosFiltrados.map((evento, index) => {
          const estaInscrito = eventosInscritos.includes(evento.id);
          const estaSeleccionado = selectedEventos.includes(evento.id);
          const fechaEvento = new Date(evento.fecha);
          const esCompleto = evento.inscritos >= evento.cupos;
          
          // Imágenes para cada evento
          const imagenesEventos = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1518796745430-c6d5ac5cc2bf?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&h=400&fit=crop&crop=center'
          ];
          
          return (
            <div 
              key={evento.id} 
              className={`evento-modern-card ${estaSeleccionado ? 'selected' : ''} ${estaInscrito ? 'inscrito' : ''}`}
              onClick={() => handleEventoSelect(evento)}
            >
              {/* Imagen de fondo del evento */}
              <div className="evento-image-container">
                <div 
                  className="evento-image"
                  style={{
                    backgroundImage: `url(${evento.imagen || imagenesEventos[index % imagenesEventos.length]})`
                  }}
                >
                  {/* Badge de categoría */}
                  <div className="evento-category-badge">
                    {evento.categoria}
                  </div>
                  
                  {/* Badge de fecha */}
                  <div className="evento-date-badge">
                    <span className="date-day">{fechaEvento.getDate()}</span>
                    <span className="date-month">
                      {fechaEvento.toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del evento */}
              <div className="evento-content">
                {/* Información de tiempo y ubicación */}
                <div className="evento-meta">
                  <div className="evento-time">
                    <Clock size={16} />
                    <span>{evento.hora} - {evento.duracion}</span>
                  </div>
                  <div className="evento-location">
                    <MapPin size={16} />
                    <span>{evento.ubicacion}</span>
                  </div>
                </div>

                {/* Título y descripción */}
                <h3 className="evento-title">{evento.titulo}</h3>
                <p className="evento-description">
                  {evento.descripcion.length > 120 
                    ? `${evento.descripcion.substring(0, 120)}...`
                    : evento.descripcion
                  }
                </p>

                {/* Footer con precio y botón */}
                <div className="evento-footer">
                  <span className="evento-price">Price: {evento.precio}</span>
                  <button 
                    className={`evento-action-button ${estaInscrito ? 'inscrito' : ''} ${esCompleto ? 'completo' : ''}`}
                    onClick={() => onEventoClick(evento)}
                    disabled={esCompleto && !estaInscrito}
                  >
                    {estaInscrito ? 'Inscrito' : esCompleto ? 'Completo' : 'Tickets & Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {eventosFiltrados.length === 0 && (
        <div className="eventos-empty-state">
          <Calendar size={64} />
          <h3>No se encontraron eventos</h3>
          <p>Intenta ajustar tus filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default EventosModernos;