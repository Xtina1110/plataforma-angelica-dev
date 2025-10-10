import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Step2Security = ({ data, onUpdate, onNext, onBack }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    password: data?.password || '',
    confirmPassword: data?.confirmPassword || ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  // Calcular fortaleza de contraseña
  useEffect(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let label = '';
    let color = '';
    
    if (score === 0) {
      label = '';
      color = '';
    } else if (score <= 2) {
      label = 'Débil';
      color = 'red';
    } else if (score === 3) {
      label = 'Media';
      color = 'yellow';
    } else if (score === 4) {
      label = 'Fuerte';
      color = 'green';
    } else {
      label = 'Muy Fuerte';
      color = 'emerald';
    }

    setPasswordStrength({ score, label, color, checks });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'La contraseña debe ser al menos media';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

  const getStrengthBarWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  const getStrengthBarColor = () => {
    const colors = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500'
    };
    return colors[passwordStrength.color] || 'bg-gray-300';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mb-4">
          <Shield size={32} className="text-white" />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔐 Protege tu espacio sagrado
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Crea una contraseña segura para tu cuenta
        </p>
      </div>

      {/* Contraseña */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Contraseña *
        </label>
        <div className="relative">
          <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all ${
              errors.password
                ? 'border-red-500 focus:border-red-600'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        {/* Indicador de fortaleza */}
        {formData.password && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Fortaleza:
              </span>
              <span className={`font-semibold ${
                passwordStrength.color === 'red' ? 'text-red-500' :
                passwordStrength.color === 'yellow' ? 'text-yellow-500' :
                passwordStrength.color === 'green' ? 'text-green-500' :
                passwordStrength.color === 'emerald' ? 'text-emerald-500' :
                'text-gray-500'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-full transition-all duration-300 ${getStrengthBarColor()}`}
                style={{ width: getStrengthBarWidth() }}
              />
            </div>
          </div>
        )}

        {/* Requisitos */}
        {formData.password && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              {passwordStrength.checks.length ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              )}
              <span className={passwordStrength.checks.length ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}>
                Mínimo 8 caracteres
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {passwordStrength.checks.uppercase ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              )}
              <span className={passwordStrength.checks.uppercase ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}>
                Una mayúscula
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {passwordStrength.checks.lowercase ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              )}
              <span className={passwordStrength.checks.lowercase ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}>
                Una minúscula
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {passwordStrength.checks.number ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              )}
              <span className={passwordStrength.checks.number ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}>
                Un número
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {passwordStrength.checks.special ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              )}
              <span className={passwordStrength.checks.special ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}>
                Un carácter especial (!@#$%...)
              </span>
            </div>
          </div>
        )}

        {errors.password && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Confirmar Contraseña *
        </label>
        <div className="relative">
          <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all ${
              errors.confirmPassword
                ? 'border-red-500 focus:border-red-600'
                : formData.confirmPassword && formData.password === formData.confirmPassword
                ? 'border-green-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:border-purple-500 text-white'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {formData.confirmPassword && formData.password === formData.confirmPassword && (
          <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Las contraseñas coinciden
          </p>
        )}
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.confirmPassword}
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
          disabled={passwordStrength.score < 3 || formData.password !== formData.confirmPassword}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          Continuar
          <span className="text-lg">→</span>
        </button>
      </div>
    </form>
  );
};

export default Step2Security;

