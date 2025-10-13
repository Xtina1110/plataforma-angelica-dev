import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe Configuration
 * 
 * IMPORTANTE: Antes de usar en producción, debes:
 * 1. Crear una cuenta en Stripe (https://stripe.com)
 * 2. Obtener tus claves API (Dashboard > Developers > API keys)
 * 3. Añadir VITE_STRIPE_PUBLIC_KEY a tu archivo .env
 * 4. Configurar un backend para crear PaymentIntents
 */

// Obtener la clave pública de Stripe desde las variables de entorno
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Verificar que la clave existe
if (!stripePublicKey) {
  console.warn(
    '⚠️ VITE_STRIPE_PUBLIC_KEY no está configurada. ' +
    'Por favor, añade tu clave pública de Stripe al archivo .env'
  );
}

// Cargar Stripe
let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise && stripePublicKey) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

// Configuración de Stripe para diferentes entornos
export const stripeConfig = {
  // Modo de prueba o producción
  mode: import.meta.env.MODE === 'production' ? 'live' : 'test',
  
  // URL del backend para crear PaymentIntents
  // Ajusta esto según tu configuración de backend
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Opciones de apariencia para Stripe Elements
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#8B5CF6', // Purple angelical
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Label': {
        fontWeight: '600',
        marginBottom: '8px',
      },
      '.Input': {
        padding: '12px',
        border: '2px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      '.Input:focus': {
        border: '2px solid #8B5CF6',
        boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
      },
    },
  },
};

export default {
  getStripe,
  stripeConfig,
};

