import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { subscriptionPlans } from '../data/subscriptionPlans';

const PlanComparison = ({ selectedPlan, onSelectPlan }) => {
  const { isDark } = useTheme();
  const [showComparison, setShowComparison] = useState(false);

  const plans = Object.values(subscriptionPlans);

  // All possible features across all plans
  const allFeatures = [
    { id: 'consultations', name: 'Consultas mensuales', key: 'consultations' },
    { id: 'online_sessions', name: 'Sesiones en línea', key: 'onlineSessions' },
    { id: 'meditations', name: 'Meditaciones guiadas', key: 'meditations' },
    { id: 'workshops', name: 'Talleres y eventos', key: 'workshops' },
    { id: 'daily_message', name: 'Mensaje del día', key: 'dailyMessage' },
    { id: 'community', name: 'Acceso a comunidad', key: 'community' },
    { id: 'priority_support', name: 'Soporte prioritario', key: 'prioritySupport' },
    { id: 'advanced_analytics', name: 'Analytics avanzado', key: 'advancedAnalytics' },
    { id: 'custom_branding', name: 'Branding personalizado', key: 'customBranding' },
    { id: 'api_access', name: 'Acceso API', key: 'apiAccess' },
    { id: 'dedicated_manager', name: 'Account manager dedicado', key: 'dedicatedManager' }
  ];

  const getFeatureValue = (plan, featureKey) => {
    // Check in features array
    const feature = plan.features.find(f => 
      f.toLowerCase().includes(featureKey.toLowerCase()) ||
      featureKey.toLowerCase().includes(f.toLowerCase())
    );
    
    if (feature) {
      // Extract number if present
      const match = feature.match(/\d+/);
      return match ? match[0] : true;
    }
    
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShowComparison(!showComparison)}
        className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
          isDark
            ? 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <Info size={18} />
        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {showComparison ? 'Ocultar' : 'Ver'} comparación detallada de planes
        </span>
      </button>

      {/* Comparison Table */}
      {showComparison && (
        <div className="overflow-x-auto rounded-xl border-2 border-purple-500/20">
          <table className="w-full">
            <thead>
              <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                <th className={`p-3 text-left text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Característica
                </th>
                {plans.map(plan => (
                  <th
                    key={plan.id}
                    className={`p-3 text-center text-sm font-bold ${
                      selectedPlan === plan.id
                        ? 'bg-purple-500/20'
                        : ''
                    } ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{plan.name}</span>
                      <span className="text-xs font-normal opacity-70">
                        {plan.id === 'gratis' ? 'Gratis' : `${plan.priceMonthly}€/mes`}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, index) => (
                <tr
                  key={feature.id}
                  className={`border-t ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  } ${index % 2 === 0 ? (isDark ? 'bg-gray-800/30' : 'bg-white') : ''}`}
                >
                  <td className={`p-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature.name}
                  </td>
                  {plans.map(plan => {
                    const value = getFeatureValue(plan, feature.key);
                    return (
                      <td
                        key={plan.id}
                        className={`p-3 text-center ${
                          selectedPlan === plan.id ? 'bg-purple-500/10' : ''
                        }`}
                      >
                        {value === true ? (
                          <Check size={18} className="text-green-500 mx-auto" />
                        ) : value === false ? (
                          <X size={18} className="text-gray-400 mx-auto" />
                        ) : (
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Comparison Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {plans.map(plan => (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelectPlan(plan.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedPlan === plan.id
                ? 'border-purple-500 bg-purple-500/10 shadow-lg'
                : isDark
                ? 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
          >
            <div className="text-center space-y-2">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h4>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {plan.id === 'gratis' ? (
                  'Gratis'
                ) : (
                  <>
                    {plan.priceMonthly}€
                    <span className="text-xs font-normal opacity-70">/mes</span>
                  </>
                )}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.features.length} características
              </div>
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  POPULAR
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlanComparison;

