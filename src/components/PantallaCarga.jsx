
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LogoAngelico from './LogoAngelico';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';
import FooterLegal from './FooterLegal';
import loadingMessagesService from '../services/loadingMessagesService';
import fondo from '../assets/FondoPantalladeCargavf.png';

const PantallaCarga = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [aiGeneratedMessages, setAiGeneratedMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const intervalRef = useRef(null);
  const progressRef = useRef(0);
  const shuffledRef = useRef([]);

  const { selectedLanguage, getCurrentTranslation } = useLanguage();

  // Textos inspiradores que rotan independientemente
  const inspirationalTexts = {
    ES: [
      "Conectando con la luz angelical...",
      "Preparando tu espacio sagrado...",
      "Los ángeles están cerca...",
      "Abriendo canales de comunicación...",
      "Sincronizando energías divinas..."
    ],
    EN: [
      "Connecting with angelic light...",
      "Preparing your sacred space...",
      "Angels are near...",
      "Opening communication channels...",
      "Synchronizing divine energies..."
    ],
    FR: [
      "Connexion avec la lumière angélique...",
      "Préparation de votre espace sacré...",
      "Les anges sont proches...",
      "Ouverture des canaux de communication...",
      "Synchronisation des énergies divines..."
    ],
    IT: [
      "Connessione con la luce angelica...",
      "Preparazione del tuo spazio sacro...",
      "Gli angeli sono vicini...",
      "Apertura dei canali di comunicazione...",
      "Sincronizzazione delle energie divine..."
    ]
  };

  const [currentInspirationalText, setCurrentInspirationalText] = useState(0);

  const incrementProgress = () => {
    if (progressRef.current >= 100) {
      return;
    }

    progressRef.current += 1;

    if (progressRef.current > 100) {
      progressRef.current = 100;
    }

    console.log(`📊 Progreso: ${progressRef.current}%`);
    setProgress(progressRef.current);

    const messages = aiGeneratedMessages.length > 0 ? aiGeneratedMessages : getCurrentTranslation().loadingMessages;
    const total = messages.length || 10;
    const stepSize = 100 / total;
    const stepIndex = Math.min(Math.floor(progressRef.current / stepSize), total - 1);
    const randomizedIndex = shuffledRef.current[stepIndex] ?? stepIndex;
    setCurrentMessage(randomizedIndex);

    const inspirationalStep = Math.floor(progressRef.current / 20);
    const currentTexts = inspirationalTexts[selectedLanguage] || inspirationalTexts.ES;
    setCurrentInspirationalText(inspirationalStep % currentTexts.length);

    if (progressRef.current >= 100) {
      console.log('✅ COMPLETADO - LIMPIANDO INTERVAL Y NAVEGANDO');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setTimeout(() => {
        console.log('🔄 NAVEGANDO A INICIO');
        navigate('/inicio');
      }, 1000);
    }
  };

  useEffect(() => {
    console.log('🚀 MONTANDO COMPONENTE - CARGANDO MENSAJES IA');

    const loadAIMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const languageCode = selectedLanguage === 'Español' ? 'ES' :
                            selectedLanguage === 'English' ? 'EN' :
                            selectedLanguage === 'Français' ? 'FR' :
                            selectedLanguage === 'Italiano' ? 'IT' : 'ES';

        const messages = await loadingMessagesService.getLoadingMessages(languageCode, 10);
        setAiGeneratedMessages(messages);
        console.log('✨ Mensajes IA cargados:', messages);

        const total = messages.length;
        const indices = Array.from({ length: total }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setShuffledIndices(indices);
        shuffledRef.current = indices;
        setCurrentMessage(indices[0] ?? 0);

        setIsLoadingMessages(false);

        progressRef.current = 0;
        setProgress(0);
        intervalRef.current = setInterval(incrementProgress, 100);
      } catch (error) {
        console.error('❌ Error cargando mensajes IA:', error);
        setAiGeneratedMessages(getCurrentTranslation().loadingMessages);
        setIsLoadingMessages(false);

        const total = getCurrentTranslation().loadingMessages.length;
        const indices = Array.from({ length: total }, (_, i) => i);
        setShuffledIndices(indices);
        shuffledRef.current = indices;
        setCurrentMessage(0);

        progressRef.current = 0;
        setProgress(0);
        intervalRef.current = setInterval(incrementProgress, 100);
      }
    };

    loadAIMessages();

    return () => {
      console.log('🧹 DESMONTANDO COMPONENTE - LIMPIANDO');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedLanguage]);

// Eliminado: handleLanguageChange (usamos LanguageSelector global)

  const currentTranslation = getCurrentTranslation();
  const displayMessages = aiGeneratedMessages.length > 0 ? aiGeneratedMessages : currentTranslation.loadingMessages;

  const totalMessages = displayMessages.length || 10;
  const stepSizeDisplay = 100 / totalMessages;
  const currentStepDisplay = Math.min(Math.floor(progress / stepSizeDisplay) + 1, totalMessages);

  // Obtener el texto inspirador actual
  const currentTexts = inspirationalTexts[selectedLanguage] || inspirationalTexts.ES;
  const currentInspirationText = currentTexts[currentInspirationalText];

  // Etiquetas para "Mensaje X de N"
  const messageCountLabels = {
    ES: { label: "Mensaje", of: "de" },
    EN: { label: "Message", of: "of" },
    FR: { label: "Message", of: "sur" },
    IT: { label: "Messaggio", of: "di" },
  };
  const countLabel = messageCountLabels[selectedLanguage] || messageCountLabels.ES;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center relative overflow-hidden">
      {/* Fondo responsivo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Capa de transparencia */}
      <div className="absolute inset-0 bg-white/70 pointer-events-none" />

      {/* Logo institucional - responsive */}
      <div className="absolute top-4 left-4 z-30">
        <LogoAngelico />
      </div>

      {/* Controles superiores: idioma + audio */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSelector inline />
        <AudioButton variant="header" />
      </div>

      {/* Contenido central - completamente responsive */}
      <div className="z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 tracking-wide drop-shadow-md"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#6a0dad'
          }}
        >
          {currentTranslation.title}
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-8 sm:mb-12 lg:mb-16 min-h-[2rem] sm:min-h-[2.5rem] transition-all duration-500 px-4">
          {isLoadingMessages ? 'Conectando con los ángeles...' : (displayMessages[currentMessage] || displayMessages[0])}
        </p>

        {/* Barra de progreso responsive con shimmer */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-4 sm:h-5 md:h-6 rounded-full bg-white/90 border-2 border-yellow-300 shadow-inner overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 animate-shimmer"></div>
          </div>
        </div>

        <p className="text-yellow-700 font-bold mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-shadow">
          {progress}%
        </p>
        
        {/* Info de carga: solo contador y puntos */}
        <div className="mt-6 space-y-2 animate-fade-in-up">
          <p className="text-purple-700 font-semibold text-sm">
            <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
            {countLabel.label} {currentStepDisplay} {countLabel.of} {totalMessages}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            {Array.from({ length: totalMessages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index < currentStepDisplay ? 'bg-purple-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer consistente */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <FooterLegal />
      </div>
    </div>
  );
};

export default PantallaCarga;
