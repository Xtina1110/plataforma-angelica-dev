import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Eye, 
  Download,
  BarChart3,
  Flame
} from 'lucide-react';
import {
  getUserReadings,
  analyzeReadingPatterns,
  generatePatternInsights
} from '../../../services/history/readingHistoryService';

/**
 * Componente de tarjeta de tirada en el historial
 */
const ReadingCard = ({ reading, onClick }) => {
  const date = new Date(reading.created_at);
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-6 cursor-pointer hover:border-purple-400/50 transition-all backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-purple-100 font-semibold text-lg mb-1">
            Tirada de {reading.reading_type} Cartas
          </h3>
          <p className="text-purple-300 text-sm">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
          {reading.metadata?.hasAudio && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
              🎵 Audio
            </span>
          )}
          {reading.metadata?.hasPDF && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
              📄 PDF
            </span>
          )}
        </div>
      </div>

      {reading.theme && (
        <div className="mb-4">
          <span className="text-purple-200 text-sm">
            Tema: <span className="font-medium">{reading.theme}</span>
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {reading.card_names.slice(0, 3).map((cardName, index) => (
          <span
            key={index}
            className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full"
          >
            {cardName}
          </span>
        ))}
        {reading.card_names.length > 3 && (
          <span className="text-xs text-purple-300">
            +{reading.card_names.length - 3} más
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {[...new Set(reading.archangels)].map((arcangel, index) => (
            <span
              key={index}
              className="text-xs text-purple-300"
              title={arcangel}
            >
              👼
            </span>
          ))}
        </div>
        <button className="text-purple-300 hover:text-purple-100 transition-colors flex items-center gap-1 text-sm">
          <Eye className="w-4 h-4" />
          Ver detalles
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Componente de insight
 */
const InsightCard = ({ insight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        <div 
          className="text-4xl flex-shrink-0"
          style={{ filter: `drop-shadow(0 0 8px ${insight.color})` }}
        >
          {insight.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-indigo-100 font-semibold text-lg mb-2">
            {insight.title}
          </h4>
          <p className="text-indigo-200 text-sm leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Componente de estadísticas
 */
const StatsCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-gradient-to-br from-purple-800/30 to-indigo-800/30 border border-purple-600/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-purple-300 text-sm">{label}</span>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="text-purple-100 text-2xl font-bold">{value}</div>
    </div>
  );
};

/**
 * Componente principal del historial
 */
const ReadingHistory = ({ userId }) => {
  const [readings, setReadings] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'patterns' | 'insights'

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [readingsData, patternsData, insightsData] = await Promise.all([
        getUserReadings(userId, 20),
        analyzeReadingPatterns(userId),
        generatePatternInsights(userId)
      ]);

      setReadings(readingsData);
      setPatterns(patternsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!patterns || patterns.totalReadings === 0) {
    return (
      <div className="text-center p-12">
        <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-purple-100 mb-2">
          Aún no tienes tiradas
        </h3>
        <p className="text-purple-300">
          Realiza tu primera tirada angelical para comenzar tu viaje espiritual
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-purple-600/30">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-purple-100 border-b-2 border-purple-400'
              : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Historial
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'patterns'
              ? 'text-purple-100 border-b-2 border-purple-400'
              : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Patrones
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'insights'
              ? 'text-purple-100 border-b-2 border-purple-400'
              : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Insights
        </button>
      </div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatsCard
                label="Total de Tiradas"
                value={patterns.totalReadings}
                icon={Sparkles}
                color="#9370DB"
              />
              <StatsCard
                label="Racha Actual"
                value={`${patterns.streaks.current} días`}
                icon={Flame}
                color="#FF6B35"
              />
              <StatsCard
                label="Racha Máxima"
                value={`${patterns.streaks.longest} días`}
                icon={TrendingUp}
                color="#4CAF50"
              />
              <StatsCard
                label="Promedio/Mes"
                value={patterns.averageReadingsPerMonth}
                icon={Calendar}
                color="#FFD700"
              />
            </div>

            {/* Lista de tiradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readings.map((reading) => (
                <ReadingCard
                  key={reading.id}
                  reading={reading}
                  onClick={() => {/* Abrir modal de detalle */}}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'patterns' && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Arcángeles más frecuentes */}
            <div>
              <h3 className="text-xl font-semibold text-purple-100 mb-4">
                Arcángeles Más Frecuentes
              </h3>
              <div className="space-y-3">
                {patterns.topArchangels.map((arcangel, index) => (
                  <div key={index} className="bg-purple-800/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-100 font-medium">
                        {arcangel.name}
                      </span>
                      <span className="text-purple-300 text-sm">
                        {arcangel.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${arcangel.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cartas más frecuentes */}
            <div>
              <h3 className="text-xl font-semibold text-purple-100 mb-4">
                Cartas Más Frecuentes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {patterns.topCards.map((card, index) => (
                  <div key={index} className="bg-indigo-800/20 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-100 text-sm">
                        {card.name}
                      </span>
                      <span className="text-indigo-300 text-xs">
                        {card.count}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Insights */}
            <div>
              <h3 className="text-xl font-semibold text-purple-100 mb-4">
                Insights Personalizados
              </h3>
              <div className="space-y-4">
                {insights.insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <h3 className="text-xl font-semibold text-purple-100 mb-4">
                Recomendaciones
              </h3>
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3"
                  >
                    <span className="text-emerald-400 text-xl">💡</span>
                    <p className="text-emerald-100 text-sm leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingHistory;

