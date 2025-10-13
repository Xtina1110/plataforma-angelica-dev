import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Calendar, Clock, User as UserIcon, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, parseISO, isBefore, isAfter, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '../hooks/use-toast';

const MisReservas = ({ user }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proximas'); // 'proximas', 'pasadas', 'canceladas'
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadReservas();
    }
  }, [user]);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;

      setReservas(data || []);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getReservasPorEstado = () => {
    const now = new Date();
    
    if (activeTab === 'proximas') {
      return reservas.filter(r => {
        const reservaDateTime = parseISO(`${r.booking_date}T${r.start_time}`);
        return isAfter(reservaDateTime, now) && r.status === 'confirmed';
      });
    } else if (activeTab === 'pasadas') {
      return reservas.filter(r => {
        const reservaDateTime = parseISO(`${r.booking_date}T${r.start_time}`);
        return isBefore(reservaDateTime, now) && r.status === 'confirmed';
      });
    } else {
      return reservas.filter(r => r.status === 'cancelled');
    }
  };

  const canJoinVideoCall = (reserva) => {
    const now = new Date();
    const reservaDateTime = parseISO(`${reserva.booking_date}T${reserva.start_time}`);
    const fifteenMinutesBefore = addMinutes(reservaDateTime, -15);
    const sessionEnd = addMinutes(reservaDateTime, reserva.duration);

    return isAfter(now, fifteenMinutesBefore) && isBefore(now, sessionEnd);
  };

  const handleJoinVideoCall = (reserva) => {
    // Navegar a la sala de videollamada
    window.location.href = `/videollamada/${reserva.id}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const reservasFiltradas = getReservasPorEstado();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Mis Reservas
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab('proximas')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'proximas'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Próximas
          </button>
          <button
            onClick={() => setActiveTab('pasadas')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'pasadas'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pasadas
          </button>
          <button
            onClick={() => setActiveTab('canceladas')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'canceladas'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Canceladas
          </button>
        </div>

        {/* Lista de reservas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reservas...</p>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tienes reservas {activeTab}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservasFiltradas.map((reserva) => (
              <div
                key={reserva.id}
                className="border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-purple-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(reserva.status)}
                    <span className="font-semibold text-gray-700">
                      {getStatusText(reserva.status)}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    ${reserva.total_price}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span>
                      {format(parseISO(reserva.booking_date), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span>{reserva.start_time} - {reserva.end_time}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700">
                    <UserIcon className="w-5 h-5 text-purple-500" />
                    <span>Duración: {reserva.duration} minutos</span>
                  </div>
                </div>

                {reserva.notes && (
                  <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                    <p className="text-sm text-gray-700">{reserva.notes}</p>
                  </div>
                )}

                {/* Botón de videollamada */}
                {activeTab === 'proximas' && canJoinVideoCall(reserva) && (
                  <button
                    onClick={() => handleJoinVideoCall(reserva)}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Video className="w-5 h-5" />
                    <span>Iniciar Sesión en Vivo</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisReservas;
