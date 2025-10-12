import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, CheckCircle2, Sparkles, Download } from 'lucide-react';
import { generateReadingSummary } from '../../../services/ai/interpretationService';
import { Button } from '../../ui/button';

/**
 * Componente que muestra el resumen ejecutivo de toda la tirada
 */
const ReadingSummary = ({ 
  cartasConInterpretaciones, 
  tema, 
  tipoTirada,
  contextoUsuario,
  onDownloadPDF 
}) => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateReadingSummary({
          cartasConInterpretaciones,
          tema,
          tipoTirada,
          contextoUsuario
        });

        setResumen(result);
      } catch (err) {
        console.error('Error al generar resumen:', err);
        setError('No se pudo generar el resumen. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (cartasConInterpretaciones && cartasConInterpretaciones.length > 0) {
      fetchSummary();
    }
  }, [cartasConInterpretaciones, tema, tipoTirada]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="text-purple-300 text-center text-lg">
          Los ángeles están integrando todos los mensajes...
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

  if (!resumen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Encabezado */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
        </motion.div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          Resumen de Tu Tirada Angelical
        </h2>
      </div>

      {/* Mensaje Central */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center shadow-2xl"
      >
        <p className="text-2xl font-semibold text-white leading-relaxed">
          "{resumen.mensajeCentral}"
        </p>
      </motion.div>

      {/* Historia Completa */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <h3 className="text-2xl font-semibold text-indigo-100">
            Tu Historia Angelical
          </h3>
        </div>
        <p className="text-indigo-50 leading-relaxed text-lg whitespace-pre-line">
          {resumen.historiaCompleta}
        </p>
      </motion.div>

      {/* Visión General (Pasado, Presente, Futuro) */}
      {(resumen.visionGeneral.pasado || resumen.visionGeneral.futuro) && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {resumen.visionGeneral.pasado && (
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-100 mb-3">
                🕰️ Pasado
              </h4>
              <p className="text-blue-50 text-sm leading-relaxed">
                {resumen.visionGeneral.pasado}
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-100 mb-3">
              ⭐ Presente
            </h4>
            <p className="text-purple-50 text-sm leading-relaxed">
              {resumen.visionGeneral.presente}
            </p>
          </div>

          {resumen.visionGeneral.futuro && (
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-amber-100 mb-3">
                🌅 Futuro
              </h4>
              <p className="text-amber-50 text-sm leading-relaxed">
                {resumen.visionGeneral.futuro}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Próximos Pasos */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-xl p-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-6 h-6 text-emerald-400" />
          <h3 className="text-2xl font-semibold text-emerald-100">
            Próximos Pasos Espirituales
          </h3>
        </div>
        <div className="space-y-4">
          {resumen.proximosPasos.map((paso, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <p className="text-emerald-50 leading-relaxed">
                {paso}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Afirmación Personalizada */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-center shadow-2xl"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Tu Afirmación Angelical
        </h3>
        <p className="text-2xl font-bold text-white leading-relaxed italic">
          "{resumen.afirmacionPersonalizada}"
        </p>
        <p className="text-pink-100 mt-4 text-sm">
          Repite esta afirmación cada mañana para conectar con la energía angelical
        </p>
      </motion.div>

      {/* Conclusión */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm"
      >
        <h3 className="text-2xl font-semibold text-purple-100 mb-4">
          Mensaje Final de los Ángeles
        </h3>
        <p className="text-purple-50 leading-relaxed text-lg">
          {resumen.conclusion}
        </p>
      </motion.div>

      {/* Botón de Descarga */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex justify-center"
      >
        <Button
          onClick={onDownloadPDF}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Download className="w-5 h-5 mr-2" />
          Descargar Tirada Completa (PDF)
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ReadingSummary;

