import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePayments = () => {
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPaymentHistory();
    loadSubscriptions();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payment history:', error);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const processPayment = async ({ planId, paymentMethod, amount }) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/stripe-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          paymentMethod,
          amount,
          currency: 'EUR'
        })
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();
      
      if (result.success) {
        await loadPaymentHistory();
        await loadSubscriptions();
      }
      
      return result;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processStripePayment = async ({ planId, amount, paymentData }) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/stripe-create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          amount,
          currency: 'EUR',
          paymentData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadPaymentHistory();
      }
      
      return result;
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch('/api/stripe-cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadSubscriptions();
      }
      
      return result;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  const generateInvoice = async (paymentId) => {
    try {
      const response = await fetch(`/api/generate-invoice/${paymentId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  };

  return {
    payments,
    subscriptions,
    isProcessing,
    processPayment,
    processStripePayment,
    cancelSubscription,
    generateInvoice,
    loadPaymentHistory,
    loadSubscriptions,
    paymentMethods: ['stripe', 'paypal', 'crypto', 'bank']
  };
};