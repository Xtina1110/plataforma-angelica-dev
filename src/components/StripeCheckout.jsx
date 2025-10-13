import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, stripeConfig } from '../config/stripeConfig';
import { Loader2, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

/**
 * CheckoutForm - Formulario de pago con Stripe Elements
 */
const CheckoutForm = ({ amount, bookingData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirmar el pago
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/reservas-apertura?payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        if (onError) {
          onError(error);
        }
        toast({
          title: "Error en el pago",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: "¡Pago exitoso!",
          description: "Tu reserva ha sido confirmada",
          duration: 5000,
        });
        if (onSuccess) {
          onSuccess(paymentIntent);
        }
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setErrorMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      if (onError) {
        onError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Total a pagar:</span>
          <span className="text-3xl font-bold text-purple-700">
            ${amount.toFixed(2)} USD
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Información de Pago</h3>
        </div>
        
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <Lock className="w-4 h-4" />
        <span>Pago seguro procesado por Stripe</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Procesando pago...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-6 h-6" />
            <span>Confirmar y Pagar ${amount.toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
};

/**
 * StripeCheckout - Componente principal de checkout con Stripe
 */
const StripeCheckout = ({ 
  amount, 
  bookingData, 
  clientSecret, 
  onSuccess, 
  onError,
  onCancel 
}) => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
        <p className="text-gray-600">Preparando sistema de pago...</p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: stripeConfig.appearance,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Completa tu Pago
        </h2>
        <p className="text-gray-600">
          Ingresa los datos de tu tarjeta para confirmar la reserva
        </p>
      </div>

      {stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            amount={amount}
            bookingData={bookingData}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-4 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
        >
          Cancelar
        </button>
      )}
    </div>
  );
};

export default StripeCheckout;

