// Stripe Service for Payment Processing
import { supabase } from '@/integrations/supabase/client';

class StripeService {
  constructor() {
    this.publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    this.stripe = null;
    this.initStripe();
  }

  async initStripe() {
    if (typeof window !== 'undefined' && this.publicKey) {
      // Dynamically import Stripe to avoid SSR issues
      const { loadStripe } = await import('@stripe/stripe-js');
      this.stripe = await loadStripe(this.publicKey);
    }
  }

  async createPaymentIntent(planId, amount, currency = 'eur') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('/api/stripe-create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(clientSecret, paymentData) {
    if (!this.stripe) {
      await this.initStripe();
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: paymentData.cardNumber,
            exp_month: parseInt(paymentData.expiryDate.split('/')[0]),
            exp_year: parseInt('20' + paymentData.expiryDate.split('/')[1]),
            cvc: paymentData.cvv,
          },
          billing_details: {
            name: paymentData.cardholderName,
            email: paymentData.email,
            address: {
              line1: paymentData.billingAddress.street,
              city: paymentData.billingAddress.city,
              postal_code: paymentData.billingAddress.postalCode,
              country: paymentData.billingAddress.country,
            },
          },
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('Payment confirmation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createSubscription(priceId, customerId) {
    try {
      const response = await fetch('/api/stripe-create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/stripe-cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  async retrieveCustomer(customerId) {
    try {
      const response = await fetch(`/api/stripe-customer/${customerId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error retrieving customer:', error);
      throw error;
    }
  }

  async createCustomer(userData) {
    try {
      const response = await fetch('/api/stripe-create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async getPaymentMethods(customerId) {
    try {
      const response = await fetch(`/api/stripe-payment-methods/${customerId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  formatPrice(amount, currency = 'EUR') {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s+/g, '');
    const pattern = /^[0-9]{13,19}$/;
    return pattern.test(cleaned);
  }

  validateExpiryDate(expiryDate) {
    const pattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    if (!pattern.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    
    return true;
  }

  validateCVV(cvv) {
    const pattern = /^[0-9]{3,4}$/;
    return pattern.test(cvv);
  }
}

export default new StripeService();