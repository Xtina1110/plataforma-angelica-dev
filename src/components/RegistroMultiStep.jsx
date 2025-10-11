import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Globe, Volume2 } from 'lucide-react';
import AngelicParticles from './AngelicParticles';
import fondoAngelico from '../assets/FondoAngelicoDashboard.png';

// Import steps
import Step1BasicInfo from './registro/Step1BasicInfo';
import Step2Security from './registro/Step2Security';
import Step3Preferences from './registro/Step3Preferences';
import Step4UserType from './registro/Step4UserType';
import Step5Subscription from './registro/Step5Subscription';
import Step6Confirmation from './registro/Step6Confirmation';

const RegistroMultiStep = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 6;

  // Auto-save progress to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('registro_progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.data || {});
        setCurrentStep(parsed.step || 1);
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, []);

  // Save progress on data change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('registro_progress', JSON.stringify({
        step: currentStep,
        data: formData,
        timestamp: new Date().toISOString()
      }));
    }
  }, [formData, currentStep]);

  const handleStepUpdate = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (finalData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const allData = { ...formData, ...finalData };

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: allData.email,
        password: allData.password,
        options: {
          data: {
            first_name: allData.firstName,
            last_name: allData.lastName,
            full_name: `${allData.firstName} ${allData.lastName}`
          },
          emailRedirectTo: `${window.location.origin}/email-verified`
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // 2. Crear perfil en la base de datos
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: allData.email,
          first_name: allData.firstName,
          last_name: allData.lastName,
          full_name: `${allData.firstName} ${allData.lastName}`,
          birth_date: allData.birthDate,
          phone: allData.phone || null,
          phone_country_code: allData.phoneCountryCode || '+34',
          preferred_language: allData.preferredLanguage || 'es',
          country: allData.country || 'España',
          timezone: allData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferred_contact: allData.preferredContact || 'email',
          user_type: allData.userType || 'usuario',
          rol: allData.userType || 'usuario',
          is_therapist: allData.userType === 'terapeuta' || allData.userType === 'centro',
          subscription_plan: allData.subscriptionPlan || 'gratis',
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          billing_cycle: allData.billingCycle || null,
          terms_accepted: allData.termsAccepted,
          terms_accepted_date: new Date().toISOString(),
          privacy_accepted: allData.privacyAccepted,
          privacy_accepted_date: new Date().toISOString(),
          newsletter_subscribed: allData.newsletterSubscribed || false,
          marketing_emails: allData.marketingEmails || false,
          registration_step: 6,
          registration_completed: true,
          registration_completed_date: new Date().toISOString(),
          email_verified: false,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      // 3. Si es terapeuta o centro, crear perfil adicional
      if (allData.userType === 'terapeuta') {
        await supabase.from('therapist_profiles').insert({
          user_id: authData.user.id,
          verified: false,
          available: false
        });
      } else if (allData.userType === 'centro') {
        await supabase.from('organization_profiles').insert({
          user_id: authData.user.id,
          organization_name: `${allData.firstName} ${allData.lastName}`,
          verified: false
        });
      }

      // 4. Si no es plan gratis, crear suscripción
      if (allData.subscriptionPlan !== 'gratis') {
        await supabase.from('subscriptions').insert({
          user_id: authData.user.id,
          plan_id: allData.subscriptionPlan,
          plan_name: allData.subscriptionPlan.charAt(0).toUpperCase() + allData.subscriptionPlan.slice(1),
          amount: 0, // Se actualizará con Stripe
          currency: 'EUR',
          billing_cycle: allData.billingCycle || 'monthly',
          status: 'active',
          start_date: new Date().toISOString()
        });
      }

      // 5. Limpiar localStorage
      localStorage.removeItem('registro_progress');

      // 6. Redirigir a página de verificación
      navigate('/registro-exitoso', {
        state: {
          email: allData.email,
          requiresPayment: allData.subscriptionPlan !== 'gratis',
          plan: allData.subscriptionPlan
        }
      });

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al crear la cuenta. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: handleStepUpdate,
      onNext: handleNext,
      onBack: handleBack
    };

    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...stepProps} />;
      case 2:
        return <Step2Security {...stepProps} />;
      case 3:
        return <Step3Preferences {...stepProps} />;
      case 4:
        return <Step4UserType {...stepProps} />;
      case 5:
        return <Step5Subscription {...stepProps} />;
      case 6:
        return <Step6Confirmation {...stepProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return <Step1BasicInfo {...stepProps} />;
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: 'Información Básica',
      2: 'Seguridad',
      3: 'Preferencias',
      4: 'Tipo de Usuario',
      5: 'Suscripción',
      6: 'Confirmación'
    };
    return titles[currentStep] || '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative overflow-hidden"
         style={{ backgroundImage: `url(${fondoAngelico})` }}>
      
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-violet-900/70 to-indigo-900/70" />
      
      {/* Partículas de fondo */}
      <AngelicParticles />

      {/* Header con iconos de idioma y audio */}
      <div className="relative z-20 flex justify-end items-center p-4 gap-3">
        <button className={`p-3 rounded-xl backdrop-blur-md transition-all ${
          isDark ? 'bg-gray-900/90 hover:bg-gray-800/90' : 'bg-white/90 hover:bg-white'
        } shadow-lg`}>
          <Globe className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <button className={`p-3 rounded-xl backdrop-blur-md transition-all ${
          isDark ? 'bg-gray-900/90 hover:bg-gray-800/90' : 'bg-white/90 hover:bg-white'
        } shadow-lg`}>
          <Volume2 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Contenido principal - Flex grow para ocupar espacio disponible */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-6xl">
          {/* Progress Bar Compacto */}
          <div className="mb-3">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-purple-600 text-white ring-2 ring-purple-600/30'
                        : 'bg-white/20 text-white/50'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 6 && (
                    <div className={`w-8 h-0.5 rounded-full transition-all ${
                      step < currentStep ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Progress Text */}
            <div className="text-center">
              <p className="text-xs text-white/90">
                Paso {currentStep} de {totalSteps}: <span className="font-semibold">{getStepTitle()}</span>
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-2 p-2 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Step Content - Compacto */}
          <div className={`p-4 rounded-2xl backdrop-blur-md ${
            isDark ? 'bg-gray-900/95' : 'bg-white/95'
          } shadow-2xl max-h-[calc(100vh-280px)] overflow-y-auto`}>
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-3 text-center">
        <p className="text-xs text-white/70">
          ¿Necesitas ayuda?{' '}
          <a href="mailto:soporte@plataforma-angelica.com" className="text-purple-300 hover:text-purple-200 underline">
            soporte@plataforma-angelica.com
          </a>
        </p>
        <p className="text-xs text-white/50 mt-1">
          © 2025 Plataforma Angélica. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default RegistroMultiStep;

