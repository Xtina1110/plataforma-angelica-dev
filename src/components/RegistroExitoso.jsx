import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase';
import { useTheme } from '../contexts/ThemeContext';
import AuthPageLayout from './AuthPageLayout';
import AngelicParticles from './AngelicParticles';

const RegistroExitoso = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { email, requiresPayment, plan } = location.state || {};
  
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Redirect countdown
  useEffect(() => {
    if (!requiresPayment && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!requiresPayment && countdown === 0) {
      navigate('/login');
    }
  }, [countdown, requiresPayment, navigate]);

  const handleResendEmail = async () => {
    setResendingEmail(true);
    setEmailResent(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;

      setEmailResent(true);
      setTimeout(() => setEmailResent(false), 5000);
    } catch (err) {
      console.error('Error resending email:', err);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthPageLayout>
      {/* Partículas de fondo */}
      <AngelicParticles />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className={`p-8 rounded-2xl backdrop-blur-md ${
          isDark ? 'bg-gray-900/95' : 'bg-white/95'
        } shadow-2xl text-center`}>
          {/* Success Icon with Animation */}
          <div className="mb-6 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-bounce">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            {/* Confetti Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${i * 45}deg) translateY(-60px)`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🎉 ¡Bienvenido a la Familia Angélica!
          </h1>

          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Tu cuenta ha sido creada exitosamente
          </p>

          {/* Email Verification Section */}
          <div className={`p-6 rounded-xl mb-6 ${
            isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Mail size={32} className="text-blue-500" />
              </div>
              
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                  Verifica tu correo electrónico
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Hemos enviado un email de verificación a:
                </p>
                <p className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {email}
                </p>
                <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Por favor, revisa tu bandeja de entrada y haz click en el enlace de verificación para activar tu cuenta.
                </p>
              </div>

              {/* Resend Email Button */}
              <button
                onClick={handleResendEmail}
                disabled={resendingEmail || emailResent}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  emailResent
                    ? 'bg-green-500 text-white'
                    : isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {resendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : emailResent ? (
                  <>
                    <CheckCircle2 size={20} />
                    Email Reenviado
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    Reenviar Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Payment Section (if required) */}
          {requiresPayment && (
            <div className={`p-6 rounded-xl mb-6 ${
              isDark ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                  <span className="text-4xl">💳</span>
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-900'}`}>
                    Configura tu método de pago
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    Has seleccionado el plan <strong>{plan}</strong>. Para activarlo, necesitas configurar tu método de pago.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/configurar-pago', { state: { email, plan } })}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Configurar Pago
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className={`p-6 rounded-xl mb-6 ${
            isDark ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
              📋 Próximos pasos
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  1
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Verifica tu email haciendo click en el enlace que te enviamos
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  2
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {requiresPayment ? 'Configura tu método de pago' : 'Inicia sesión en tu cuenta'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  3
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Completa tu perfil y comienza tu viaje espiritual
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToLogin}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Ir al Login
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Auto-redirect countdown */}
          {!requiresPayment && (
            <p className={`text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Serás redirigido al login en {countdown} segundos...
            </p>
          )}

          {/* Help */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              ¿No recibiste el email?{' '}
              <button
                onClick={handleResendEmail}
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Reenviar
              </button>
              {' '}o revisa tu carpeta de spam
            </p>
          </div>
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default RegistroExitoso;

