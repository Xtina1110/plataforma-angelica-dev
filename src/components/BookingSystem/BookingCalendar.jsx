import React, { useState } from 'react';
import { Calendar, Clock, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, isSameDay, isToday, isBefore, addMonths, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLanguage } from '../../hooks/useLanguage';

const BookingCalendar = ({
  selectedService,
  therapists,
  availableSlots,
  selectedTherapist,
  selectedDate,
  selectedTime,
  onSelectTherapist,
  onSelectDate,
  onSelectTime,
  onConfirmBooking
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { t } = useLanguage();

  const availableTherapists = therapists || [];

  // Generar calendario mensual completo estilo Windows
  const getMonthDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startWeek = startOfWeek(start, { weekStartsOn: 1 }); // Lunes como primer día

    const days = [];
    let day = startWeek;

    // Generar exactamente 42 días (6 semanas) para mantener grid consistente
    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const monthDays = getMonthDays();

  const navigateMonth = (direction) => {
    const newMonth = addMonths(currentMonth, direction);
    // Solo permitir navegar al futuro, no al pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstOfNewMonth = startOfMonth(newMonth);
    
    if (direction < 0 && firstOfNewMonth < startOfMonth(today)) {
      return; // No permitir navegar a meses pasados
    }
    
    setCurrentMonth(newMonth);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isDateAvailable = (date) => {
    // Verificar si es domingo (no disponible)
    if (date.getDay() === 0) return false;
    
    // Verificar si está en el pasado (pero no incluir hoy)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) return false;
    
    // Aquí podrías agregar lógica adicional para verificar disponibilidad real
    return true;
  };

  const isTimeSlotInPast = (slotTime) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const [hours, minutes] = slotTime.split(':').map(Number);
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    // Si es hoy, comparar con la hora actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(selectedDate);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === today.getTime()) {
      // Es hoy, verificar si la hora ya pasó
      return slotDateTime <= now;
    }
    
    // Si no es hoy, no está en el pasado
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Selección de terapeuta */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Seleccionar Terapeuta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableTherapists.map((therapist) => (
            <div
              key={therapist.id}
              onClick={() => onSelectTherapist(therapist)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedTherapist?.id === therapist.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{therapist.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Terapeuta certificado</p>
                </div>
              </div>
              {therapist.bio && (
                <p className="text-xs text-gray-600 mt-3 line-clamp-2">{therapist.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selección de fecha */}
      {selectedTherapist && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Seleccionar Fecha
          </h3>

          {/* Navegación de mes */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              disabled={isSameMonth(currentMonth, new Date())}
              className={`flex items-center gap-2 px-4 py-2 bg-white border-2 rounded-lg transition-all ${
                isSameMonth(currentMonth, new Date())
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <h3 className="font-semibold text-gray-900 text-lg capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h3>

            <button
              onClick={() => navigateMonth(1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Encabezado de días de la semana - Estilo Windows */}
          <div className="grid grid-cols-7 gap-0 mb-1 border-b border-gray-200 pb-2">
            {t.calendar.weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes - Estilo Windows */}
          <div className="grid grid-cols-7 gap-0">
            {monthDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isPast = isDateDisabled(date);
              const isAvailable = isDateAvailable(date);
              const isSelected = selectedDate === format(date, 'yyyy-MM-dd');
              const isTodayDate = isToday(date);
              const isSunday = date.getDay() === 0;

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => isAvailable && isCurrentMonth && onSelectDate(format(date, 'yyyy-MM-dd'))}
                  disabled={!isAvailable || !isCurrentMonth}
                  className={`
                    relative p-3 min-h-[48px] text-center transition-all duration-150
                    ${!isCurrentMonth ? 'text-gray-300 bg-white cursor-default' : ''}
                    ${isCurrentMonth && isPast ? 'bg-white text-gray-400 cursor-not-allowed' : ''}
                    ${isCurrentMonth && !isPast && isSunday ? 'bg-white text-gray-400 cursor-not-allowed' : ''}
                    ${isCurrentMonth && isAvailable && !isSelected && !isTodayDate ? 'bg-white text-gray-900 hover:bg-gray-50 cursor-pointer' : ''}
                    ${isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md font-semibold' : ''}
                    ${isTodayDate && !isSelected && isAvailable ? 'bg-blue-500 text-white font-semibold hover:bg-blue-600' : ''}
                    border-r border-b border-gray-100
                  `}
                >
                  <div className="text-sm">
                    {format(date, 'd')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selección de hora */}
      {selectedTherapist && selectedDate && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Seleccionar Hora
          </h3>

          {availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
              <p className="text-sm text-gray-500 mt-2">
                Por favor selecciona otra fecha
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {availableSlots.map((slot) => {
                const isSlotInPast = isTimeSlotInPast(slot.time);
                return (
                  <button
                    key={slot.time}
                    onClick={() => !isSlotInPast && onSelectTime(slot.time)}
                    disabled={isSlotInPast}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      isSlotInPast
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                        : selectedTime === slot.time
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {formatTime(slot.time)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Resumen y confirmación */}
      {selectedService && selectedTherapist && selectedDate && selectedTime && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Resumen de tu Reserva</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Servicio</h4>
                <p className="text-gray-700">{selectedService.name}</p>
                <p className="text-sm text-gray-500">{selectedService.duration} minutos</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Terapeuta</h4>
                <p className="text-gray-700">{selectedTherapist.name}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Fecha y Hora</h4>
                <p className="text-gray-700">
                  {format(new Date(selectedDate), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-gray-700">{formatTime(selectedTime)}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Precio Total</h4>
                <p className="text-2xl font-bold text-blue-600">${selectedService.price}</p>
              </div>
            </div>

            <button
              onClick={onConfirmBooking}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
