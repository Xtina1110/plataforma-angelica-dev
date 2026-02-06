import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, ShoppingCart, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './FunctionalEventCalendar.css';
import './EventFlipCard.css';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const FunctionalEventCalendar = ({ onAddToCart }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addedToCart, setAddedToCart] = useState(new Set());

  // Cargar eventos desde Supabase
  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  // Filtrar eventos por fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const eventsForDay = events.filter(event => 
        event.fecha.startsWith(dateString)
      );
      setFilteredEvents(eventsForDay);
    } else {
      setFilteredEvents(events);
    }
  }, [selectedDate, events]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .gte('fecha', startOfMonth.toISOString())
        .lte('fecha', endOfMonth.toISOString())
        .order('fecha', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior (para completar la primera semana)
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        hasEvents: false
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = events.some(event => event.fecha.startsWith(dateString));
      
      days.push({
        date,
        isCurrentMonth: true,
        hasEvents,
        isToday: isToday(date)
      });
    }

    // Días del mes siguiente (para completar la última semana)
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        hasEvents: false
      });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    if (!day.isCurrentMonth) return;
    setSelectedDate(day.date);
  };

  const handleAddToCart = (event) => {
    if (addedToCart.has(event.id)) {
      toast.success('Este evento ya está en tu carrito');
      return;
    }

    const cartItem = {
      id: event.id,
      tipo: 'evento',
      nombre: event.titulo,
      precio: event.precio || 0,
      fecha: event.fecha,
      hora: event.hora,
      imagen: event.imagen,
      descripcion: event.descripcion
    };

    if (onAddToCart) {
      onAddToCart(cartItem);
    }

    setAddedToCart(new Set([...addedToCart, event.id]));
    toast.success(`${event.titulo} añadido al carrito`);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  const days = getDaysInMonth();

  return (
    <div className="functional-event-calendar">
      <div className="calendar-container">
        {/* Header del calendario */}
        <div className="calendar-header">
          <button className="month-nav-btn" onClick={handlePrevMonth}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="calendar-title">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button className="month-nav-btn" onClick={handleNextMonth}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="calendar-weekdays">
          {WEEKDAYS.map(day => (
            <div key={day} className="weekday-label">{day}</div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="calendar-grid">
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.hasEvents ? 'has-events' : ''} ${selectedDate && day.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{day.date.getDate()}</span>
              {day.hasEvents && <span className="event-indicator">●</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="events-list-container">
        <h3 className="events-list-title">
          {selectedDate 
            ? `Eventos del ${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`
            : 'Próximos Eventos'}
        </h3>

        {loading ? (
          <div className="events-loading">
            <Calendar className="loading-icon" />
            <p>Cargando eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-events">
            <Calendar size={48} />
            <p>No hay eventos para esta fecha</p>
          </div>
        ) : (
          <div className="events-list">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-flip-container ${selectedEvent?.id === event.id ? 'flipped' : ''}`}
                onClick={() => handleEventClick(event)}
              >
                <div className="event-flip-card">
                  {/* FRENTE: Imagen + Fecha + Precio */}
                  <div className="event-card-front">
                    {event.imagen && (
                      <div className="event-image-full">
                        <img src={event.imagen_url || event.imagen} alt={event.titulo} />
                        
                        {/* Badge de fecha */}
                        <div className="event-date-badge">
                          <div className="date-day">{new Date(event.fecha).getDate()}</div>
                          <div className="date-month">
                            {new Date(event.fecha).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                          </div>
                        </div>

                        {/* Badge de precio */}
                        {event.precio > 0 && (
                          <div className="event-price-badge">
                            ${event.precio}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="event-front-title">
                      <h4>{event.titulo}</h4>
                      <span className="click-hint">Click para ver detalles</span>
                    </div>
                  </div>

                  {/* REVERSO: Información completa */}
                  <div className="event-card-back">
                    <h4 className="event-title-back">{event.titulo}</h4>

                    <div className="event-meta-back">
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>{event.hora || '19:00'} - {event.duracion || '90 min'}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{event.es_online ? `Online - ${event.plataforma || 'Zoom'}` : (event.ubicacion || 'Centro Angelical Madrid')}</span>
                      </div>
                      {event.facilitador && (
                        <div className="meta-item">
                          <Users size={16} />
                          <span>{event.facilitador}</span>
                        </div>
                      )}
                    </div>

                    <p className="event-description-back">
                      {event.descripcion || 'Sesión de meditación guiada para conectar con la energía de los arcángeles'}
                    </p>

                    <div className="event-actions-back">
                      {event.precio > 0 ? (
                        <button 
                          className={`add-to-cart-btn ${addedToCart.has(event.id) ? 'added' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(event);
                          }}
                        >
                          {addedToCart.has(event.id) ? (
                            <>
                              <Check size={18} />
                              Añadido
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={18} />
                              Añadir al Carrito
                            </>
                          )}
                        </button>
                      ) : (
                        <button className="inscribe-btn">
                          Inscribirse Gratis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionalEventCalendar;

