/**
 * AuthCallback - Componente para manejar el callback de autenticación de Supabase
 * Se usa cuando Supabase redirige después de login con OAuth o confirmación de email
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback - Processing authentication callback...');
        
        // Obtener la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthCallback - Session error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          console.log('AuthCallback - Session found:', session.user.email);
          
          // Verificar si el usuario existe en la tabla usuarios
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError && userError.code === 'PGRST116') {
            // Usuario no existe en la tabla, crear registro
            console.log('AuthCallback - Creating user record...');
            
            const { error: insertError } = await supabase
              .from('usuarios')
              .insert({
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name || session.user.email.split('@')[0],
                last_name: session.user.user_metadata?.last_name || '',
                full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                rol: 'usuario',
                spiritual_level: 'Iniciado',
                light_points: 0,
                total_sessions: 0
              });

            if (insertError) {
              console.error('AuthCallback - Error creating user:', insertError);
            }
          }

          // Redirigir a dashboard-redirect para verificar onboarding
          console.log('AuthCallback - Redirecting to dashboard-redirect for onboarding check...');
          navigate('/dashboard-redirect', { replace: true });
        } else {
          console.log('AuthCallback - No session found, redirecting to login...');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('AuthCallback - Unexpected error:', err);
        setError('Error inesperado al procesar la autenticación');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      <div className="text-center">
        {error ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <div className="text-red-400 text-xl mb-4">❌ Error de Autenticación</div>
            <p className="text-white/80 mb-4">{error}</p>
            <p className="text-white/60 text-sm">Redirigiendo al login...</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <Loader2 className="w-16 h-16 text-purple-300 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Autenticando...</h2>
            <p className="text-white/80">Por favor espera mientras procesamos tu sesión</p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

