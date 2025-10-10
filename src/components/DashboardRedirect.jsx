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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Verificar si ya completó el onboarding
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      
      // También verificar en la base de datos si el usuario es nuevo
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at, onboarding_completed')
        .eq('id', user.id)
        .single();

      // Si es un usuario nuevo (menos de 5 minutos desde creación) y no ha completado onboarding
      const isNewUser = profile && 
        (new Date() - new Date(profile.created_at)) < 5 * 60 * 1000 &&
        !profile.onboarding_completed;

      if ((isNewUser || !onboardingCompleted) && onboardingCompleted !== 'true') {
        setShowOnboarding(true);
        setLoading(false);
      } else {
        // Redirigir directamente al dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // En caso de error, redirigir al dashboard
      navigate('/dashboard');
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Marcar onboarding como completado en la base de datos
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
    
    navigate('/dashboard');
  };

  const handleOnboardingSkip = async () => {
    try {
      // Marcar onboarding como completado aunque lo haya saltado
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
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

