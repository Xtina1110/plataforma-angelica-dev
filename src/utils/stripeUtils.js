// Utilidades para integración con Stripe
// Este archivo contiene las funciones para interactuar con la API de Stripe

import { supabase } from '../supabase';

// Configuración de Stripe
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';
const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY || '';

/**
 * Inicializar Stripe
 * Debe ser llamado al inicio de la aplicación
 */
export const initializeStripe = async () => {
  if (!window.Stripe) {
    console.error('Stripe.js no está cargado');
    return null;
  }
  
  return window.Stripe(STRIPE_PUBLIC_KEY);
};

/**
 * Crear un customer en Stripe
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Customer de Stripe
 */
export const createStripeCustomer = async (userData) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-customer', {
      body: {
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        metadata: {
          user_id: userData.id,
          user_type: userData.userType
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

/**
 * Crear un payment method
 * @param {Object} stripe - Instancia de Stripe
 * @param {Object} cardElement - Elemento de tarjeta de Stripe
 * @param {Object} billingDetails - Detalles de facturación
 * @returns {Promise<Object>} Payment method
 */
export const createPaymentMethod = async (stripe, cardElement, billingDetails) => {
  try {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails
    });

    if (error) throw error;
    return paymentMethod;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

/**
 * Crear una suscripción
 * @param {string} customerId - ID del customer en Stripe
 * @param {string} paymentMethodId - ID del payment method
 * @param {string} priceId - ID del price en Stripe
 * @returns {Promise<Object>} Subscription
 */
export const createSubscription = async (customerId, paymentMethodId, priceId) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: {
        customerId,
        paymentMethodId,
        priceId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancelar una suscripción
 * @param {string} subscriptionId - ID de la suscripción en Stripe
 * @returns {Promise<Object>} Subscription cancelada
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Actualizar una suscripción
 * @param {string} subscriptionId - ID de la suscripción en Stripe
 * @param {string} newPriceId - Nuevo price ID
 * @returns {Promise<Object>} Subscription actualizada
 */
export const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: {
        subscriptionId,
        newPriceId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Obtener información de una suscripción
 * @param {string} subscriptionId - ID de la suscripción en Stripe
 * @returns {Promise<Object>} Información de la suscripción
 */
export const getSubscription = async (subscriptionId) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
};

/**
 * Crear un setup intent para guardar tarjeta sin cargo
 * @param {string} customerId - ID del customer en Stripe
 * @returns {Promise<Object>} Setup intent
 */
export const createSetupIntent = async (customerId) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-setup-intent', {
      body: { customerId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
};

/**
 * Obtener el portal de cliente de Stripe
 * @param {string} customerId - ID del customer en Stripe
 * @param {string} returnUrl - URL de retorno
 * @returns {Promise<string>} URL del portal
 */
export const createCustomerPortalSession = async (customerId, returnUrl) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        customerId,
        returnUrl
      }
    });

    if (error) throw error;
    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

/**
 * Webhook handler para eventos de Stripe
 * Esta función debe ser llamada desde un endpoint de Supabase Edge Function
 */
export const handleStripeWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};

// Handlers internos para webhooks
const handleSubscriptionCreated = async (subscription) => {
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    });

  if (error) throw error;
};

const handleSubscriptionUpdated = async (subscription) => {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
};

const handleSubscriptionDeleted = async (subscription) => {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
};

const handlePaymentSucceeded = async (invoice) => {
  const { error } = await supabase
    .from('payments')
    .insert({
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'succeeded',
      paid_at: new Date(invoice.status_transitions.paid_at * 1000)
    });

  if (error) throw error;
};

const handlePaymentFailed = async (invoice) => {
  const { error } = await supabase
    .from('payments')
    .insert({
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed'
    });

  if (error) throw error;
};

export default {
  initializeStripe,
  createStripeCustomer,
  createPaymentMethod,
  createSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscription,
  createSetupIntent,
  createCustomerPortalSession,
  handleStripeWebhook
};

