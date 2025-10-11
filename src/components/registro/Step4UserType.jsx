import React, { useState } from 'react';
import { User, Heart, Building, Shield, Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { userTypes } from '../../data/subscriptionPlans';

const Step4UserType = ({ data, onUpdate, onNext, onBack }) => {
  const { isDark } = useTheme();
  const [selectedType, setSelectedType] = useState(data?.userType || '');
  const [errors, setErrors] = useState({});

  const userTypesList = [
    {
      ...userTypes.usuario,
      icon: User,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      ...userTypes.terapeuta,
      icon: Heart,
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      ...userTypes.centro,
      icon: Building,
      gradient: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'administrador',
      name: 'Administrador',
      description: 'Gestión completa de la plataforma',
      features: [
        'Acceso total al sistema',
        'Gestión de usuarios',
        'Configuración de plataforma',
        'Reportes y analytics'
      ],
      icon: Shield,
      gradient: 'from-red-500 to-rose-600'
    },
    {
      id: 'servicio_tecnico',
      name: 'Servicio Técnico',
      description: 'Soporte técnico y mantenimiento',
      features: [
        'Soporte a usuarios',
        'Resolución de incidencias',
        'Mantenimiento del sistema',
        'Monitoreo de plataforma'
      ],
      icon: Wrench,
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  const validate = () => {
    const newErrors = {};

    if (!selectedType) {
      newErrors.userType = 'Selecciona un tipo de usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onUpdate({ userType: selectedType });
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-4">
          <User size={32} className="text-white" />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          👤 ¿Cómo usarás la plataforma?
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Selecciona el tipo de cuenta que mejor se adapte a ti
        </p>
      </div>

      {/* Opciones de tipo de usuario */}
      <div className="space-y-3">
        {userTypesList.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setSelectedType(type.id);
                if (errors.userType) {
                  setErrors({});
                }
              }}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg'
                  : isDark
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl bg-gradient-to-br ${type.gradient} flex-shrink-0`}>
                  <Icon size={28} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {type.name}
                    </h4>
                    {isSelected && (
                      <CheckCircle2 size={24} className="text-purple-500" />
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {type.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-purple-500' : isDark ? 'bg-gray-600' : 'bg-gray-400'
                        }`} />
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Verification badge */}
                  {type.requiresVerification && (
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <Shield size={12} />
                      Requiere verificación
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {errors.userType && (
        <p className="text-red-500 text-sm flex items-center justify-center gap-1">
          <AlertCircle size={16} />
          {errors.userType}
        </p>
      )}

      {/* Info adicional */}
      {selectedType && (
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <span className="text-lg">💡</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                {selectedType === 'usuario' && '¿Sabías que...?'}
                {selectedType === 'terapeuta' && 'Información importante'}
                {selectedType === 'centro' && 'Beneficios Enterprise'}
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                {selectedType === 'usuario' && 'Puedes actualizar a terapeuta en cualquier momento desde tu perfil.'}
                {selectedType === 'terapeuta' && 'Tu perfil será revisado por nuestro equipo antes de ser visible públicamente.'}
                {selectedType === 'centro' && 'Tendrás acceso a gestión de equipo, branding personalizado y soporte dedicado.'}
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
          disabled={!selectedType}
          className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          Continuar
          <span className="text-lg">→</span>
        </button>
      </div>
    </form>
  );
};

export default Step4UserType;

