import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Lightbulb, TrendingUp, MessageCircle } from 'lucide-react';
import { generateCardInterpretation } from '../../../services/ai/interpretationService';

/**
 * Componente que muestra la interpretación de una carta con IA
 */
const CardInterpretation = ({ 
  carta, 
  posicion, 
  tema, 
  contextoUsuario,
  otrasCartas,
  onInterpretationGenerated 
}) => {
  const [interpretacion, setInterpretacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterpretation = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateCardInterpretation({
          carta,
          posicion,
          tema,
          contextoUsuario,
          otrasCartas
        });

        setInterpretacion(result);
        
        // Notificar al componente padre
        if (onInterpretationGenerated) {
          onInterpretationGenerated(result);
        }
      } catch (err) {
        console.error('Error al generar interpretación:', err);
        setError('No se pudo generar la interpretación. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterpretation();
  }, [carta, posicion, tema]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="text-purple-300 text-center">
          Los ángeles están preparando tu mensaje...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <p className="text-red-300 text-center">{error}</p>
      </div>
    );
  }

  if (!interpretacion) {
    return null;
  }

  const getUrgencyColor = (nivel) => {
    switch (nivel) {
      case 'alto':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medio':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'bajo':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Interpretación Principal */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-100">
            Interpretación Angelical
          </h3>
        </div>
        <p className="text-purple-50 leading-relaxed text-lg">
          {interpretacion.interpretacion}
        </p>
      </div>

      {/* Mensaje del Arcángel */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-semibold text-indigo-100">
            Mensaje del Arcángel {carta.arcangel}
          </h3>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 text-6xl text-indigo-500/20 leading-none">
            "
          </div>
          <p className="text-indigo-50 leading-relaxed text-lg italic pl-8 pr-4">
            {interpretacion.mensajeDelArcangel}
          </p>
          <div className="absolute bottom-0 right-0 text-6xl text-indigo-500/20 leading-none transform rotate-180">
            "
          </div>
        </div>
      </div>

      {/* Consejo Accionable */}
      <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-semibold text-amber-100">
            Acción para Hoy
          </h3>
        </div>
        <p className="text-amber-50 leading-relaxed text-lg">
          {interpretacion.consejoAccionable}
        </p>
      </div>

      {/* Palabras Clave y Nivel de Urgencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Palabras Clave */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-pink-400" />
            <h4 className="text-sm font-semibold text-pink-100">
              Palabras Clave
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {interpretacion.palabrasClave.map((palabra, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-100 text-sm"
              >
                {palabra}
              </span>
            ))}
          </div>
        </div>

        {/* Nivel de Urgencia */}
        <div className={`border rounded-lg p-4 ${getUrgencyColor(interpretacion.nivelDeUrgencia)}`}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" />
            <h4 className="text-sm font-semibold">
              Nivel de Atención
            </h4>
          </div>
          <p className="text-sm capitalize font-medium">
            {interpretacion.nivelDeUrgencia}
          </p>
        </div>
      </div>

      {/* Conexión con Otras Cartas */}
      {interpretacion.conexionConOtrasCartas && (
        <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border border-cyan-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-cyan-100 mb-2">
            Conexión con Otras Cartas
          </h4>
          <p className="text-cyan-50 text-sm leading-relaxed">
            {interpretacion.conexionConOtrasCartas}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CardInterpretation;

