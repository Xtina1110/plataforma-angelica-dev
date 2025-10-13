import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  Clock, Calendar, User, Check, ArrowRight, ArrowLeft,
  Video, Sparkles, Heart, Wind, ChevronRight, ChevronLeft, Star,
  X, ShoppingCart, AlertCircle, FileText, DollarSign, CreditCard
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, isSameMonth, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../contexts/CartContext';
import AngelicalModal from '../AngelicalModal';
import StripeCheckout from '../StripeCheckout';
import { createPaymentIntent, confirmPayment } from '../../services/paymentService';

const SistemaReservasCompleto = ({ mode = 'general' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(mode === 'apertura' ? 2 : 1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [pendingBookingId, setPendingBookingId] = useState(null);

  // Cargar usuario actual
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const bookingTypes = [
    {
      id: 'apertura',
      name: 'Apertura Angelical',
      description: 'Conexión profunda con tus ángeles guardianes',
      icon: '✨',
      color: '#8B5CF6',
      minDuration: 60,
      recommended: 90
    },
    {
      id: 'terapias',
      name: 'Terapias Energéticas',
      description: 'Sanación y equilibrio energético',
      icon: '💜',
      color: '#EC4899',
      minDuration: 60,
      recommended: 90
    },
    {
      id: 'limpiezas',
      name: 'Limpiezas Espirituales',
      description: 'Purificación del aura y energía',
      icon: '🌬️',
      color: '#06B6D4',
      minDuration: 60,
      recommended: 90
    }
  ];

  // Auto-seleccionar tipo si viene desde Apertura Angelica
  useEffect(() => {
    if (mode === 'apertura') {
      setSelectedType('apertura');
    }
  }, [mode]);

  const durations = [
    { minutes: 60, label: '1 hora', price: 200 },
    { minutes: 75, label: '1h 15min', price: 250 },
    { minutes: 90, label: '1h 30min', price: 295 },
    { minutes: 105, label: '1h 45min', price: 330 },
    { minutes: 120, label: '2 horas', price: 360 },
    { minutes: 135, label: '2h 15min', price: 405 },
    { minutes: 150, label: '2h 30min', price: 450 }
  ];

  const readers = [
    {
      id: 'juan-carlos-avila',
      name: 'Juan Carlos Ávila',
      title: 'El Angelólogo',
      specialty: ['apertura', 'terapias', 'limpiezas'],
      rating: 5.0,
      sessions: 3500,
      avatar: '/juan-carlos-avila.png',
      description: 'Fundador y maestro angelólogo con más de 20 años de experiencia en conexión angelical y sanación espiritual'
    }
  ];

  // Generar calendario mensual completo estilo Windows
  const getMonthDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startWeek = startOfWeek(start, { weekStartsOn: 0 });

    const days = [];
    let day = startWeek;

    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = addMonths(currentMonth, direction);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstOfNewMonth = startOfMonth(newMonth);
    
    if (direction < 0 && firstOfNewMonth < startOfMonth(today)) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isDateAvailable = (date) => {
    if (date.getDay() === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) return false;
    
    return true;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const isSelectedDateToday = selectedDate && isToday(selectedDate);
    
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 20 && minute === 30) break;
        
        if (isSelectedDateToday) {
          const slotTime = new Date();
          slotTime.setHours(hour, minute, 0, 0);
          if (slotTime <= now) continue;
        }
        
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Verificar si Stripe está configurado
  const isStripeConfigured = () => {
    return !!import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  };

  const handleInitiatePayment = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const selectedDurationData = durations.find(d => d.minutes === selectedDuration);
      const selectedReaderData = readers.find(r => r.id === selectedReader);
      const selectedTypeData = bookingTypes.find(t => t.id === selectedType);

      // Calcular end_time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0);
      const endDate = new Date(startDate.getTime() + selectedDuration * 60000);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

      // Crear reserva en Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: currentUser.id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          end_time: endTime,
          duration: selectedDuration,
          total_price: selectedDurationData.price,
          status: isStripeConfigured() ? 'pending_payment' : 'confirmed',
          payment_status: isStripeConfigured() ? 'pending' : 'paid',
          notes: `Tipo: ${selectedTypeData.name}, Terapeuta: ${selectedReaderData.name}`,
          payment_intent_id: isStripeConfigured() ? null : 'mock_payment_' + Date.now()
        })
        .select()
        .single();

      if (error) throw error;

      setPendingBookingId(data.id);

      // Si Stripe NO está configurado, ir directo a confirmación
      if (!isStripeConfigured()) {
        const booking = {
          id: data.id,
          type: selectedTypeData.name,
          duration: selectedDurationData.label,
          date: format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es }),
          therapist: selectedReaderData.name,
          time: selectedTime,
          price: selectedDurationData.price,
          status: 'confirmed',
          bookingData: data
        };

        setConfirmedBooking(booking);
        setShowConfirmationModal(true);

        toast({
          title: "¡Reserva Confirmada!",
          description: "Tu cita ha sido agendada exitosamente (Modo Demo - Sin pago real)",
          duration: 5000
        });

        setIsProcessing(false);
        return;
      }

      // Si Stripe SÍ está configurado, continuar con flujo normal
      const paymentData = await createPaymentIntent(selectedDurationData.price, {
        id: data.id,
        type: selectedTypeData.name,
        userId: currentUser.id,
      });

      setPaymentClientSecret(paymentData.clientSecret);
      setShowPaymentModal(true);

    } catch (error) {
      console.error('Error al procesar reserva:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la reserva. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Confirmar el pago y actualizar la reserva
      const result = await confirmPayment(paymentIntent.id, pendingBookingId);

      if (result.success) {
        const selectedDurationData = durations.find(d => d.minutes === selectedDuration);
        const selectedReaderData = readers.find(r => r.id === selectedReader);
        const selectedTypeData = bookingTypes.find(t => t.id === selectedType);

        const booking = {
          id: result.booking.id,
          type: selectedTypeData.name,
          duration: selectedDurationData.label,
          date: format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es }),
          therapist: selectedReaderData.name,
          time: selectedTime,
          price: selectedDurationData.price,
          status: 'confirmed',
          bookingData: result.booking
        };

        setConfirmedBooking(booking);
        setShowPaymentModal(false);
        setShowConfirmationModal(true);

        toast({
          title: "¡Pago Exitoso!",
          description: "Tu reserva ha sido confirmada. Recibirás un correo con los detalles.",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al confirmar tu reserva. Contacta con soporte.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast({
      title: "Error en el pago",
      description: "No se pudo procesar el pago. Por favor, intenta de nuevo.",
      variant: "destructive"
    });
  };

  const handleAddToCart = () => {
    if (!confirmedBooking) return;

    const cartItem = {
      id: confirmedBooking.id,
      type: 'booking',
      name: `${confirmedBooking.type} - ${confirmedBooking.date} ${confirmedBooking.time}`,
      description: `Sesión de ${confirmedBooking.duration} con ${confirmedBooking.therapist}`,
      price: confirmedBooking.price,
      quantity: 1,
      bookingId: confirmedBooking.id
    };

    addToCart(cartItem);

    toast({
      title: "Añadido al carrito",
      description: "La reserva ha sido añadida a tu carrito de compra",
      duration: 3000
    });

    setShowConfirmationModal(false);
  };

  const handleCancelBooking = async () => {
    if (!confirmedBooking || !cancellationReason.trim()) {
      toast({
        title: "Error",
        description: "Por favor, indica el motivo de la cancelación",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const cancellationFee = confirmedBooking.price * 0.5;

      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason,
          cancellation_fee: cancellationFee
        })
        .eq('id', confirmedBooking.id);

      if (error) throw error;

      toast({
        title: "Reserva Cancelada",
        description: `Se aplicará un cargo de cancelación de $${cancellationFee.toFixed(2)} USD (50% del total)`,
        duration: 5000
      });

      setShowCancellationModal(false);
      setShowConfirmationModal(false);

      // Resetear el formulario
      setCurrentStep(1);
      setSelectedType(null);
      setSelectedDuration(null);
      setSelectedDate(null);
      setSelectedReader(null);
      setSelectedTime(null);
      setConfirmedBooking(null);

    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedType !== null;
      case 2: return selectedDuration !== null;
      case 3: return selectedDate !== null;
      case 4: return selectedReader !== null;
      case 5: return selectedTime !== null;
      default: return false;
    }
  };

  const goToNextStep = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: 'Selecciona el Tipo de Consulta',
      2: 'Elige la Duración',
      3: 'Selecciona el Día',
      4: 'Elige a tu Terapeuta',
      5: 'Selecciona la Hora',
      6: 'Confirma y Paga'
    };
    return titles[currentStep] || '';
  };

  const totalSteps = mode === 'apertura' ? 5 : 6;
  const steps = mode === 'apertura' ? [2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep === step
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-110'
                      : currentStep > step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <Check className="w-6 h-6" /> : mode === 'apertura' ? index + 1 : step}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep === step ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    Paso {mode === 'apertura' ? index + 1 : step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Title */}
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {getStepTitle()}
        </h2>

        {/* Step 1: Tipo de Consulta */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookingTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  selectedType === type.id
                    ? 'border-purple-500 bg-purple-50 shadow-xl'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <div className="text-5xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: type.color }}>
                  {type.name}
                </h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
                {selectedType === type.id && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-purple-600 font-semibold">
                    <Check className="w-5 h-5" />
                    <span>Seleccionado</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Duración */}
        {currentStep === 2 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {durations.map((duration) => (
              <button
                key={duration.minutes}
                onClick={() => setSelectedDuration(duration.minutes)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  selectedDuration === duration.minutes
                    ? 'border-purple-500 bg-purple-50 shadow-xl'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <Clock className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <div className="text-lg font-bold text-gray-800">{duration.label}</div>
                <div className="text-2xl font-bold text-purple-600 mt-2">
                  ${duration.price}
                </div>
                <div className="text-sm text-gray-500">USD</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Fecha - Calendario Mensual */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Navegación de mes */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  disabled={isSameMonth(currentMonth, new Date())}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isSameMonth(currentMonth, new Date())
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Anterior</span>
                </button>

                <h3 className="text-2xl font-bold text-gray-800">
                  {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Encabezado de días de la semana */}
              <div className="grid grid-cols-7 gap-0 mb-2 border-b border-gray-200 pb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-0">
                {getMonthDays().map((date) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isPast = isDateDisabled(date);
                  const isAvailable = isDateAvailable(date);
                  const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(new Date(selectedDate), 'yyyy-MM-dd');
                  const isTodayDate = isToday(date);
                  const isSunday = date.getDay() === 0;

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        if (isAvailable && isCurrentMonth) {
                          setSelectedDate(date);
                        }
                      }}
                      disabled={!isAvailable || !isCurrentMonth}
                      className={`
                        relative p-4 min-h-[60px] text-center transition-all duration-150
                        ${!isCurrentMonth ? 'text-gray-300 bg-white cursor-default' : ''}
                        ${isCurrentMonth && isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                        ${isCurrentMonth && !isPast && isSunday ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                        ${isCurrentMonth && isAvailable && !isSelected && !isTodayDate ? 'bg-white text-gray-900 hover:bg-purple-50 cursor-pointer' : ''}
                        ${isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg font-bold' : ''}
                        ${isTodayDate && !isSelected && isAvailable ? 'bg-blue-500 text-white font-semibold hover:bg-blue-600' : ''}
                        border-r border-b border-gray-100
                      `}
                    >
                      <div className="text-base">
                        {format(date, 'd')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Terapeuta */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {readers
              .filter(reader => !selectedType || reader.specialty.includes(selectedType))
              .map((reader) => (
                <button
                  key={reader.id}
                  onClick={() => setSelectedReader(reader.id)}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    selectedReader === reader.id
                      ? 'border-purple-500 bg-purple-50 shadow-xl'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                  }`}
                >
                  <div className="mb-4">
                    {reader.avatar.startsWith('/') ? (
                      <img 
                        src={reader.avatar} 
                        alt={reader.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                      />
                    ) : (
                      <div className="text-6xl">{reader.avatar}</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{reader.name}</h3>
                  {reader.title && (
                    <p className="text-sm font-semibold text-purple-600 mb-2">{reader.title}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-4">{reader.description}</p>

                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{reader.rating}</span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">{reader.sessions} sesiones</span>
                  </div>

                  {selectedReader === reader.id && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-purple-600 font-semibold">
                      <Check className="w-5 h-5" />
                      <span>Seleccionado</span>
                    </div>
                  )}
                </button>
              ))}
          </div>
        )}

        {/* Step 5: Hora */}
        {currentStep === 5 && (
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3 max-w-6xl mx-auto">
            {generateTimeSlots().map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedTime === time
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <Clock className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-bold">{time}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 6: Confirmación y Pago */}
        {currentStep === 6 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-700">Tipo de Consulta:</span>
                  <span className="text-purple-700 font-semibold">
                    {bookingTypes.find(t => t.id === selectedType)?.name}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-700">Duración:</span>
                  <span className="text-purple-700 font-semibold">
                    {durations.find(d => d.minutes === selectedDuration)?.label}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-700">Fecha:</span>
                  <span className="text-purple-700 font-semibold">
                    {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-700">Terapeuta:</span>
                  <span className="text-purple-700 font-semibold">
                    {readers.find(r => r.id === selectedReader)?.name}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-700">Hora:</span>
                  <span className="text-purple-700 font-semibold">
                    {selectedTime}
                  </span>
                </div>

                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-md">
                  <span className="font-bold text-gray-800 text-lg">Total a Pagar:</span>
                  <span className="text-purple-700 font-bold text-3xl">
                    ${durations.find(d => d.minutes === selectedDuration)?.price} USD
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      <span>Proceder al Pago</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === (mode === 'apertura' ? 2 : 1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === (mode === 'apertura' ? 2 : 1)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          {currentStep < 6 && (
            <button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Siguiente</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Modal de Pago con Stripe */}
      <AngelicalModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Pago Seguro"
      >
        <StripeCheckout
          amount={durations.find(d => d.minutes === selectedDuration)?.price || 0}
          bookingData={{
            id: pendingBookingId,
            type: bookingTypes.find(t => t.id === selectedType)?.name,
            userId: currentUser?.id,
          }}
          clientSecret={paymentClientSecret}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={() => setShowPaymentModal(false)}
        />
      </AngelicalModal>

      {/* Modal de Confirmación */}
      <AngelicalModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title="¡Reserva Confirmada!"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Tu cita ha sido agendada exitosamente. Recibirás un correo de confirmación.
            </p>
          </div>

          {confirmedBooking && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-3">
              <h3 className="font-bold text-lg text-purple-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resumen de tu Cita
              </h3>

              <div className="flex justify-between py-2 border-b border-purple-200">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-semibold text-purple-700">{confirmedBooking.type}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-purple-200">
                <span className="text-gray-600">Duración:</span>
                <span className="font-semibold text-purple-700">{confirmedBooking.duration}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-purple-200">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-semibold text-purple-700">{confirmedBooking.date}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-purple-200">
                <span className="text-gray-600">Terapeuta:</span>
                <span className="font-semibold text-purple-700">{confirmedBooking.therapist}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-purple-200">
                <span className="text-gray-600">Hora:</span>
                <span className="font-semibold text-purple-700">{confirmedBooking.time}</span>
              </div>

              <div className="flex justify-between py-3 bg-purple-100 rounded-lg px-4 mt-4">
                <span className="font-bold text-gray-800">Total Pagado:</span>
                <span className="font-bold text-2xl text-purple-700">
                  ${confirmedBooking.price} USD
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/mis-reservas')} 
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Calendar className="w-5 h-5" />
            Ver Mis Reservas
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Próximos Pasos</p>
              <p>Recibirás un correo con el enlace para la videollamada 15 minutos antes de tu cita.</p>
            </div>
          </div>
        </div>
      </AngelicalModal>

      {/* Modal de Cancelación */}
      <AngelicalModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        title="Cancelar Reserva"
      >
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-2">Cargo por Cancelación</p>
              <p className="mb-2">Se aplicará un cargo del 50% del total de la cita:</p>
              <div className="flex items-center gap-2 bg-red-100 rounded px-3 py-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-bold text-lg">
                  ${confirmedBooking ? (confirmedBooking.price * 0.5).toFixed(2) : '0'} USD
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la cancelación *
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Por favor, indica el motivo de tu cancelación..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCancellationModal(false)}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
            >
              Volver
            </button>

            <button
              onClick={handleCancelBooking}
              disabled={isProcessing || !cancellationReason.trim()}
              className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </div>
      </AngelicalModal>
    </div>
  );
};

export default SistemaReservasCompleto;

