import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  VideoOff,
  Wifi,
  WifiOff,
  Download,
  FileText,
  Star
} from 'lucide-react';
import { format, parseISO, isBefore, isAfter, addMinutes, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import './MisReservas.css';

const MisReservas = ({ user }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proximas');
  const navigate = useNavigate();

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
    } finally {
      setLoading(false);
    }
  };

  const getReservasPorEstado = () => {
    const now = new Date();
    
    if (activeTab === 'proximas') {
      return reservas.filter(r => {
        const reservaDateTime = parseISO(`${r.booking_date}T${r.start_time}`);
        return isAfter(reservaDateTime, now) && ['confirmed', 'pending'].includes(r.status);
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

  const getSessionStatus = (reserva) => {
    const now = new Date();
    const reservaDateTime = parseISO(`${reserva.booking_date}T${reserva.start_time}`);
    const fifteenMinutesBefore = addMinutes(reservaDateTime, -120);
    const sessionEnd = addMinutes(reservaDateTime, reserva.duration);
    const minutesUntilStart = differenceInMinutes(reservaDateTime, now);

    if (isBefore(now, fifteenMinutesBefore)) {
      return {
        canJoin: false,
        status: 'upcoming',
        message: `Disponible en ${minutesUntilStart} minutos`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: Clock
      };
    } else if (isAfter(now, fifteenMinutesBefore) && isBefore(now, sessionEnd)) {
      return {
        canJoin: true,
        status: 'ready',
        message: '¡Sesión disponible ahora!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: Wifi
      };
    } else {
      return {
        canJoin: false,
        status: 'ended',
        message: 'Sesión finalizada',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: WifiOff
      };
    }
  };

  const handleJoinVideoCall = (reserva) => {
    navigate(`/videollamada/${reserva.id}`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header Superior */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mis Reservas
              </h2>
              <p className="text-xs text-gray-500">Gestiona tus sesiones angelicales</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
        </div>
      </div>
      
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center">
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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {reservasFiltradas.map((reserva) => {
              const sessionStatus = activeTab === 'proximas' ? getSessionStatus(reserva) : null;
              
              return (
                <div
                  key={reserva.id}
                  className="w-full border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-purple-50"
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

                  {/* Estado de la sesión */}
                  {activeTab === 'proximas' && sessionStatus && (
                    <div className={`mt-4 p-3 rounded-lg ${sessionStatus.bgColor} flex items-center space-x-2`}>
                      <sessionStatus.icon className={`w-5 h-5 ${sessionStatus.color}`} />
                      <span className={`font-semibold ${sessionStatus.color}`}>
                        {sessionStatus.message}
                      </span>
                    </div>
                  )}

                  {/* Botón de videollamada - Estilo Teams/Zoom */}
                  {activeTab === 'proximas' && sessionStatus?.canJoin && (reserva.status === 'confirmed' || reserva.status === 'pending') && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => handleJoinVideoCall(reserva)}
                        className="video-call-button-teams w-full group"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <div className="video-icon-container">
                            <Video className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-lg font-bold">Iniciar Sesión en Vivo</span>
                            <span className="text-xs opacity-90">Videollamada segura y encriptada</span>
                          </div>
                        </div>
                        <div className="pulse-indicator"></div>
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 bg-white border-2 border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Preparar Notas</span>
                        </button>
                        <button
                          className="flex-1 bg-white border-2 border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar Info</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Botones para sesiones pasadas */}
                  {activeTab === 'pasadas' && (
                    <div className="mt-4 space-y-2">
                      <button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Descargar Grabación</span>
                      </button>
                      
                      <button
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center space-x-2"
                      >
                        <FileText className="w-5 h-5" />
                        <span>Descargar Transcripción (PDF)</span>
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 bg-white border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ver Notas</span>
                        </button>
                        <button
                          className="flex-1 bg-white border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                        >
                          <Star className="w-4 h-4" />
                          <span>Calificar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MisReservas;

