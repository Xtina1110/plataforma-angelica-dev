import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Chrome, Facebook, Apple, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SocialLoginCompact = ({ onError }) => {
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

      {/* Botones en una sola línea - solo iconos */}
      <div className="flex gap-2 justify-center">
        {/* Google */}
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={isAnyLoading}
          className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${
            isDark 
              ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
          aria-label="Iniciar sesión con Google"
          title="Google"
        >
          {loading.google ? (
            <Loader2 size={20} className="animate-spin text-blue-600" />
          ) : (
            <Chrome size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleSocialLogin('facebook')}
          disabled={isAnyLoading}
          className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${
            isDark 
              ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
          aria-label="Iniciar sesión con Facebook"
          title="Facebook"
        >
          {loading.facebook ? (
            <Loader2 size={20} className="animate-spin text-blue-700" />
          ) : (
            <Facebook size={20} className="text-blue-700 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Apple */}
        <button
          onClick={() => handleSocialLogin('apple')}
          disabled={isAnyLoading}
          className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${
            isDark 
              ? 'bg-white border-gray-200 hover:bg-gray-100'
              : 'bg-black border-black hover:bg-gray-900'
          }`}
          aria-label="Iniciar sesión con Apple"
          title="Apple"
        >
          {loading.apple ? (
            <Loader2 size={20} className={`animate-spin ${isDark ? 'text-black' : 'text-white'}`} />
          ) : (
            <Apple 
              size={20} 
              className={`group-hover:scale-110 transition-transform ${
                isDark ? 'text-black' : 'text-white'
              }`} 
              fill="currentColor"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialLoginCompact;

