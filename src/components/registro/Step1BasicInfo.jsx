import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../supabase';
import { useTheme } from '../../contexts/ThemeContext';

const Step1BasicInfo = ({ data, onUpdate, onNext }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    birthDate: data?.birthDate || '',
    phone: data?.phone || '',
    phoneCountryCode: data?.phoneCountryCode || '+34'
  });

  const [errors, setErrors] = useState({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [ageValid, setAgeValid] = useState(null);

  // Validar email en tiempo real (debounced)
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && formData.email.includes('@')) {
        setEmailChecking(true);
        
        // Verificar formato
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setEmailAvailable(false);
          setEmailChecking(false);
          return;
        }

        // Verificar si ya existe en DB
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', formData.email)
          .single();

        setEmailAvailable(!existingUser);
        setEmailChecking(false);
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  // Validar edad +18
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setAgeValid(age >= 18);
    }
  }, [formData.birthDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Los apellidos son requeridos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailAvailable) {
      newErrors.email = 'Este email ya está registrado';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    } else if (!ageValid) {
      newErrors.birthDate = 'Debes ser mayor de 18 años';
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full mb-4">
          <User size={32} className="text-white" />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✨ Comencemos tu viaje espiritual
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Cuéntanos un poco sobre ti
        </p>
      </div>

      {/* Nombre y Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Nombre *
          </label>
          <div className="relative">
            <User size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                errors.firstName
                  ? 'border-red-500 focus:border-red-600'
                  : isDark
                  ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                  : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              placeholder="Juan"
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Apellidos *
          </label>
          <div className="relative">
            <User size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                errors.lastName
                  ? 'border-red-500 focus:border-red-600'
                  : isDark
                  ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                  : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              placeholder="García López"
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Correo Electrónico *
        </label>
        <div className="relative">
          <Mail size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all ${
              errors.email
                ? 'border-red-500 focus:border-red-600'
                : emailAvailable === true
                ? 'border-green-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="tu@email.com"
          />
          {emailChecking && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
            </div>
          )}
          {!emailChecking && emailAvailable === true && (
            <CheckCircle2 size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
          )}
          {!emailChecking && emailAvailable === false && (
            <AlertCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
          )}
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.email}
          </p>
        )}
        {!errors.email && emailAvailable === true && (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Email disponible
          </p>
        )}
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Fecha de Nacimiento *
        </label>
        <div className="relative">
          <Calendar size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
              errors.birthDate
                ? 'border-red-500 focus:border-red-600'
                : ageValid === true
                ? 'border-green-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          />
        </div>
        {errors.birthDate && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.birthDate}
          </p>
        )}
        {!errors.birthDate && ageValid === true && (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Edad verificada
          </p>
        )}
      </div>

      {/* Teléfono (opcional) */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Teléfono <span className="text-gray-500 text-xs">(opcional)</span>
        </label>
        <div className="flex gap-2">
          <select
            name="phoneCountryCode"
            value={formData.phoneCountryCode}
            onChange={handleChange}
            className={`w-24 px-3 py-3 rounded-xl border-2 transition-all ${
              isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          >
            <option value="+34">🇪🇸 +34</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+39">🇮🇹 +39</option>
            <option value="+351">🇵🇹 +351</option>
            <option value="+52">🇲🇽 +52</option>
            <option value="+54">🇦🇷 +54</option>
            <option value="+56">🇨🇱 +56</option>
          </select>
          <div className="relative flex-1">
            <Phone size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                  : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              placeholder="612 345 678"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={!emailAvailable || !ageValid}
          className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          Continuar
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* Link a login */}
      <div className="text-center pt-2">
        <a
          href="/login"
          className={`text-sm ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} transition-colors`}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      </div>
    </form>
  );
};

export default Step1BasicInfo;

