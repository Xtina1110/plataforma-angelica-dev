import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Award, Flame } from 'lucide-react';
import userStatsService from '../services/userStatsService';
import { useAuth } from '../contexts/AuthContext';

const UserStatsDisplay = ({ variant = 'loading' }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const userStats = await userStatsService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(userStatsService.getDefaultStats());
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  if (!stats) {
    return null;
  }

  // Variante para pantalla de carga
  if (variant === 'loading') {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl animate-fade-in">
        {/* Nivel y Progreso */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">{stats.level.icon}</span>
            <div className="text-left">
              <h3 className="text-white text-xl font-bold">{stats.level.name}</h3>
              <p className="text-white/70 text-sm">Nivel {stats.level.id}</p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${stats.progress}%`,
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)'
              }}
            />
          </div>
          <p className="text-white/80 text-xs mt-2">
            {stats.progress}% al siguiente nivel
          </p>
        </div>

        {/* Estadísticas en Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Puntos de Luz */}
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Sparkles className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
            <p className="text-white/70 text-xs mb-1">Puntos de Luz</p>
            <p className="text-white text-2xl font-bold">{stats.total_points.toLocaleString()}</p>
          </div>

          {/* Racha Diaria */}
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-white/70 text-xs mb-1">Racha Diaria</p>
            <p className="text-white text-2xl font-bold">{stats.daily_streak} días</p>
          </div>

          {/* Lecturas */}
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-blue-300 mx-auto mb-2" />
            <p className="text-white/70 text-xs mb-1">Lecturas</p>
            <p className="text-white text-2xl font-bold">{stats.readings_count}</p>
          </div>

          {/* Logros */}
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-purple-300 mx-auto mb-2" />
            <p className="text-white/70 text-xs mb-1">Logros</p>
            <p className="text-white text-2xl font-bold">{stats.achievements?.length || 0}</p>
          </div>
        </div>

        {/* Próximo Nivel */}
        {stats.nextLevel && (
          <div className="mt-4 text-center">
            <p className="text-white/60 text-xs">
              {stats.pointsToNextLevel.toLocaleString()} puntos para{' '}
              <span className="text-white font-semibold">
                {stats.nextLevel.icon} {stats.nextLevel.name}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Variante para header (compacta)
  if (variant === 'header') {
    return (
      <div className="flex items-center space-x-4 text-white/90 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border-l-4 border-purple-400">
        <div className="text-center">
          <div className="text-sm opacity-80">Nivel Espiritual</div>
          <div className="font-bold text-lg flex items-center gap-2">
            <span>{stats.level.icon}</span>
            <span>{stats.level.name}</span>
          </div>
        </div>
        <div className="w-px h-12 bg-white/30"></div>
        <div className="text-center">
          <div className="text-sm opacity-80">Puntos de Luz</div>
          <div className="font-bold text-lg">{stats.total_points.toLocaleString()}</div>
        </div>
      </div>
    );
  }

  return null;
};

export default UserStatsDisplay;

