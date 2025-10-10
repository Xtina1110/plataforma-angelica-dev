import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCalendar = () => {
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user availability and bookings
  useEffect(() => {
    loadAvailability();
    loadBookings();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reader_availability')
        .select('*')
        .eq('reader_id', user.id)
        .order('day_of_week');

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error loading availability:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:clients(name, email),
          service:services(name, duration, price)
        `)
        .eq('reader_id', user.id)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at');

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError(error.message);
    }
  };

  const saveAvailability = useCallback(async (availabilityData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete existing availability
      await supabase
        .from('reader_availability')
        .delete()
        .eq('reader_id', user.id);

      // Insert new availability
      if (availabilityData.length > 0) {
        const { error } = await supabase
          .from('reader_availability')
          .insert(availabilityData.map(slot => ({
            ...slot,
            reader_id: user.id
          })));

        if (error) throw error;
      }

      await loadAvailability();
      return { success: true };
    } catch (error) {
      console.error('Error saving availability:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Check if time slot is available
      const isAvailable = await checkAvailability(
        bookingData.scheduled_at,
        bookingData.duration,
        bookingData.reader_id
      );

      if (!isAvailable) {
        throw new Error('Time slot is not available');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          client_id: user.id,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation notifications
      await supabase.functions.invoke('send-booking-notification', {
        body: {
          booking_id: data.id,
          type: 'confirmation'
        }
      });

      await loadBookings();
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAvailability = async (scheduledAt, duration, readerId) => {
    try {
      const startTime = new Date(scheduledAt);
      const endTime = new Date(startTime.getTime() + duration * 60000);
      
      // Check for conflicting bookings
      const { data: conflicts, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('reader_id', readerId)
        .eq('status', 'confirmed')
        .or(`and(scheduled_at.lt.${endTime.toISOString()},scheduled_end.gt.${startTime.toISOString()})`);

      if (error) throw error;

      // Check reader availability for this day/time
      const dayOfWeek = startTime.getDay();
      const timeSlot = startTime.toTimeString().slice(0, 5);

      const { data: availabilitySlots, error: availError } = await supabase
        .from('reader_availability')
        .select('*')
        .eq('reader_id', readerId)
        .eq('day_of_week', dayOfWeek)
        .lte('start_time', timeSlot)
        .gte('end_time', timeSlot);

      if (availError) throw availError;

      return conflicts.length === 0 && availabilitySlots.length > 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Send cancellation notification
      await supabase.functions.invoke('send-booking-notification', {
        body: {
          booking_id: bookingId,
          type: 'cancellation'
        }
      });

      await loadBookings();
      return { success: true };
    } catch (error) {
      console.error('Error canceling booking:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const rescheduleBooking = useCallback(async (bookingId, newDateTime) => {
    try {
      setLoading(true);
      
      // Get booking details
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError) throw fetchError;

      // Check new time availability
      const isAvailable = await checkAvailability(
        newDateTime,
        booking.duration,
        booking.reader_id
      );

      if (!isAvailable) {
        throw new Error('New time slot is not available');
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          scheduled_at: newDateTime,
          status: 'confirmed'
        })
        .eq('id', bookingId);

      if (error) throw error;

      await loadBookings();
      return { success: true };
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableSlots = useCallback(async (readerId, date, duration = 60) => {
    try {
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();

      // Get reader availability for this day
      const { data: availability, error } = await supabase
        .from('reader_availability')
        .select('*')
        .eq('reader_id', readerId)
        .eq('day_of_week', dayOfWeek);

      if (error) throw error;
      if (!availability.length) return [];

      // Get existing bookings for this date
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('scheduled_at, duration')
        .eq('reader_id', readerId)
        .eq('status', 'confirmed')
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString());

      if (bookingError) throw bookingError;

      // Generate available time slots
      const slots = [];
      
      for (const avail of availability) {
        const [startHour, startMin] = avail.start_time.split(':').map(Number);
        const [endHour, endMin] = avail.end_time.split(':').map(Number);
        
        const slotStart = new Date(targetDate);
        slotStart.setHours(startHour, startMin, 0, 0);
        
        const slotEnd = new Date(targetDate);
        slotEnd.setHours(endHour, endMin, 0, 0);

        while (slotStart.getTime() + duration * 60000 <= slotEnd.getTime()) {
          const slotEndTime = new Date(slotStart.getTime() + duration * 60000);
          
          // Check if this slot conflicts with existing bookings
          const hasConflict = bookings.some(booking => {
            const bookingStart = new Date(booking.scheduled_at);
            const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
            
            return (slotStart < bookingEnd && slotEndTime > bookingStart);
          });

          if (!hasConflict && slotStart > new Date()) {
            slots.push({
              start: new Date(slotStart),
              end: new Date(slotEndTime),
              available: true
            });
          }

          slotStart.setMinutes(slotStart.getMinutes() + 30); // 30-minute intervals
        }
      }

      return slots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }, []);

  const syncWithGoogleCalendar = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('sync-google-calendar', {
        body: { action: 'sync' }
      });

      if (error) throw error;

      await loadBookings();
      return data;
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    availability,
    bookings,
    loading,
    error,
    saveAvailability,
    createBooking,
    cancelBooking,
    rescheduleBooking,
    checkAvailability,
    getAvailableSlots,
    syncWithGoogleCalendar,
    loadBookings,
    loadAvailability
  };
};