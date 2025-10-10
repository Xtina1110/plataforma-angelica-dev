import React, { useState } from 'react';
import { Crown, Sparkles, Zap, Star, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { subscriptionPlans, userTypes } from '../../data/subscriptionPlans';

const Step5Subscription = ({ data, onUpdate, onNext, onBack }) => {
  const { isDark } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState(data?.subscriptionPlan || 'gratis');
  const [billingCycle, setBillingCycle] = useState(data?.billingCycle || 'monthly');
  const [errors, setErrors] = useState({});

  // Obtener planes disponibles según tipo de usuario
  const userType = data?.userType || 'usuario';
  const availablePlans = userTypes[userType]?.availablePlans || ['gratis', 'premium', 'pro'];

  const plansList = Object.values(subscriptionPlans).filter(plan => 
    availablePlans.includes(plan.id)
  );

  const getIconForPlan = (planId) => {
    const icons = {
      gratis: Sparkles,
      premium: Star,
      pro: Zap,
      enterprise: Crown
    };
    return icons[planId] || Sparkles;
  };

  const getPrice = (plan) => {
    if (plan.id === 'gratis') return 'Gratis';
    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const perMonth = billingCycle === 'yearly' ? (price / 12).toFixed(2) : price;
    return (
      <div>
        <span className="text-3xl font-bold">{perMonth}€</span>
        <span className="text-sm">/mes</span>
        {billingCycle === 'yearly' && (
          <div className="text-xs text-green-500 mt-1">
            Ahorra {((plan.priceMonthly * 12 - plan.priceYearly).toFixed(2))}€/año
          </div>
        )}
      </div>
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedPlan) {
      newErrors.plan = 'Selecciona un plan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onUpdate({ 
        subscriptionPlan: selectedPlan,
        billingCycle: selectedPlan === 'gratis' ? null : billingCycle
      });
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full mb-4">
          <Crown size={32} className="text-white" />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✨ Elige tu plan
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Selecciona el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      {/* Billing Cycle Toggle (solo si no es gratis) */}
      {selectedPlan !== 'gratis' && (
        <div className="flex justify-center mb-6">
          <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plansList.map((plan) => {
          const Icon = getIconForPlan(plan.id);
          const isSelected = selectedPlan === plan.id;
          const isPremium = plan.id === 'premium';
          
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setSelectedPlan(plan.id);
                if (errors.plan) {
                  setErrors({});
                }
              }}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10 shadow-xl scale-105'
                  : isDark
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${isPremium ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MÁS POPULAR
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} mb-4`}>
                <Icon size={24} className="text-white" />
              </div>

              {/* Plan Name */}
              <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h4>

              {/* Price */}
              <div className={`mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {getPrice(plan)}
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        isDark ? 'border-gray-600' : 'border-gray-300'
                      }`} />
                    )}
                    <span className={`text-xs ${
                      feature.included 
                        ? isDark ? 'text-gray-300' : 'text-gray-700'
                        : isDark ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {feature.name}
                      {feature.limit && (
                        <span className="text-xs ml-1">({feature.limit})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check size={20} className="text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {errors.plan && (
        <p className="text-red-500 text-sm flex items-center justify-center gap-1">
          <AlertCircle size={16} />
          {errors.plan}
        </p>
      )}

      {/* Payment Info */}
      {selectedPlan !== 'gratis' && (
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <span className="text-lg">💳</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                Pago seguro con Stripe
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                En el siguiente paso configurarás tu método de pago. Puedes cancelar en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Free Plan Info */}
      {selectedPlan === 'gratis' && (
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <span className="text-lg">✨</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                Comienza gratis
              </p>
              <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                No se requiere tarjeta de crédito. Puedes actualizar tu plan en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ← Atrás
        </button>
        <button
          type="submit"
          disabled={!selectedPlan}
          className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {selectedPlan === 'gratis' ? 'Continuar Gratis' : 'Continuar al Pago'}
          <span className="text-lg">→</span>
        </button>
      </div>
    </form>
  );
};

export default Step5Subscription;

