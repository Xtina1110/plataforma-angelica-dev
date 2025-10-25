import React, { useState } from 'react';
import { Sparkles, BookOpen, Wand2, Download, History, Share2, ArrowLeft } from 'lucide-react';
import ImmersiveCardExperience from './3D/ImmersiveCardExperience';
import AngelicInterpreter from './AngelicInterpreter';

/**
 * Componente que integra la experiencia 3D de selección de cartas
 * con el intérprete angelical de IA
 */
const AngelicInterpreterWith3D = () => {
  const [step, setStep] = useState('select-mode'); // select-mode, 3d-selection, interpretation
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [use3DExperience, setUse3DExperience] = useState(true);

  // Cartas angelicales (ejemplo - deberían venir de una base de datos)
  const angelicCards = [
    { id: 1, name: 'Miguel', archangel: 'Miguel', meaning: 'Protección y Valor' },
    { id: 2, name: 'Gabriel', archangel: 'Gabriel', meaning: 'Comunicación Divina' },
    { id: 3, name: 'Rafael', archangel: 'Rafael', meaning: 'Sanación y Guía' },
    { id: 4, name: 'Uriel', archangel: 'Uriel', meaning: 'Sabiduría e Iluminación' },
    { id: 5, name: 'Chamuel', archangel: 'Chamuel', meaning: 'Amor Incondicional' },
    { id: 6, name: 'Jophiel', archangel: 'Jophiel', meaning: 'Belleza y Creatividad' },
    { id: 7, name: 'Zadkiel', archangel: 'Zadkiel', meaning: 'Transformación y Perdón' },
    { id: 8, name: 'Haniel', archangel: 'Haniel', meaning: 'Gracia y Armonía' },
    { id: 9, name: 'Raziel', archangel: 'Raziel', meaning: 'Misterios Divinos' }
  ];

  // Obtener cartas aleatorias según la modalidad
  const getRandomCards = (count) => {
    const shuffled = [...angelicCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Manejar selección de modalidad
  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
    const cardCount = mode === '3-cards' ? 3 : mode === '6-cards' ? 6 : 9;
    const cards = getRandomCards(cardCount);
    setSelectedCards(cards);
    
    if (use3DExperience) {
      setStep('3d-selection');
    } else {
      setStep('interpretation');
    }
  };

  // Manejar selección de carta en 3D
  const handleCardSelect = (card, index) => {
    console.log('Carta seleccionada:', card, 'en posición:', index);
  };

  // Completar selección 3D y pasar a interpretación
  const handleComplete3D = () => {
    setStep('interpretation');
  };

  // Volver al inicio
  const handleBack = () => {
    setStep('select-mode');
    setSelectedMode(null);
    setSelectedCards([]);
  };

  // Pantalla de selección de modalidad
  if (step === 'select-mode') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-12 h-12 text-yellow-400" />
              <h1 className="text-5xl font-bold text-white">
                Intérprete Angelical con IA
              </h1>
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </div>
            <p className="text-xl text-white/80">
              Recibe guía divina a través de las cartas angelicales interpretadas por inteligencia artificial
            </p>
          </div>

          {/* Toggle 3D Experience */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={use3DExperience}
                  onChange={(e) => setUse3DExperience(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white font-medium">
                  ✨ Usar experiencia inmersiva 3D
                </span>
              </label>
              <p className="text-white/60 text-sm mt-2 ml-8">
                {use3DExperience 
                  ? 'Selecciona tus cartas en un entorno sagrado 3D interactivo'
                  : 'Selección tradicional de cartas (más rápido)'}
              </p>
            </div>
          </div>

          {/* Modalidades de lectura */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* 3 Cartas */}
            <div
              onClick={() => handleModeSelection('3-cards')}
              className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-400/50 hover:border-purple-400 cursor-pointer transform hover:scale-105 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/50 transition-all">
                  <BookOpen className="w-10 h-10 text-purple-200" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">3 Cartas</h3>
                <p className="text-purple-200 mb-4">Pasado, Presente, Futuro</p>
                <p className="text-white/70 text-sm">
                  Lectura rápida y enfocada para obtener claridad sobre tu situación actual
                </p>
              </div>
            </div>

            {/* 6 Cartas */}
            <div
              onClick={() => handleModeSelection('6-cards')}
              className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/50 hover:border-blue-400 cursor-pointer transform hover:scale-105 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/50 transition-all">
                  <Wand2 className="w-10 h-10 text-blue-200" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">6 Cartas</h3>
                <p className="text-blue-200 mb-4">Cruz Angelical</p>
                <p className="text-white/70 text-sm">
                  Análisis profundo de tu situación con múltiples perspectivas angelicales
                </p>
              </div>
            </div>

            {/* 9 Cartas */}
            <div
              onClick={() => handleModeSelection('9-cards')}
              className="bg-gradient-to-br from-pink-600/30 to-purple-600/30 backdrop-blur-md rounded-2xl p-8 border-2 border-pink-400/50 hover:border-pink-400 cursor-pointer transform hover:scale-105 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/50 transition-all">
                  <Sparkles className="w-10 h-10 text-pink-200" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">9 Cartas</h3>
                <p className="text-pink-200 mb-4">Mandala Completo</p>
                <p className="text-white/70 text-sm">
                  Lectura completa y detallada para transformación espiritual profunda
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Interpretación con IA</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
              <Download className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Exportar a PDF</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
              <History className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Historial de lecturas</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
              <Share2 className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Compartir lectura</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de experiencia 3D
  if (step === '3d-selection') {
    return (
      <>
        {/* Botón de volver */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 text-white hover:bg-black/70 transition-all border border-white/20 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <ImmersiveCardExperience
          cards={selectedCards}
          onCardSelect={handleCardSelect}
          selectedCards={selectedCards.map((_, i) => i)}
          onComplete={handleComplete3D}
        />
      </>
    );
  }

  // Pantalla de interpretación
  if (step === 'interpretation') {
    return (
      <div className="relative">
        {/* Botón de volver */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 text-white hover:bg-black/70 transition-all border border-white/20 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Nueva Lectura
        </button>

        <AngelicInterpreter
          initialMode={selectedMode}
          preselectedCards={selectedCards}
        />
      </div>
    );
  }

  return null;
};

export default AngelicInterpreterWith3D;

