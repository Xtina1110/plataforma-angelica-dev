import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Chrome, Facebook, Loader2 } from 'lucide-react';

const SocialLogin = ({ onError }) => {
  const [loading, setLoading] = useState({ google: false, facebook: false });

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
        onError(`Error al iniciar sesión con ${provider === 'google' ? 'Google' : 'Facebook'}`);
        setLoading(prev => ({ ...prev, [provider]: false }));
      }
      // Si no hay error, el usuario será redirigido automáticamente
    } catch (err) {
      onError(`Error inesperado al iniciar sesión con ${provider === 'google' ? 'Google' : 'Facebook'}`);
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="space-y-2">
      {/* Divider compacto */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-600 font-medium">O continúa con</span>
        </div>
      </div>

      {/* Botón de Google compacto */}
      <button
        onClick={() => handleSocialLogin('google')}
        disabled={loading.google || loading.facebook}
        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
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
        disabled={loading.google || loading.facebook}
        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
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
    </div>
  );
};

export default SocialLogin;

