import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import supabase from '../../services/supabaseClient';
import './OnlineConsultation.css';

const ConsultationBookingCalendar = ({ selectedTheme, selectedReader, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardSpreadType, setCardSpreadType] = useState('3');
  const [includeRecording, setIncludeRecording] = useState(false);
  const [notes, setNotes] = useState('');
  const [userTimezone, setUserTimezone] = useState('');

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  useEffect(() => {
    if (selectedDate && selectedReader) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedReader]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
      const readerHours = selectedReader.available_hours?.[dayOfWeek] || [];

      const { data: existingBookings } = await supabase
        .from('consultation_bookings')
        .select('scheduled_at, duration_minutes')
        .eq('reader_id', selectedReader.id)
        .gte('scheduled_at', selectedDate.toISOString().split('T')[0])
        .lt('scheduled_at', new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .eq('status', 'confirmed');

      const bookedTimes = existingBookings?.map(b => new Date(b.scheduled_at).getHours()) || [];
      const available = readerHours.filter(hour => !bookedTimes.includes(hour));

      setAvailableSlots(available);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    let total = selectedReader.hourly_rate || 200;

    if (selectedTheme !== 'general') {
      total += 25;
    }

    if (includeRecording) {
      total += 30;
    }

    return total;
  };

  const handleCreateBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y hora');
      return;
    }

    setLoading(true);
    try {
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(selectedTime, 0, 0, 0);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Debes iniciar sesión para reservar');
        return;
      }

      const bookingData = {
        user_id: user.id,
        reader_id: selectedReader.id,
        scheduled_at: scheduledDateTime.toISOString(),
        duration_minutes: 60,
        theme: selectedTheme,
        card_spread_type: cardSpreadType,
        status: 'pending',
        total_amount: calculateTotalAmount(),
        payment_status: 'pending',
        timezone: userTimezone,
        notes: notes
      };

      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      alert('¡Reserva creada exitosamente! Procede al pago para confirmar.');
      onBookingComplete(data);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error al crear la reserva: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNextDays = (days = 14) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Card className="border-2" style={{ borderColor: '#d4af37', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Agenda tu Consulta Angelical en Vivo
          </CardTitle>
          <CardDescription>
            Sesión base de 60 minutos con {selectedReader.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Selecciona una fecha
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                {getNextDays().map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`booking-date-button ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''}`}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                      {date.getDate()}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {date.toLocaleDateString('es-ES', { month: 'short' })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horarios disponibles
                </h3>
                {loading ? (
                  <p>Cargando horarios...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-gray-500">No hay horarios disponibles para esta fecha</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                    {availableSlots.map((hour) => (
                      <button
                        key={hour}
                        onClick={() => setSelectedTime(hour)}
                        className={`booking-time-button ${selectedTime === hour ? 'selected' : ''}`}
                      >
                        {hour}:00
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Tipo de Apertura Angelical
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { value: '3', label: '3 Cartas', desc: 'Respuesta rápida' },
                  { value: '6', label: '6 Cartas', desc: 'Análisis profundo' },
                  { value: '9', label: '9 Cartas', desc: 'Visión completa' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCardSpreadType(type.value)}
                    className={`card-spread-button ${cardSpreadType === type.value ? 'selected' : ''}`}
                  >
                    <div style={{ fontWeight: '700', fontSize: '1.125rem' }}>{type.label}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeRecording}
                  onChange={(e) => setIncludeRecording(e.target.checked)}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span>Incluir grabación HD de la sesión (+$30 USD)</span>
              </label>
            </div>

            <div>
              <label className="font-semibold mb-2 block">Notas adicionales (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comparte cualquier información que ayude al lector a preparar tu sesión..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div className="booking-summary">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Resumen de Inversión
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sesión base (60 min)</span>
                  <span className="font-semibold">${selectedReader.hourly_rate || 200} USD</span>
                </div>
                {selectedTheme !== 'general' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tema especializado</span>
                    <span className="font-semibold">+$25 USD</span>
                  </div>
                )}
                {includeRecording && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Grabación HD</span>
                    <span className="font-semibold">+$30 USD</span>
                  </div>
                )}
                <div style={{
                  borderTop: '2px solid #d4af37',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}>
                  <span>Total</span>
                  <span>${calculateTotalAmount()} USD</span>
                </div>
              </div>

              <button
                onClick={handleCreateBooking}
                disabled={!selectedDate || !selectedTime || loading}
                className="consulta-confirm-button"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva y Proceder al Pago'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationBookingCalendar;
