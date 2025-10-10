import { useState } from 'react';
import { ArrowLeft, Video, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import ReaderSelector from './ReaderSelector';
import ConsultationBookingCalendar from './ConsultationBookingCalendar';
import { Card } from '../ui/card';
import { AperturaAngelicaHeader } from '../headers';
import AppSidebar from '../AppSidebar';
import '../Dashboard.css';
import './OnlineConsultation.css';

const OnlineConsultationSystem = ({ onBack, user, onLogout }) => {
  const [step, setStep] = useState('theme');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);
  const [booking, setBooking] = useState(null);

  const themes = [
    {
      id: 'general',
      nombre: 'General',
      descripcion: 'Visión integral de la vida',
      icono: '🌟',
      color: '#d4af37'
    },
    {
      id: 'amor',
      nombre: 'Amor y Relaciones',
      descripcion: 'Conexiones del corazón',
      icono: '💕',
      color: '#ec4899'
    },
    {
      id: 'trabajo',
      nombre: 'Trabajo y Abundancia',
      descripcion: 'Prosperidad y carrera',
      icono: '💰',
      color: '#10b981'
    },
    {
      id: 'salud',
      nombre: 'Salud y Bienestar',
      descripcion: 'Sanación física y emocional',
      icono: '🌿',
      color: '#3b82f6'
    },
    {
      id: 'proposito',
      nombre: 'Propósito y Misión de Vida',
      descripcion: 'Llamado divino',
      icono: '🎯',
      color: '#8b5cf6'
    },
    {
      id: 'crecimiento',
      nombre: 'Crecimiento Espiritual',
      descripcion: 'Evolución del alma',
      icono: '🧘',
      color: '#7c3aed'
    }
  ];

  const steps = [
    { id: 'theme', name: 'Tema', icon: Sparkles },
    { id: 'reader', name: 'Angelólogo', icon: Video },
    { id: 'booking', name: 'Reserva', icon: Calendar },
    { id: 'confirmation', name: 'Confirmación', icon: CheckCircle }
  ];

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setStep('reader');
  };

  const handleReaderSelect = (reader) => {
    setSelectedReader(reader);
    setStep('booking');
  };

  const handleBookingComplete = (bookingData) => {
    setBooking(bookingData);
    setStep('confirmation');
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />
      <main className="main-content consulta-container">
        <AperturaAngelicaHeader 
          user={user}
          onLogout={onLogout}
        />
        
        <div className="consulta-inner">
          <div className="consulta-header">
            <button onClick={onBack} className="consulta-back-button">
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>

            <h1 className="consulta-title">
              Consultas Angelicales en Vivo
            </h1>
          </div>

        <div className="consulta-steps">
          {steps.map((s, idx) => {
            const isActive = s.id === step;
            const isCompleted = steps.findIndex(st => st.id === step) > idx;
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className={`consulta-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{s.name}</span>
              </div>
            );
          })}
        </div>

        {step === 'theme' && (
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Selecciona el Tema de tu Consulta
            </h2>

            <div className="tema-grid">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className="tema-card-consulta"
                >
                  <div className="tema-icono">
                    {theme.icono}
                  </div>
                  <h3 className="tema-nombre" style={{ color: theme.color }}>
                    {theme.nombre}
                  </h3>
                  <p className="tema-descripcion">
                    {theme.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'reader' && selectedTheme && (
          <ReaderSelector
            selectedTheme={selectedTheme.id}
            onReaderSelected={handleReaderSelect}
          />
        )}

        {step === 'booking' && selectedReader && (
          <ConsultationBookingCalendar
            selectedTheme={selectedTheme.id}
            selectedReader={selectedReader}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {step === 'confirmation' && booking && (
          <Card className="border-2" style={{ borderColor: '#d4af37', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)', padding: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#10b981' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
                ¡Reserva Creada Exitosamente!
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Tu consulta angelical ha sido programada. Recibirás un correo con los detalles y el enlace para unirte a la sesión.
              </p>

              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(245, 158, 11, 0.1))',
                padding: '2rem',
                borderRadius: '12px',
                border: '2px solid #d4af37',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Detalles de la Reserva:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p><strong>ID de Reserva:</strong> {booking.id}</p>
                  <p><strong>Tema:</strong> {selectedTheme.nombre}</p>
                  <p><strong>Angelólogo:</strong> {selectedReader.name}</p>
                  <p><strong>Fecha:</strong> {new Date(booking.scheduled_at).toLocaleString('es-ES')}</p>
                  <p><strong>Duración:</strong> {booking.duration_minutes} minutos</p>
                  <p><strong>Total:</strong> ${booking.total_amount} USD</p>
                  <p><strong>Estado:</strong> Pendiente de pago</p>
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.href = `/payment/${booking.id}`;
                }}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(to right, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                Proceder al Pago
              </button>

              <button
                onClick={onBack}
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  color: '#374151',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Volver al Dashboard
              </button>
            </div>
          </Card>
        )}
        </div>
      </main>
    </div>
  );
};

export default OnlineConsultationSystem;
