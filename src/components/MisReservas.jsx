import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, Video, FileText, Download, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MisReservas.css';

export default function MisReservas({ user, hideHeader = false }) {
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
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error('Error loading reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getSessionStatus = (reserva) => {
    const now = new Date();
    const bookingDateTime = new Date(`${reserva.booking_date}T${reserva.start_time}`);
    const minutesUntilSession = differenceInMinutes(bookingDateTime, now);

    // Permitir acceso 2 horas antes (120 minutos)
    if (minutesUntilSession <= 120 && minutesUntilSession >= -60) {
      return {
        canJoin: true,
        message: '¡Sesión disponible ahora!',
        color: 'text-green-600 bg-green-50',
        minutesUntil: minutesUntilSession
      };
    } else if (minutesUntilSession > 120) {
      return {
        canJoin: false,
        message: `Disponible en ${minutesUntilSession} minutos`,
        color: 'text-blue-600 bg-blue-50',
        minutesUntil: minutesUntilSession
      };
    } else {
      return {
        canJoin: false,
        message: 'Sesión finalizada',
        color: 'text-gray-600 bg-gray-50',
        minutesUntil: minutesUntilSession
      };
    }
  };

  const getReservasPorEstado = () => {
    const now = new Date();
    
    return reservas.filter(reserva => {
      const bookingDateTime = new Date(`${reserva.booking_date}T${reserva.end_time}`);
      const isPast = bookingDateTime < now;
      
      if (activeTab === 'proximas') {
        return !isPast && reserva.status !== 'cancelled';
      } else if (activeTab === 'pasadas') {
        return isPast && reserva.status !== 'cancelled';
      } else if (activeTab === 'canceladas') {
        return reserva.status === 'cancelled';
      }
      return false;
    });
  };

  const handleJoinSession = (reservaId) => {
    navigate(`/videollamada/${reservaId}`);
  };

  const handleDownloadRecording = async (reservaId) => {
    // TODO: Implementar descarga de grabación
    alert(`Descargando grabación de la reserva ${reservaId}...`);
    console.log('Download recording:', reservaId);
  };

  const handleDownloadTranscription = async (reservaId) => {
    // TODO: Implementar descarga de transcripción
    alert(`Descargando transcripción de la reserva ${reservaId}...`);
    console.log('Download transcription:', reservaId);
  };

  const handleViewNotes = (reservaId) => {
    // TODO: Implementar visualización de notas
    alert(`Viendo notas de la reserva ${reservaId}...`);
    console.log('View notes:', reservaId);
  };

  const handleRate = (reservaId) => {
    // TODO: Implementar sistema de calificación
    alert(`Calificando la reserva ${reservaId}...`);
    console.log('Rate booking:', reservaId);
  };

  const handlePrepareNotes = (reservaId) => {
    // TODO: Implementar preparación de notas
    alert(`Preparando notas para la reserva ${reservaId}...`);
    console.log('Prepare notes:', reservaId);
  };

  const handleDownloadInfo = (reservaId) => {
    // TODO: Implementar descarga de información
    alert(`Descargando información de la reserva ${reservaId}...`);
    console.log('Download info:', reservaId);
  };

  const reservasFiltradas = getReservasPorEstado();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className={hideHeader ? "" : "min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"}>
      {/* Header Superior */}
      {!hideHeader && (
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
      )}
      
      {/* Contenido Principal */}
      <div className="w-full px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setActiveTab('proximas')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'proximas'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Próximas
              {reservas.filter(r => {
                const bookingDateTime = new Date(`${r.booking_date}T${r.end_time}`);
                return bookingDateTime >= new Date() && r.status !== 'cancelled';
              }).length > 0 && (
                <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  {reservas.filter(r => {
                    const bookingDateTime = new Date(`${r.booking_date}T${r.end_time}`);
                    return bookingDateTime >= new Date() && r.status !== 'cancelled';
                  }).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pasadas')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'pasadas'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pasadas
              {reservas.filter(r => {
                const bookingDateTime = new Date(`${r.booking_date}T${r.end_time}`);
                return bookingDateTime < new Date() && r.status !== 'cancelled';
              }).length > 0 && (
                <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  {reservas.filter(r => {
                    const bookingDateTime = new Date(`${r.booking_date}T${r.end_time}`);
                    return bookingDateTime < new Date() && r.status !== 'cancelled';
                  }).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('canceladas')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'canceladas'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Canceladas
              {reservas.filter(r => r.status === 'cancelled').length > 0 && (
                <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  {reservas.filter(r => r.status === 'cancelled').length}
                </span>
              )}
            </button>
          </div>

          {/* Lista de Reservas */}
          {reservasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No tienes reservas {activeTab}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        <User className="w-5 h-5 text-purple-500" />
                        <span>Duración: {reserva.duration} minutos</span>
                      </div>

                      <div className="bg-purple-100 p-3 rounded-lg mt-4">
                        <p className="text-sm text-gray-700">
                          Tipo: {reserva.booking_type}, Terapeuta: {reserva.therapist_name}
                        </p>
                      </div>
                    </div>

                    {/* Status badge y botones para próximas */}
                    {sessionStatus && sessionStatus.canJoin && (
                      <div className="mt-4">
                        <div className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg mb-3 ${sessionStatus.color}`}>
                          <Video className="w-4 h-4" />
                          <span className="font-semibold text-sm">{sessionStatus.message}</span>
                        </div>
                        
                        <button
                          onClick={() => handleJoinSession(reserva.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center space-x-3 video-call-button-teams"
                        >
                          <div className="video-icon-container">
                            <Video className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-lg font-bold">Iniciar Sesión en Vivo</span>
                            <span className="text-xs opacity-90">Videollamada segura y encriptada</span>
                          </div>
                          <div className="pulse-indicator"></div>
                        </button>

                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handlePrepareNotes(reserva.id)}
                            className="flex-1 bg-white border-2 border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Preparar Notas</span>
                          </button>
                          <button
                            onClick={() => handleDownloadInfo(reserva.id)}
                            className="flex-1 bg-white border-2 border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            <span>Descargar Info</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mostrar tiempo restante si no está disponible */}
                    {sessionStatus && !sessionStatus.canJoin && sessionStatus.minutesUntil > 0 && (
                      <div className={`mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${sessionStatus.color}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold text-sm">{sessionStatus.message}</span>
                      </div>
                    )}

                    {/* Botones para sesiones pasadas */}
                    {activeTab === 'pasadas' && (
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => handleDownloadRecording(reserva.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center space-x-2"
                        >
                          <Download className="w-5 h-5" />
                          <span>Descargar Grabación</span>
                        </button>
                        
                        <button
                          onClick={() => handleDownloadTranscription(reserva.id)}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center space-x-2"
                        >
                          <FileText className="w-5 h-5" />
                          <span>Descargar Transcripción (PDF)</span>
                        </button>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewNotes(reserva.id)}
                            className="flex-1 bg-white border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Ver Notas</span>
                          </button>
                          <button
                            onClick={() => handleRate(reserva.id)}
                            className="flex-1 bg-white border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                          >
                            <Star className="w-4 h-4" />
                            <span>Calificar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Botones para sesiones canceladas - mismo formato que pasadas */}
                    {activeTab === 'canceladas' && (
                      <div className="mt-4 space-y-2">
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                          <p className="text-red-700 font-semibold">Sesión Cancelada</p>
                          <p className="text-sm text-red-600 mt-1">
                            Esta reserva fue cancelada y no está disponible
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleViewNotes(reserva.id)}
                          className="w-full bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ver Detalles</span>
                        </button>
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

