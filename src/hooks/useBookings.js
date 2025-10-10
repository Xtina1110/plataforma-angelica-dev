import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';
import * as bookingAPI from '../services/bookingAPI';

export const useBookings = () => {
  const [services, setServices] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [holdId, setHoldId] = useState(null);
  const { toast } = useToast();

  // Cargar servicios
  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios",
        variant: "destructive"
      });
    }
  };

  // Cargar terapeutas
  const loadTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error loading therapists:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los terapeutas",
        variant: "destructive"
      });
    }
  };

  // Cargar reservas del usuario
  const loadUserBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(*),
          therapist:therapists(*)
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true });

      if (error) throw error;
      setUserBookings(data || []);
    } catch (error) {
      console.error('Error loading user bookings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas",
        variant: "destructive"
      });
    }
  };

  // Obtener fechas disponibles desde el backend
  const loadAvailableDates = async (bookingType, duration) => {
    try {
      if (!bookingType || !duration) return;

      const result = await bookingAPI.getAvailableDates(
        bookingType,
        selectedTherapist?.id,
        duration
      );

      if (result.success) {
        setAvailableDates(result.dates || []);
      }
    } catch (error) {
      console.error('Error loading available dates:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las fechas disponibles",
        variant: "destructive"
      });
    }
  };

  // Obtener horarios disponibles desde el backend
  const getTherapistAvailability = async (therapistId, date) => {
    try {
      if (!therapistId || !date || !selectedService?.duration) {
        return [];
      }

      const result = await bookingAPI.getAvailableTimes(
        date,
        therapistId,
        selectedService.duration
      );

      if (result.success) {
        return result.availableSlots || [];
      }

      return [];
    } catch (error) {
      console.error('Error getting therapist availability:', error);
      return [];
    }
  };

  // Verificar disponibilidad y crear hold temporal
  const checkAndHoldSlot = async (therapistId, date, time, duration) => {
    try {
      const result = await bookingAPI.checkAvailability(therapistId, date, time, duration);
      
      if (result.success && result.available) {
        setHoldId(result.holdId);
        return true;
      }

      toast({
        title: "No disponible",
        description: result.message || "Este horario ya no está disponible",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  // Función auxiliar para agregar minutos a una hora
  const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  // Crear una reserva usando el backend
  const createBooking = async (bookingData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener datos del usuario para el backend
      const { data: userData } = await supabase
        .from('usuarios')
        .select('email, nombre')
        .eq('id', user.id)
        .single();

      const bookingPayload = {
        userId: user.id,
        therapistId: bookingData.therapist_id,
        bookingType: bookingData.booking_type || 'apertura',
        date: bookingData.booking_date,
        time: bookingData.start_time,
        duration: bookingData.duration,
        price: bookingData.total_price,
        holdId: holdId,
        paymentMethodId: bookingData.payment_method_id,
        userEmail: userData?.email || user.email,
        userName: userData?.nombre || user.email
      };

      const result = await bookingAPI.createBooking(bookingPayload);

      if (result.success) {
        toast({
          title: "¡Reserva confirmada!",
          description: result.message || "Tu reserva ha sido creada exitosamente",
          variant: "default"
        });

        setHoldId(null); // Limpiar hold
        await loadUserBookings(); // Recargar reservas
        return result.booking;
      }

      throw new Error(result.error || 'Error al crear la reserva');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la reserva",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Cancelar una reserva con fee
  const cancelBooking = async (bookingId, reason = '') => {
    try {
      const result = await bookingAPI.cancelBooking(bookingId, reason);

      if (result.success) {
        toast({
          title: "Reserva cancelada",
          description: result.message || "Tu reserva ha sido cancelada",
          variant: "default"
        });

        await loadUserBookings(); // Recargar reservas
        return result;
      }

      throw new Error(result.error || 'Error al cancelar');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cancelar la reserva",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Reprogramar una reserva
  const rescheduleBooking = async (bookingId, newDate, newTime) => {
    try {
      const result = await bookingAPI.rescheduleBooking(bookingId, newDate, newTime);

      if (result.success) {
        toast({
          title: "Reserva reprogramada",
          description: result.message || "Tu reserva ha sido reprogramada",
          variant: "default"
        });

        await loadUserBookings();
        return result;
      }

      throw new Error(result.error || 'Error al reprogramar');
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo reprogramar la reserva",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Cargar fechas disponibles cuando cambie el servicio
  useEffect(() => {
    if (selectedService) {
      loadAvailableDates(
        selectedService.category || 'apertura',
        selectedService.duration
      );
    }
  }, [selectedService]);

  // Cargar slots disponibles cuando cambie el terapeuta o la fecha
  useEffect(() => {
    if (selectedTherapist && selectedDate) {
      getTherapistAvailability(selectedTherapist.id, selectedDate)
        .then(setAvailableSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedTherapist, selectedDate, selectedService]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        loadServices(),
        loadTherapists(),
        loadUserBookings()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  return {
    // Estados
    services,
    therapists,
    userBookings,
    loading,
    selectedService,
    selectedTherapist,
    selectedDate,
    selectedTime,
    availableSlots,
    availableDates,
    holdId,

    // Setters
    setSelectedService,
    setSelectedTherapist,
    setSelectedDate,
    setSelectedTime,

    // Funciones
    loadServices,
    loadTherapists,
    loadUserBookings,
    loadAvailableDates,
    getTherapistAvailability,
    checkAndHoldSlot,
    createBooking,
    cancelBooking,
    rescheduleBooking
  };
};