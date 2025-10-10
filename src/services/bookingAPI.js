/**
 * API Service para conectar con el backend de reservas
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtener fechas disponibles
 */
export const getAvailableDates = async (bookingType, therapistId, duration) => {
  try {
    const params = new URLSearchParams({
      bookingType,
      duration: duration.toString()
    });
    
    if (therapistId) {
      params.append('therapistId', therapistId);
    }

    const response = await fetch(`${API_BASE_URL}/api/availability/dates?${params}`);
    
    if (!response.ok) {
      throw new Error('Error fetching available dates');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting available dates:', error);
    throw error;
  }
};

/**
 * Obtener horarios disponibles para una fecha y terapeuta
 */
export const getAvailableTimes = async (date, therapistId, duration) => {
  try {
    const params = new URLSearchParams({
      date,
      therapistId,
      duration: duration.toString()
    });

    const response = await fetch(`${API_BASE_URL}/api/availability/times?${params}`);
    
    if (!response.ok) {
      throw new Error('Error fetching available times');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting available times:', error);
    throw error;
  }
};

/**
 * Obtener terapeutas disponibles
 */
export const getAvailableTherapists = async (bookingType, date, time, duration) => {
  try {
    const params = new URLSearchParams({
      bookingType,
      date,
      time,
      duration: duration.toString()
    });

    const response = await fetch(`${API_BASE_URL}/api/availability/therapists?${params}`);
    
    if (!response.ok) {
      throw new Error('Error fetching available therapists');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting available therapists:', error);
    throw error;
  }
};

/**
 * Verificar disponibilidad de un slot específico
 */
export const checkAvailability = async (therapistId, date, time, duration) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/availability/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        therapistId,
        date,
        time,
        duration
      })
    });

    if (!response.ok) {
      throw new Error('Error checking availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

/**
 * Crear una reserva
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creating booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Obtener detalles de una reserva
 */
export const getBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
    
    if (!response.ok) {
      throw new Error('Error fetching booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

/**
 * Obtener reservas de un usuario
 */
export const getUserBookings = async (userId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    
    if (filters.upcoming) {
      params.append('upcoming', 'true');
    }

    const response = await fetch(`${API_BASE_URL}/api/bookings/user/${userId}?${params}`);
    
    if (!response.ok) {
      throw new Error('Error fetching user bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

/**
 * Cancelar una reserva
 */
export const cancelBooking = async (bookingId, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error cancelling booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

/**
 * Reprogramar una reserva
 */
export const rescheduleBooking = async (bookingId, newDate, newTime) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/reschedule`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newDate,
        newTime
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error rescheduling booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    throw error;
  }
};

/**
 * Extender una reserva durante la sesión
 */
export const extendBooking = async (bookingId, additionalMinutes, paymentMethodId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        additionalMinutes,
        paymentMethodId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error extending booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error extending booking:', error);
    throw error;
  }
};
