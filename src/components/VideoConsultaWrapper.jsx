import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import VideoConsultaJitsiEnhanced from './VideoConsultaJitsiEnhanced';
import { Loader2 } from 'lucide-react';

const VideoConsultaWrapper = ({ user, onSalir }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reserva, setReserva] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReserva();
  }, [id]);

  const loadReserva = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de la reserva
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (bookingError) throw bookingError;

      if (!bookingData) {
        setError('Reserva no encontrada');
        return;
      }

      // Verificar que el usuario tiene acceso
      if (bookingData.user_id !== user?.id) {
        setError('No tienes permiso para acceder a esta consulta');
        return;
      }

      // Verificar que la reserva está confirmada o pendiente
      if (bookingData.status !== 'confirmed' && bookingData.status !== 'pending') {
        setError('Esta reserva no está disponible para videollamada');
        return;
      }

      setReserva(bookingData);
    } catch (error) {
      console.error('Error cargando reserva:', error);
      setError('Error al cargar la consulta');
    } finally {
      setLoading(false);
    }
  };

  const handleSalir = () => {
    if (onSalir) {
      onSalir();
    } else {
      navigate('/mis-reservas');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando consulta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center bg-white rounded-lg p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleSalir}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Volver a Mis Reservas
          </button>
        </div>
      </div>
    );
  }

  if (!reserva) {
    return null;
  }

  // Generar nombre de sala único
  const roomName = `consulta-${reserva.id}-${reserva.booking_date}`;
  
  // Nombre para mostrar
  const displayName = user?.user_metadata?.full_name || user?.email || 'Usuario';

  // Información del angelólogo (por ahora mock, luego cargar de BD)
  const angelologo = {
    nombre: 'Angelólogo Certificado',
    especialidad: 'Consultas Angelicales',
    descripcion: 'Experto en conexión angelical y guía espiritual',
    foto: null
  };

  return (
    <VideoConsultaJitsiEnhanced
      consultaId={reserva.id}
      roomName={roomName}
      displayName={displayName}
      angelologo={angelologo}
      duracionMinutos={reserva.duration || 60}
      onSalir={handleSalir}
      user={user}
      reserva={reserva}
    />
  );
};

export default VideoConsultaWrapper;

