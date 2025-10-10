import React, { useState } from 'react';
import { Calendar, Clock, User, DollarSign, AlertCircle, CheckCircle, XCircle, Plus, Video } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import AngelicalModal from '../AngelicalModal';

const UserBookings = ({ bookings, onCancelBooking, onNewBooking }) => {
  const navigate = useNavigate();
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationInfo, setCancellationInfo] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultInfo, setResultInfo] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'no_show':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      case 'no_show':
        return 'No asistió';
      default:
        return 'Desconocido';
    }
  };

  const canCancelBooking = (booking) => {
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  const canJoinVideoCall = (booking) => {
    if (booking.status !== 'confirmed' || booking.payment_status !== 'paid') {
      return false;
    }
    
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const now = new Date();
    const minutesUntilBooking = (bookingDateTime - now) / (1000 * 60);
    
    // Permitir unirse 15 minutos antes hasta 30 minutos después
    return minutesUntilBooking <= 15 && minutesUntilBooking >= -30;
  };

  const handleJoinVideoCall = (booking) => {
    navigate('/consulta-online', { 
      state: { 
        bookingId: booking.id,
        therapistName: booking.therapist?.name,
        serviceName: booking.service?.name
      } 
    });
  };

  const calculateCancellationFee = (booking) => {
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

    let feePercentage = 0;
    let feeAmount = 0;
    let message = '';

    if (hoursUntilBooking > 24) {
      feePercentage = 0;
      feeAmount = 0;
      message = 'Cancelación gratuita';
    } else if (hoursUntilBooking > 12) {
      feePercentage = 50;
      feeAmount = booking.total_price * 0.5;
      message = `Se aplicará un cargo del 50% ($${feeAmount.toFixed(2)}) por cancelar con menos de 24 horas de anticipación`;
    } else {
      feePercentage = 100;
      feeAmount = booking.total_price;
      message = `Se aplicará un cargo del 100% ($${feeAmount.toFixed(2)}) por cancelar con menos de 12 horas de anticipación`;
    }

    return { feePercentage, feeAmount, message, hoursUntilBooking };
  };

  const handleCancelClick = (booking) => {
    const feeInfo = calculateCancellationFee(booking);
    setSelectedBooking(booking);
    setCancellationInfo(feeInfo);
    setShowCancellationModal(true);
  };

  const handleConfirmCancellation = async () => {
    setShowCancellationModal(false);

    try {
      await onCancelBooking(selectedBooking.id);

      setResultInfo({
        type: 'success',
        title: 'Reserva Cancelada',
        message: cancellationInfo.feeAmount > 0
          ? `Tu reserva ha sido cancelada. ${cancellationInfo.message}`
          : 'Tu reserva ha sido cancelada exitosamente sin cargo.'
      });
      setShowResultModal(true);
    } catch (error) {
      setResultInfo({
        type: 'error',
        title: 'Error al Cancelar',
        message: 'No se pudo cancelar la reserva. Por favor, intenta nuevamente.'
      });
      setShowResultModal(true);
    }

    setSelectedBooking(null);
    setCancellationInfo(null);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const upcomingBookings = bookings.filter(booking =>
    booking.status === 'pending' || booking.status === 'confirmed'
  );

  const pastBookings = bookings.filter(booking =>
    booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no_show'
  );

  if (bookings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes reservas aún
          </h3>
          <p className="text-gray-600 mb-6">
            ¡Agenda tu primera sesión y comienza tu viaje de sanación angelical!
          </p>
          <button
            onClick={onNewBooking}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Hacer Primera Reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Mis Reservas</h2>
          <button
            onClick={onNewBooking}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>

        {upcomingBookings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Sesiones</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border-l-4 border-l-blue-500 overflow-hidden">
                  <div className="p-6 pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{booking.service?.name}</h3>
                        <p className="text-sm text-gray-600">{booking.service?.category}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.therapist?.name}</p>
                        <p className="text-sm text-gray-600">Terapeuta certificado</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {format(new Date(booking.booking_date), "EEE, d MMM", { locale: es })}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(booking.booking_date), "yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{formatTime(booking.start_time)}</p>
                          <p className="text-xs text-gray-600">{booking.duration} min</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">${booking.total_price}</span>
                    </div>

                    {booking.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notas: </span>
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {canJoinVideoCall(booking) && (
                        <button
                          onClick={() => handleJoinVideoCall(booking)}
                          className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:shadow-lg transition-all font-semibold"
                        >
                          <Video className="w-4 h-4" />
                          Unirse a la Videollamada
                        </button>
                      )}
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => handleCancelClick(booking)}
                          className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 border-2 border-red-300 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancelar
                        </button>
                      )}
                      <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastBookings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial</h3>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg opacity-75 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.service?.name}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.therapist?.name} • {' '}
                          {format(new Date(booking.booking_date), "d 'de' MMMM, yyyy", { locale: es })} • {' '}
                          {formatTime(booking.start_time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {getStatusText(booking.status)}
                      </span>
                      <span className="text-sm font-medium">${booking.total_price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCancellationModal && cancellationInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirmar Cancelación</h3>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Servicio:</strong> {selectedBooking?.service?.name}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Fecha:</strong> {format(new Date(selectedBooking?.booking_date), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Hora:</strong> {formatTime(selectedBooking?.start_time)}
              </p>
            </div>

            {cancellationInfo.feeAmount > 0 ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 mb-1">Política de Cancelación</p>
                    <p className="text-sm text-red-700 mb-2">{cancellationInfo.message}</p>
                    <div className="bg-red-100 rounded-lg p-3 mt-2">
                      <p className="text-sm text-red-800">
                        <strong>Tiempo restante:</strong> {cancellationInfo.hoursUntilBooking.toFixed(1)} horas
                      </p>
                      <p className="text-sm text-red-800 mt-1">
                        <strong>Fee de cancelación:</strong> <span className="text-lg font-bold">${cancellationInfo.feeAmount.toFixed(2)}</span> ({cancellationInfo.feePercentage}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800 mb-1">Cancelación Gratuita</p>
                    <p className="text-sm text-green-700">Puedes cancelar sin cargo ya que faltan más de 24 horas para tu cita.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancellationModal(false);
                  setSelectedBooking(null);
                  setCancellationInfo(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                No Cancelar
              </button>
              <button
                onClick={handleConfirmCancellation}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      <AngelicalModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        title={resultInfo?.title}
        message={resultInfo?.message}
        type={resultInfo?.type}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </>
  );
};

export default UserBookings;
