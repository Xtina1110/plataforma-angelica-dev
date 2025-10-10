import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Heart, Calendar, MessageCircle, Shield, Check } from 'lucide-react';
import angelSinFondo from '../assets/AngelEleganteSinFondo.png';

const OnboardingTour = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Sparkles,
      title: '¡Bienvenido a la Plataforma Angélica!',
      description: 'Un espacio sagrado donde la espiritualidad y la tecnología se encuentran para guiarte en tu camino de sanación y crecimiento personal.',
      image: angelSinFondo,
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Calendar,
      title: 'Reserva tus Consultas',
      description: 'Agenda sesiones con terapeutas especializados en diferentes áreas: tarot, astrología, reiki, y más. Elige el horario que mejor se adapte a ti.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: MessageCircle,
      title: 'Consultas en Línea',
      description: 'Conéctate con tu terapeuta a través de videollamadas seguras. Disfruta de traducción en tiempo real y grabación de sesiones para tu crecimiento.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Heart,
      title: 'Explora Nuestras Terapias',
      description: 'Descubre sonoterapia, apertura angélica, meditaciones guiadas y más. Cada experiencia está diseñada para elevar tu vibración espiritual.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Shield,
      title: 'Tu Privacidad es Sagrada',
      description: 'Todas tus sesiones y datos personales están protegidos con encriptación de nivel empresarial. Tu viaje espiritual es completamente confidencial.',
      color: 'from-yellow-500 to-amber-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingCompleted', 'true');
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkipTour = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingCompleted', 'true');
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Modal principal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header con gradiente dinámico */}
        <div className={`relative h-48 bg-gradient-to-br ${currentStepData.color} overflow-hidden`}>
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleSkipTour}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            aria-label="Cerrar tour"
          >
            <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Icono o imagen del paso */}
          <div className="relative h-full flex items-center justify-center">
            {currentStep === 0 && currentStepData.image ? (
              <img 
                src={currentStepData.image} 
                alt="Ángel guardián"
                className="h-40 w-40 object-contain drop-shadow-2xl animate-float"
              />
            ) : (
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <IconComponent size={48} className="text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {/* Título */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            {currentStepData.title}
          </h2>

          {/* Descripción */}
          <p className="text-gray-600 text-center leading-relaxed mb-8 text-lg">
            {currentStepData.description}
          </p>

          {/* Indicadores de progreso */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-gradient-to-r ' + currentStepData.color
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir al paso ${index + 1}`}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between gap-4">
            {/* Botón anterior */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Paso anterior"
            >
              <ChevronLeft size={20} />
              <span>Anterior</span>
            </button>

            {/* Botón saltar (solo en primeros pasos) */}
            {!isLastStep && (
              <button
                onClick={handleSkipTour}
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                aria-label="Saltar tour"
              >
                Saltar tour
              </button>
            )}

            {/* Botón siguiente/finalizar */}
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${currentStepData.color}`}
              aria-label={isLastStep ? 'Finalizar tour' : 'Siguiente paso'}
            >
              <span>{isLastStep ? '¡Comenzar!' : 'Siguiente'}</span>
              {isLastStep ? <Check size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;

