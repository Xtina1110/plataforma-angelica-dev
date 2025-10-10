import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Chrome, Facebook, Apple, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SocialLoginWithApple = ({ onError }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState({ 
    google: false, 
    facebook: false, 
    apple: false 
  });

  const handleSocialLogin = async (provider) => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard-redirect`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        const providerNames = {
          google: 'Google',
          facebook: 'Facebook',
          apple: 'Apple'
        };
        onError(`Error al iniciar sesión con ${providerNames[provider]}`);
        setLoading(prev => ({ ...prev, [provider]: false }));
      }
      // Si no hay error, el usuario será redirigido automáticamente
    } catch (err) {
      const providerNames = {
        google: 'Google',
        facebook: 'Facebook',
        apple: 'Apple'
      };
      onError(`Error inesperado al iniciar sesión con ${providerNames[provider]}`);
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const isAnyLoading = loading.google || loading.facebook || loading.apple;

  return (
    <div className="space-y-2">
      {/* Divider compacto */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${
            isDark ? 'border-gray-600' : 'border-gray-200'
          }`}></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className={`px-3 font-medium ${
            isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
          }`}>
            O continúa con
          </span>
        </div>
      </div>

      {/* Botón de Google compacto */}
      <button
        onClick={() => handleSocialLogin('google')}
        disabled={isAnyLoading}
        className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 border-2 rounded-xl hover:shadow-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed group ${
          isDark 
            ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white'
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
        }`}
        aria-label="Iniciar sesión con Google"
      >
        {loading.google ? (
          <Loader2 size={16} className="animate-spin text-blue-600" />
        ) : (
          <Chrome size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
        )}
        <span className="text-xs">
          {loading.google ? 'Conectando...' : 'Continuar con Google'}
        </span>
      </button>

      {/* Botón de Facebook compacto */}
      <button
        onClick={() => handleSocialLogin('facebook')}
        disabled={isAnyLoading}
        className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 border-2 rounded-xl hover:shadow-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed group ${
          isDark 
            ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white'
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
        }`}
        aria-label="Iniciar sesión con Facebook"
      >
        {loading.facebook ? (
          <Loader2 size={16} className="animate-spin text-blue-700" />
        ) : (
          <Facebook size={16} className="text-blue-700 group-hover:scale-110 transition-transform" />
        )}
        <span className="text-xs">
          {loading.facebook ? 'Conectando...' : 'Continuar con Facebook'}
        </span>
      </button>

      {/* Botón de Apple compacto */}
      <button
        onClick={() => handleSocialLogin('apple')}
        disabled={isAnyLoading}
        className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 border-2 rounded-xl hover:shadow-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed group ${
          isDark 
            ? 'bg-white border-gray-200 hover:bg-gray-100 text-black'
            : 'bg-black border-black hover:bg-gray-900 text-white'
        }`}
        aria-label="Iniciar sesión con Apple"
      >
        {loading.apple ? (
          <Loader2 size={16} className={`animate-spin ${isDark ? 'text-black' : 'text-white'}`} />
        ) : (
          <Apple 
            size={16} 
            className={`group-hover:scale-110 transition-transform ${
              isDark ? 'text-black' : 'text-white'
            }`} 
            fill="currentColor"
          />
        )}
        <span className="text-xs">
          {loading.apple ? 'Conectando...' : 'Continuar con Apple'}
        </span>
      </button>
    </div>
  );
};

export default SocialLoginWithApple;

