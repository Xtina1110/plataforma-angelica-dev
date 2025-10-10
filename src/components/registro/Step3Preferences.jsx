import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Clock, Mail, Phone, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import paisesTraducidos from '../../data/paisesTraducidos';

const Step3Preferences = ({ data, onUpdate, onNext, onBack }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    preferredLanguage: data?.preferredLanguage || 'es',
    country: data?.country || 'España',
    timezone: data?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredContact: data?.preferredContact || 'email'
  });

  const [errors, setErrors] = useState({});

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  const countries = paisesTraducidos['Español'] || [];

  const timezones = [
    { value: 'Europe/Madrid', label: '(GMT+1) Madrid, Barcelona' },
    { value: 'Europe/London', label: '(GMT+0) Londres' },
    { value: 'Europe/Paris', label: '(GMT+1) París' },
    { value: 'Europe/Berlin', label: '(GMT+1) Berlín' },
    { value: 'Europe/Rome', label: '(GMT+1) Roma' },
    { value: 'America/New_York', label: '(GMT-5) Nueva York' },
    { value: 'America/Los_Angeles', label: '(GMT-8) Los Ángeles' },
    { value: 'America/Chicago', label: '(GMT-6) Chicago' },
    { value: 'America/Mexico_City', label: '(GMT-6) Ciudad de México' },
    { value: 'America/Buenos_Aires', label: '(GMT-3) Buenos Aires' },
    { value: 'America/Santiago', label: '(GMT-3) Santiago' },
    { value: 'America/Bogota', label: '(GMT-5) Bogotá' },
    { value: 'Asia/Tokyo', label: '(GMT+9) Tokio' },
    { value: 'Asia/Shanghai', label: '(GMT+8) Shanghái' },
    { value: 'Australia/Sydney', label: '(GMT+10) Sídney' }
  ];

  const contactMethods = [
    { value: 'email', label: 'Email', icon: Mail, description: 'Prefiero comunicación por correo' },
    { value: 'phone', label: 'Teléfono', icon: Phone, description: 'Prefiero llamadas o SMS' },
    { value: 'both', label: 'Ambos', icon: Globe, description: 'Cualquier método está bien' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.preferredLanguage) {
      newErrors.preferredLanguage = 'Selecciona un idioma';
    }

    if (!formData.country) {
      newErrors.country = 'Selecciona un país';
    }

    if (!formData.timezone) {
      newErrors.timezone = 'Selecciona una zona horaria';
    }

    if (!formData.preferredContact) {
      newErrors.preferredContact = 'Selecciona un método de contacto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
          <Globe size={32} className="text-white" />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🌍 Personaliza tu experiencia
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Configura tus preferencias de idioma y comunicación
        </p>
      </div>

      {/* Idioma Preferido */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Idioma Preferido *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: lang.code }))}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.preferredLanguage === lang.code
                  ? 'border-purple-500 bg-purple-500/10'
                  : isDark
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {lang.name}
                </span>
              </div>
            </button>
          ))}
        </div>
        {errors.preferredLanguage && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.preferredLanguage}
          </p>
        )}
      </div>

      {/* País */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          País/Región *
        </label>
        <div className="relative">
          <MapPin size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
              errors.country
                ? 'border-red-500 focus:border-red-600'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        {errors.country && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.country}
          </p>
        )}
      </div>

      {/* Zona Horaria */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Zona Horaria *
        </label>
        <div className="relative">
          <Clock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
              errors.timezone
                ? 'border-red-500 focus:border-red-600'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Detectada automáticamente: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
        {errors.timezone && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.timezone}
          </p>
        )}
      </div>

      {/* Método de Contacto Preferido */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Método de Contacto Preferido *
        </label>
        <div className="space-y-2">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, preferredContact: method.value }))}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  formData.preferredContact === method.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : isDark
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    formData.preferredContact === method.value
                      ? 'bg-purple-500 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {method.label}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {method.description}
                    </div>
                  </div>
                  {formData.preferredContact === method.value && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.preferredContact && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.preferredContact}
          </p>
        )}
      </div>

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
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          Continuar
          <span className="text-lg">→</span>
        </button>
      </div>
    </form>
  );
};

export default Step3Preferences;

