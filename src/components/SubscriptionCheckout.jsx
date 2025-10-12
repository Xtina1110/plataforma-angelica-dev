import React, { useState } from 'react';
import { X, Check, CreditCard, Shield, Zap } from 'lucide-react';
import stripeService from '../services/stripeService';
import { supabase } from '../integrations/supabase/client';

const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Premium Mensual',
    price: 19.99,
    interval: 'mes',
    priceId: 'price_monthly_premium',
    features: [
      'Tiradas de cartas ilimitadas',
      'Sonoterapia completa',
      'Canalizaciones exclusivas',
      'Acceso a todos los cursos',
      'Eventos premium',
      'Descuentos en la tienda',
      'Soporte prioritario',
      'Sin permanencia'
    ]
  },
  yearly: {
    id: 'yearly',
    name: 'Premium Anual',
    price: 199.99,
    interval: 'año',
    priceId: 'price_yearly_premium',
    savings: '2 meses gratis',
    features: [
      'Todo lo del plan mensual',
      'Ahorra 2 meses (40€)',
      'Sesión de consulta personal',
      'Certificado de cursos',
      'Acceso anticipado a nuevas funciones',
      'Regalo de bienvenida',
      'Soporte VIP 24/7'
    ]
  }
};

const SubscriptionCheckout = ({ isOpen, onClose, user }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const plan = PLANS[selectedPlan];
      
      // Create payment intent
      const paymentData = await stripeService.createPaymentIntent(
        plan.priceId,
        plan.price,
        'eur'
      );

      if (!paymentData.clientSecret) {
        throw new Error('Error al crear la sesión de pago');
      }

      // Update user subscription in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: selectedPlan,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: new Date(
            Date.now() + (selectedPlan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
          ).toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Success - close modal and show success message
      alert('¡Suscripción activada! Bienvenido a Premium 🎉');
      onClose();
      window.location.reload(); // Reload to update UI

    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const plan = PLANS[selectedPlan];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Actualizar a Premium</h2>
                  <p className="text-purple-100 text-sm">Desbloquea todo el potencial angelical</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              {selectedPlan === 'monthly' && (
                <div className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full p-2">
                  <Check className="w-5 h-5" />
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {PLANS.monthly.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-purple-600">
                    {PLANS.monthly.price}€
                  </span>
                  <span className="text-gray-500">/{PLANS.monthly.interval}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {PLANS.monthly.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yearly Plan */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              {selectedPlan === 'yearly' && (
                <div className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full p-2">
                  <Check className="w-5 h-5" />
                </div>
              )}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                {PLANS.yearly.savings}
              </div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {PLANS.yearly.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-purple-600">
                    {PLANS.yearly.price}€
                  </span>
                  <span className="text-gray-500">/{PLANS.yearly.interval}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {(PLANS.yearly.price / 12).toFixed(2)}€/mes
                </p>
              </div>
              <ul className="space-y-2">
                {PLANS.yearly.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Selected Plan Details */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-lg text-gray-800 mb-4">
              Características de {plan.name}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Pago seguro procesado por Stripe</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Suscribirse por {plan.price}€
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-4">
            Al suscribirte, aceptas nuestros{' '}
            <a href="/terminos" className="text-purple-600 hover:underline">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="/privacidad" className="text-purple-600 hover:underline">
              Política de Privacidad
            </a>
            . Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

