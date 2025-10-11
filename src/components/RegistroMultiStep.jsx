import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { UserPlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';

// Import steps
import Step1BasicInfo from './registro/Step1BasicInfo';
import Step2Security from './registro/Step2Security';
import Step3Preferences from './registro/Step3Preferences';
import Step4UserType from './registro/Step4UserType';
import Step5Subscription from './registro/Step5Subscription';
import Step6Confirmation from './registro/Step6Confirmation';

// Imagen temática para registro
const registroHeaderImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop';

const RegistroMultiStep = () => {
  const navigate = useNavigate();
  const { getCurrentTranslation } = useLanguage();
  const translation = getCurrentTranslation();
  
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
    <>
      {/* Efecto de luz divina desde arriba - igual que login */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-200/20 via-purple-200/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Botones de idioma y audio - igual que login */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3">
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>

      <AuthPageLayout
        title={translation.registerPage?.title || "Registro"}
        headerImage={registroHeaderImage}
        icon={UserPlus}
        maxWidth="max-w-6xl"
      >
        {/* Contenido del registro con ancho ampliado */}
        <div className="max-w-6xl mx-auto relative">
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
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 6 && (
                    <div className={`w-8 h-0.5 rounded-full transition-all ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Progress Text */}
            <div className="text-center">
              <p className="text-xs text-gray-700">
                Paso {currentStep} de {totalSteps}: <span className="font-semibold">{getStepTitle()}</span>
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border-2 border-red-400 rounded-xl">
              <p className="text-red-800 text-sm flex items-center gap-2 font-semibold">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white/50 rounded-xl p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
            {renderStep()}
          </div>
        </div>
      </AuthPageLayout>
    </>
  );
};

export default RegistroMultiStep;

