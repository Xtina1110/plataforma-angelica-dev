import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';
import { useTheme } from '../contexts/ThemeContext';
import AuthPageLayout from './AuthPageLayout';
import AngelicParticles from './AngelicParticles';

const EmailVerified = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Obtener el token de la URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'signup') {
          setStatus('error');
          setError('Enlace de verificación inválido');
          return;
        }

        // Verificar el email con Supabase
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (verifyError) {
          throw verifyError;
        }

        // Actualizar el perfil del usuario
        if (data.user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email_verified: true,
              email_verified_date: new Date().toISOString()
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }

        setStatus('success');
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError(err.message || 'Error al verificar el email');
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Countdown para redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/login');
    }
  }, [status, countdown, navigate]);

  const renderContent = () => {
    if (status === 'verifying') {
      return (
        <>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Verificando tu email...
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Por favor espera un momento
          </p>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          {/* Success Icon with Animation */}
          <div className="mb-6 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-bounce">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            {/* Confetti Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${i * 30}deg) translateY(-80px)`
                  }}
                />
              ))}
            </div>
          </div>

          <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ✨ ¡Email Verificado!
          </h1>
          
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Tu cuenta ha sido activada exitosamente
          </p>

          <div className={`p-6 rounded-xl mb-6 ${
            isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <span className="text-4xl">🎉</span>
              </div>
              
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                  ¡Bienvenido a la Familia Angélica!
                </h3>
                <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  Ya puedes iniciar sesión y comenzar tu viaje espiritual
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mb-4"
          >
            Iniciar Sesión
            <ArrowRight size={20} />
          </button>

          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Serás redirigido automáticamente en {countdown} segundos...
          </p>
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full">
              <AlertCircle size={48} className="text-white" />
            </div>
          </div>

          <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Error de Verificación
          </h1>
          
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            No pudimos verificar tu email
          </p>

          <div className={`p-6 rounded-xl mb-6 ${
            isDark ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <span className="text-4xl">⚠️</span>
              </div>
              
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-red-300' : 'text-red-900'}`}>
                  {error || 'Error desconocido'}
                </h3>
                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  El enlace puede haber expirado o ser inválido
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/registro')}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Volver a Registrarse
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Ir al Login
              <ArrowRight size={20} />
            </button>
          </div>
        </>
      );
    }
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
          {renderContent()}
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default EmailVerified;

