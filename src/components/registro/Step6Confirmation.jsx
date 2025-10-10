import React, { useState } from 'react';
import { CheckCircle2, Shield, Mail, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Step6Confirmation = ({ data, onUpdate, onSubmit, onBack, isSubmitting }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    termsAccepted: data?.termsAccepted || false,
    privacyAccepted: data?.privacyAccepted || false,
    newsletterSubscribed: data?.newsletterSubscribed || false,
    marketingEmails: data?.marketingEmails || false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'Debes aceptar la política de privacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      onUpdate(formData);
      await onSubmit({ ...data, ...formData });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎉 ¡Casi listo!
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Revisa tu información y completa el registro
        </p>
      </div>

      {/* Resumen de Información */}
      <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Resumen de tu cuenta
        </h4>
        
        <div className="space-y-3">
          {/* Nombre */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Nombre completo:
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data?.firstName} {data?.lastName}
            </span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Email:
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data?.email}
            </span>
          </div>

          {/* Tipo de Usuario */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Tipo de cuenta:
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data?.userType === 'usuario' && '👤 Usuario'}
              {data?.userType === 'terapeuta' && '🧘 Terapeuta'}
              {data?.userType === 'centro' && '🏢 Centro/Organización'}
            </span>
          </div>

          {/* Plan */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Plan:
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data?.subscriptionPlan === 'gratis' && '🌟 Gratis'}
              {data?.subscriptionPlan === 'premium' && '✨ Premium'}
              {data?.subscriptionPlan === 'pro' && '💎 Pro'}
              {data?.subscriptionPlan === 'enterprise' && '👑 Enterprise'}
            </span>
          </div>

          {/* Idioma */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Idioma:
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data?.preferredLanguage === 'es' && '🇪🇸 Español'}
              {data?.preferredLanguage === 'en' && '🇬🇧 English'}
              {data?.preferredLanguage === 'fr' && '🇫🇷 Français'}
              {data?.preferredLanguage === 'de' && '🇩🇪 Deutsch'}
              {data?.preferredLanguage === 'it' && '🇮🇹 Italiano'}
              {data?.preferredLanguage === 'pt' && '🇵🇹 Português'}
            </span>
          </div>
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div className="space-y-4">
        {/* Términos */}
        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all ${
          errors.termsAccepted
            ? 'bg-red-500/10 border-2 border-red-500'
            : isDark
            ? 'hover:bg-gray-800'
            : 'hover:bg-gray-50'
        }`}>
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleChange('termsAccepted', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Acepto los{' '}
              <a
                href="/terminos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Términos y Condiciones
              </a>
              {' '}de uso de la plataforma *
            </span>
            {errors.termsAccepted && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.termsAccepted}
              </p>
            )}
          </div>
        </label>

        {/* Privacidad */}
        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all ${
          errors.privacyAccepted
            ? 'bg-red-500/10 border-2 border-red-500'
            : isDark
            ? 'hover:bg-gray-800'
            : 'hover:bg-gray-50'
        }`}>
          <input
            type="checkbox"
            checked={formData.privacyAccepted}
            onChange={(e) => handleChange('privacyAccepted', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Acepto la{' '}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Política de Privacidad
              </a>
              {' '}y el tratamiento de mis datos personales *
            </span>
            {errors.privacyAccepted && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.privacyAccepted}
              </p>
            )}
          </div>
        </label>

        {/* Newsletter */}
        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
        }`}>
          <input
            type="checkbox"
            checked={formData.newsletterSubscribed}
            onChange={(e) => handleChange('newsletterSubscribed', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Quiero recibir el newsletter con mensajes de inspiración y novedades
            </span>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Puedes cancelar tu suscripción en cualquier momento
            </p>
          </div>
        </label>

        {/* Marketing */}
        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
        }`}>
          <input
            type="checkbox"
            checked={formData.marketingEmails}
            onChange={(e) => handleChange('marketingEmails', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Acepto recibir ofertas especiales y promociones
            </span>
          </div>
        </label>
      </div>

      {/* Seguridad Info */}
      <div className={`p-4 rounded-xl ${
        isDark ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
      }`}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Shield size={24} className="text-purple-500" />
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
              Tu privacidad es sagrada
            </p>
            <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              Tus datos están protegidos con encriptación de nivel bancario. Nunca compartiremos tu información sin tu consentimiento.
            </p>
          </div>
        </div>
      </div>

      {/* Email Verification Info */}
      <div className={`p-4 rounded-xl ${
        isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Mail size={24} className="text-blue-500" />
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
              Verificación de email
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              Te enviaremos un email de verificación a <strong>{data?.email}</strong>. Por favor, revisa tu bandeja de entrada.
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          ← Atrás
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.termsAccepted || !formData.privacyAccepted}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creando tu cuenta...
            </>
          ) : (
            <>
              Crear mi Cuenta
              <CheckCircle2 size={20} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step6Confirmation;

