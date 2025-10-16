import React from 'react';
import { X, Clock, MapPin, User, Calendar } from 'lucide-react';
import './DayEventsModal.css';

const DayEventsModal = ({ date, events, onClose, onEventClick }) => {
  if (!date || events.length === 0) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="day-events-modal-overlay" onClick={onClose}>
      <div className="day-events-modal" onClick={(e) => e.stopPropagation()}>
        <div className="day-events-modal-header">
          <div>
            <h2 className="day-events-modal-title">Eventos del día</h2>
            <p className="day-events-modal-date">{formatDate(date)}</p>
          </div>
          <button className="day-events-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="day-events-modal-content">
          {events.map((evento) => (
            <div 
              key={evento.id} 
              className="day-event-card"
              onClick={() => onEventClick && onEventClick(evento)}
            >
              <div className="day-event-card-header">
                <h3 className="day-event-title">{evento.titulo}</h3>
                <span className="day-event-price">{evento.precio}</span>
              </div>

              <p className="day-event-description">{evento.descripcion}</p>

              <div className="day-event-details">
                <div className="day-event-detail">
                  <Clock size={16} />
                  <span>{evento.hora} - {evento.duracion}</span>
                </div>
                <div className="day-event-detail">
                  <MapPin size={16} />
                  <span>{evento.ubicacion}</span>
                </div>
                <div className="day-event-detail">
                  <User size={16} />
                  <span>{evento.instructor}</span>
                </div>
              </div>

              <div className="day-event-footer">
                <div className="day-event-capacity">
                  <span>{evento.inscritos} / {evento.cupos} inscritos</span>
                </div>
                <button 
                  className="day-event-btn"
                  disabled={evento.inscritos >= evento.cupos}
                >
                  {evento.inscritos >= evento.cupos ? 'Completo' : 'Ver detalles'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayEventsModal;

