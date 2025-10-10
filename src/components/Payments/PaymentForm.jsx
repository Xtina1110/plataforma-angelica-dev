import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { usePayments } from '@/hooks/usePayments';
import { Lock, CreditCard } from 'lucide-react';
import AngelicalModal from '../AngelicalModal';

const PaymentForm = ({ planId, amount, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'ES'
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { processStripePayment } = usePayments();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const result = await processStripePayment({
        planId,
        amount,
        paymentData: formData
      });
      
      if (result.success) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      setErrorMessage(error.message || 'Error al procesar el pago. Por favor, verifica tus datos e intenta nuevamente.');
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <>
      <AngelicalModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error en el Pago"
        message={errorMessage}
        type="error"
        autoClose={false}
      />
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Pago Seguro</h2>
        <p className="text-gray-600">
          Total a pagar: <span className="text-2xl font-bold text-blue-600">${amount}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de Tarjeta
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            maxLength="19"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Exp.
            </label>
            <input
              type="text"
              placeholder="MM/AA"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              maxLength="5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              maxLength="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del Titular
          </label>
          <input
            type="text"
            placeholder="Nombre Apellido"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Dirección de Facturación
          </label>
          <input
            type="text"
            placeholder="Calle y número"
            value={formData.billingAddress.street}
            onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ciudad"
              value={formData.billingAddress.city}
              onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={formData.billingAddress.postalCode}
              onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando...' : `Pagar $${amount}`}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <span>Pago seguro encriptado con SSL</span>
      </div>
    </div>
    </>
  );
};

export default PaymentForm;