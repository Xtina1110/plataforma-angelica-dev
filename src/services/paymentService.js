import { supabase } from '../integrations/supabase/client';

/**
 * Payment Service
 * Maneja la creación de PaymentIntents y procesamiento de pagos
 * 
 * NOTA: En producción, esto debe hacerse desde un backend seguro
 * Este es un ejemplo simplificado para desarrollo
 */

/**
 * Crea un PaymentIntent en Stripe
 * 
 * IMPORTANTE: Esta función debe ejecutarse en el backend en producción
 * Por ahora, usamos Supabase Edge Functions o un mock para desarrollo
 */
export const createPaymentIntent = async (amount, bookingData) => {
  try {
    // Opción 1: Usar Supabase Edge Function (recomendado para producción)
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency: 'usd',
        metadata: {
          bookingId: bookingData.id || 'pending',
          bookingType: bookingData.type,
          userId: bookingData.userId,
        },
      },
    });

    if (error) {
      console.error('Error creating payment intent:', error);
      
      // Fallback: Retornar un mock para desarrollo
      console.warn('Using mock payment intent for development');
      return {
        clientSecret: 'pi_mock_secret_' + Date.now(),
        paymentIntentId: 'pi_mock_' + Date.now(),
      };
    }

    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.id,
    };
  } catch (error) {
    console.error('Error in createPaymentIntent:', error);
    
    // Fallback para desarrollo
    return {
      clientSecret: 'pi_mock_secret_' + Date.now(),
      paymentIntentId: 'pi_mock_' + Date.now(),
    };
  }
};

/**
 * Confirma el pago y actualiza el estado de la reserva
 */
export const confirmPayment = async (paymentIntentId, bookingId) => {
  try {
    // Actualizar el estado de la reserva en Supabase
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        payment_intent_id: paymentIntentId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, booking: data };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Procesa un reembolso
 */
export const processRefund = async (paymentIntentId, amount, reason) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-refund', {
      body: {
        paymentIntentId,
        amount: amount ? Math.round(amount * 100) : null, // null = reembolso completo
        reason,
      },
    });

    if (error) throw error;

    return { success: true, refund: data };
  } catch (error) {
    console.error('Error processing refund:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene el estado de un pago
 */
export const getPaymentStatus = async (paymentIntentId) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-payment-status', {
      body: { paymentIntentId },
    });

    if (error) throw error;

    return { success: true, status: data.status };
  } catch (error) {
    console.error('Error getting payment status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Calcula el total con impuestos y cargos adicionales
 */
export const calculateTotal = (baseAmount, options = {}) => {
  const {
    taxRate = 0, // Tasa de impuesto (ej: 0.16 para 16%)
    serviceFee = 0, // Cargo por servicio
    discount = 0, // Descuento
  } = options;

  const subtotal = baseAmount - discount;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + serviceFee;

  return {
    baseAmount,
    discount,
    subtotal,
    tax,
    serviceFee,
    total: Math.max(0, total), // No permitir totales negativos
  };
};

/**
 * Valida los datos de pago antes de procesar
 */
export const validatePaymentData = (amount, bookingData) => {
  const errors = [];

  if (!amount || amount <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (!bookingData) {
    errors.push('Datos de reserva requeridos');
  }

  if (bookingData && !bookingData.userId) {
    errors.push('Usuario no identificado');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentStatus,
  calculateTotal,
  validatePaymentData,
};

