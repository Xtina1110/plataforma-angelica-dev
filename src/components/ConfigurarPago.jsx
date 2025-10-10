import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../supabase';
import AuthPageLayout from './AuthPageLayout';
import AngelicParticles from './AngelicParticles';

const ConfigurarPago = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { email, plan } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) value = value.slice(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Integración real con Stripe
      // Por ahora, simulamos el proceso
      
      // 1. Crear customer en Stripe
      // const stripeCustomer = await createStripeCustomer(email);
      
      // 2. Crear payment method
      // const paymentMethod = await createPaymentMethod(cardData);
      
      // 3. Crear suscripción
      // const subscription = await createSubscription(stripeCustomer.id, paymentMethod.id, plan);
      
      // 4. Actualizar base de datos
      // await updateUserSubscription(subscription);

      // Simulación de proceso
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirigir a confirmación
      navigate('/pago-exitoso', {
        state: {
          email,
          plan
        }
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanPrice = () => {
    const prices = {
      premium: '19.99',
      pro: '49.99',
      enterprise: '199.99'
    };
    return prices[plan] || '0.00';
  };

  return (
    <AuthPageLayout>
      {/* Partículas de fondo */}
      <AngelicParticles />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className={`p-8 rounded-2xl backdrop-blur-md ${
          isDark ? 'bg-gray-900/95' : 'bg-white/95'
        } shadow-2xl`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mb-4">
              <CreditCard size={32} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              💳 Configura tu pago
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Plan seleccionado: <span className="font-semibold capitalize">{plan}</span>
            </p>
          </div>

          {/* Plan Summary */}
          <div className={`p-6 rounded-xl mb-6 ${
            isDark ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total mensual
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {getPlanPrice()}€
                  <span className="text-sm font-normal">/mes</span>
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Facturación
                </p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Mensual
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Número de Tarjeta *
              </label>
              <div className="relative">
                <CreditCard size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                      : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
            </div>

            {/* Card Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Nombre en la Tarjeta *
              </label>
              <input
                type="text"
                name="cardName"
                value={cardData.cardName}
                onChange={handleChange}
                placeholder="JUAN GARCÍA"
                required
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                    : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Fecha de Expiración *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                      : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                      : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border-2 border-red-500 rounded-xl">
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              </div>
            )}

            {/* Security Info */}
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex gap-3">
                <Lock size={20} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                    Pago 100% seguro
                  </p>
                  <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    Tu información está protegida con encriptación SSL de 256 bits. Procesado por Stripe.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Confirmar Pago de {getPlanPrice()}€/mes
                </>
              )}
            </button>

            {/* Cancel Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} transition-colors`}
              >
                Cancelar y volver
              </button>
            </div>
          </form>

          {/* Note */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Al confirmar el pago, aceptas que se te cobre {getPlanPrice()}€ mensualmente. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default ConfigurarPago;

