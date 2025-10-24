import React, { useState, useEffect } from 'react';
import {
  Sparkles, Download, Share2, MessageCircle, BookOpen,
  Loader2, ChevronRight, Star, Heart, Eye, Lightbulb,
  TrendingUp, Calendar, ArrowRight, RefreshCw, Save
} from 'lucide-react';

const AngelicInterpreter = ({ 
  cards, 
  spreadType, 
  userQuestion, 
  user,
  onOpenChat 
}) => {
  const [interpretation, setInterpretation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFullInterpretation, setShowFullInterpretation] = useState(false);
  const [savedReading, setSavedReading] = useState(false);

  // Configuración de tiradas
  const spreadConfigs = {
    3: {
      name: 'Pasado-Presente-Futuro',
      positions: ['Pasado', 'Presente', 'Futuro'],
      description: 'Revela tu camino temporal y evolución espiritual'
    },
    6: {
      name: 'Cruz Angelical',
      positions: [
        'Situación Actual',
        'Desafío',
        'Pasado Reciente',
        'Futuro Cercano',
        'Consejo Angelical',
        'Resultado'
      ],
      description: 'Análisis profundo de tu situación actual'
    },
    9: {
      name: 'Mandala Completo',
      positions: [
        'Esencia',
        'Mente',
        'Corazón',
        'Cuerpo',
        'Pasado',
        'Presente',
        'Futuro',
        'Desafío',
        'Regalo'
      ],
      description: 'Lectura holística de todos los aspectos de tu ser'
    }
  };

  const currentSpread = spreadConfigs[spreadType] || spreadConfigs[3];

  // Generar interpretación con IA
  useEffect(() => {
    if (cards && cards.length > 0 && !interpretation) {
      generateInterpretation();
    }
  }, [cards]);

  const generateInterpretation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/interpret-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cards.map((card, idx) => ({
            name: card.name || card.title,
            position: currentSpread.positions[idx],
            number: card.number || idx + 1,
            meaning: card.meaning || card.description
          })),
          spreadType: spreadType,
          spreadName: currentSpread.name,
          userQuestion: userQuestion,
          userId: user?.id,
          userHistory: [] // TODO: Obtener historial del usuario
        })
      });

      const data = await response.json();
      setInterpretation(data);

    } catch (error) {
      console.error('Error generating interpretation:', error);
      // Fallback a interpretación básica
      setInterpretation(generateBasicInterpretation());
    } finally {
      setIsLoading(false);
    }
  };

  // Interpretación básica como fallback
  const generateBasicInterpretation = () => {
    return {
      overview: "Los ángeles han elegido estas cartas especialmente para ti. Cada una lleva un mensaje divino que iluminará tu camino.",
      cardInterpretations: cards.map((card, idx) => ({
        position: currentSpread.positions[idx],
        card: card.name || card.title,
        interpretation: card.meaning || card.description,
        angelicMessage: `Los ángeles te invitan a reflexionar sobre ${currentSpread.positions[idx].toLowerCase()}.`
      })),
      synthesis: "Estas cartas en conjunto revelan un camino de crecimiento y transformación espiritual.",
      recommendations: [
        "Medita sobre los mensajes recibidos",
        "Mantén un diario de tus reflexiones",
        "Confía en la guía angelical"
      ],
      nextSteps: []
    };
  };

  // Guardar lectura
  const saveReading = async () => {
    try {
      const response = await fetch('/api/save-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          cards: cards,
          spreadType: spreadType,
          interpretation: interpretation,
          question: userQuestion,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSavedReading(true);
        setTimeout(() => setSavedReading(false), 3000);
      }
    } catch (error) {
      console.error('Error saving reading:', error);
    }
  };

  // Exportar a PDF
  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/generate-reading-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cards,
          interpretation: interpretation,
          spreadType: spreadType,
          spreadName: currentSpread.name,
          question: userQuestion,
          user: user
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lectura-Angelical-${new Date().toLocaleDateString()}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Compartir
  const shareReading = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi Lectura Angelical',
        text: interpretation?.overview || 'Recibí una lectura angelical en la Plataforma Angélica',
        url: window.location.href
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 size={64} className="animate-spin text-purple-600 mx-auto" />
            <Sparkles size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
            Los Ángeles Están Interpretando...
          </h3>
          <p className="text-gray-600">
            Conectando con la sabiduría divina para revelar tus mensajes
          </p>
        </div>
      </div>
    );
  }

  if (!interpretation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">✨ Tu Lectura Angelical</h1>
              <p className="text-xl text-white/90">{currentSpread.name}</p>
              <p className="text-white/80 text-sm mt-1">{currentSpread.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveReading}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                title="Guardar lectura"
              >
                {savedReading ? <Star size={24} className="fill-yellow-300" /> : <Save size={24} />}
              </button>
              <button
                onClick={exportToPDF}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                title="Descargar PDF"
              >
                <Download size={24} />
              </button>
              <button
                onClick={shareReading}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                title="Compartir"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {userQuestion && (
            <div className="bg-white/10 rounded-2xl p-4 mt-4">
              <p className="text-sm text-white/70 mb-1">Tu Pregunta:</p>
              <p className="text-lg italic">"{userQuestion}"</p>
            </div>
          )}
        </div>

        {/* Visión General */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Eye size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Visión General</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            {interpretation.overview}
          </p>
        </div>

        {/* Cartas Individuales */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {interpretation.cardInterpretations?.map((cardInterp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
            >
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-semibold mb-1">
                        {cardInterp.position}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {cardInterp.card}
                      </h3>
                    </div>
                  </div>
                  <ChevronRight 
                    size={24} 
                    className={`text-purple-600 transition-transform ${selectedCard === idx ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={20} className="text-purple-600" />
                    <h4 className="font-semibold text-gray-800">Interpretación</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {cardInterp.interpretation}
                  </p>
                </div>

                {selectedCard === idx && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart size={20} className="text-pink-500" />
                        <h4 className="font-semibold text-gray-800">Mensaje Angelical</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed italic">
                        {cardInterp.angelicMessage}
                      </p>
                    </div>

                    {cardInterp.guidance && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb size={20} className="text-yellow-500" />
                          <h4 className="font-semibold text-gray-800">Guía Práctica</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {cardInterp.guidance}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChat && onOpenChat(cardInterp.card);
                      }}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <MessageCircle size={20} />
                      Profundizar con el Chatbot Angelical
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Síntesis */}
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Síntesis de tu Lectura</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            {interpretation.synthesis}
          </p>
        </div>

        {/* Recomendaciones */}
        {interpretation.recommendations && interpretation.recommendations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Recomendaciones Angelicales</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interpretation.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Próximos Pasos */}
        {interpretation.nextSteps && interpretation.nextSteps.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <ArrowRight size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Próximos Pasos en tu Camino</h2>
            </div>
            <div className="space-y-4">
              {interpretation.nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-md transition-all cursor-pointer"
                  onClick={() => step.action && step.action()}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                    {step.icon || <Star size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones Finales */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-center">
            ¿Qué te gustaría hacer ahora?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/apertura-angelical'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
            >
              <RefreshCw size={20} />
              Nueva Lectura
            </button>
            <button
              onClick={() => onOpenChat && onOpenChat()}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
            >
              <MessageCircle size={20} />
              Hablar con un Ángel
            </button>
            <button
              onClick={() => window.location.href = '/reservas'}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
            >
              <Calendar size={20} />
              Agendar Consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AngelicInterpreter;

