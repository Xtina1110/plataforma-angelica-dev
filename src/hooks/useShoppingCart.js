import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Cargar items del carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('angelical_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('angelical_cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('angelical_cart');
    }
  }, [cartItems]);

  // Detectar cuando el usuario intenta salir con items sin pagar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (cartItems.length > 0) {
        e.preventDefault();
        e.returnValue = 'Tienes reservas pendientes de pago. ¿Deseas salir sin completar tu reserva?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cartItems]);

  const addToCart = async (bookingData) => {
    const cartItem = {
      id: Date.now().toString(),
      ...bookingData,
      addedAt: new Date().toISOString()
    };
    
    setCartItems(prev => [...prev, cartItem]);
    
    toast({
      title: "Añadido al carrito",
      description: "Tu reserva ha sido añadida al carrito de compras",
      variant: "default"
    });

    return cartItem;
  };

  const removeFromCart = async (itemId, shouldRelease = true, chargeFee = false) => {
    const item = cartItems.find(i => i.id === itemId);
    
    if (item && item.bookingId) {
      if (chargeFee) {
        // Cancelar con fee del 50%
        await cancelWithFee(item);
      } else if (shouldRelease) {
        // Liberar sin fee
        await releaseReservation(item);
      }
    }

    setCartItems(prev => prev.filter(i => i.id !== itemId));
    
    if (chargeFee) {
      const cancellationFee = (item.total_price || 0) * 0.5;
      toast({
        title: "Reserva cancelada",
        description: `Se ha aplicado un cargo de cancelación de $${cancellationFee.toFixed(2)} USD (50% del total)`,
        duration: 5000
      });
    } else if (shouldRelease) {
      toast({
        title: "Reserva liberada",
        description: "La reserva ha sido liberada sin cargos",
        variant: "default"
      });
    }
  };

  const releaseReservation = async (bookingData) => {
    try {
      // Actualizar estado de la reserva a 'cancelled' sin fee
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancellation_fee: 0,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingData.bookingId);

      if (error) {
        console.error('Error releasing reservation:', error);
      }
    } catch (error) {
      console.error('Error releasing reservation:', error);
    }
  };

  const cancelWithFee = async (bookingData) => {
    try {
      const cancellationFee = (bookingData.total_price || 0) * 0.5;

      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_fee: cancellationFee,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingData.bookingId);

      if (error) {
        console.error('Error cancelling with fee:', error);
      }

      // Aquí se procesaría el cobro del fee con Stripe
      // await processStripePayment(cancellationFee);
    } catch (error) {
      console.error('Error cancelling with fee:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('angelical_cart');
  };

  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
  };

  const getItemCount = () => cartItems.length;

  const processCartPayment = async (paymentData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Procesar pago de todos los items del carrito
      const bookingsToCreate = cartItems.map(item => ({
        user_id: user.id,
        service_id: item.service_id,
        therapist_id: item.therapist_id,
        booking_date: item.booking_date,
        start_time: item.start_time,
        end_time: item.end_time,
        duration: item.duration,
        total_price: item.total_price,
        notes: item.notes,
        reminder_preferences: item.reminder_preferences,
        payment_status: 'completed',
        status: 'confirmed'
      }));

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingsToCreate)
        .select(`
          *,
          service:services(*),
          therapist:therapists(*)
        `);

      if (error) throw error;

      clearCart();
      
      return {
        success: true,
        bookings: data
      };
    } catch (error) {
      console.error('Error processing cart payment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getItemCount,
    processCartPayment,
    releaseReservation
  };
};
