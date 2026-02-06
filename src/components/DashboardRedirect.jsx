import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import OnboardingTour from './OnboardingTour';
import { Loader2 } from 'lucide-react';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Verificar si el usuario está autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user or no user found:', userError);
        navigate('/login');
        return;
      }

      console.log('User authenticated:', user.email);

      // Verificar si ya completó el onboarding en localStorage
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      
      // Intentar verificar en la base de datos (con manejo de errores)
      let isNewUser = false;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('created_at, onboarding_completed')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          // Si es un usuario nuevo (menos de 5 minutos desde creación) y no ha completado onboarding
          isNewUser = profile && 
            (new Date() - new Date(profile.created_at)) < 5 * 60 * 1000 &&
            !profile.onboarding_completed;
        } else {
          console.log('Profiles table not found or error:', profileError?.message);
          // Si no existe la tabla profiles, usar solo localStorage
          isNewUser = !onboardingCompleted;
        }
      } catch (dbError) {
        console.log('Database error (expected if profiles table does not exist):', dbError);
        // Si hay error con la BD, usar solo localStorage
        isNewUser = !onboardingCompleted;
      }

      // Mostrar onboarding solo si es usuario nuevo y no lo ha completado
      if ((isNewUser || !onboardingCompleted) && onboardingCompleted !== 'true') {
        console.log('Showing onboarding for new user');
        setShowOnboarding(true);
        setLoading(false);
      } else {
        // Redirigir directamente al dashboard
        console.log('Redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // En caso de error, redirigir al dashboard de todas formas
      navigate('/dashboard');
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Marcar onboarding como completado en localStorage
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Intentar marcar en la base de datos si existe la tabla
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id);
        } catch (dbError) {
          console.log('Could not update profiles table (may not exist):', dbError);
        }
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
    
    navigate('/dashboard');
  };

  const handleOnboardingSkip = async () => {
    try {
      // Marcar onboarding como completado en localStorage aunque lo haya saltado
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Intentar marcar en la base de datos si existe la tabla
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id);
        } catch (dbError) {
          console.log('Could not update profiles table (may not exist):', dbError);
        }
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
    
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Preparando tu experiencia...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <OnboardingTour 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </div>
    );
  }

  return null;
};

export default DashboardRedirect;

