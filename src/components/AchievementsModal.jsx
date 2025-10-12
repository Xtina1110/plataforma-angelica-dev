import React, { useState, useEffect } from 'react';
import { X, Award, Lock, Check, Star, TrendingUp, Calendar, Heart, Zap, Crown } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const AchievementsModal = ({ isOpen, onClose, userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unlocked', 'locked'

  useEffect(() => {
    if (isOpen && userId) {
      loadAchievements();
    }
  }, [isOpen, userId]);

  const loadAchievements = async () => {
    try {
      setLoading(true);

      // Cargar todos los logros disponibles
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('points_reward', { ascending: false });

      if (achievementsError) throw achievementsError;

      // Cargar logros desbloqueados del usuario
      const { data: unlockedAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', userId);

      if (userError) throw userError;

      setAchievements(allAchievements || []);
      setUserAchievements(unlockedAchievements || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getProgress = (achievementId) => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievementId);
    return userAchievement?.progress || 0;
  };

  const getIconComponent = (iconName) => {
    const icons = {
      'award': Award,
      'star': Star,
      'trending-up': TrendingUp,
      'calendar': Calendar,
      'heart': Heart,
      'zap': Zap,
      'crown': Crown,
      'check': Check
    };
    return icons[iconName] || Award;
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return isUnlocked(achievement.id);
    if (filter === 'locked') return !isUnlocked(achievement.id);
    return true;
  });

  const unlockedCount = achievements.filter(a => isUnlocked(a.id)).length;
  const totalPoints = userAchievements.reduce((sum, ua) => sum + (ua.achievements?.points_reward || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Logros Angelicales</h2>
                  <p className="text-purple-100 text-sm">Tu progreso espiritual</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{unlockedCount}/{achievements.length}</p>
                <p className="text-xs text-purple-100">Desbloqueados</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-purple-100">Puntos Totales</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">
                  {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
                </p>
                <p className="text-xs text-purple-100">Completado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 p-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unlocked'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Desbloqueados ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'locked'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bloqueados ({achievements.length - unlockedCount})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay logros en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.map((achievement) => {
                const unlocked = isUnlocked(achievement.id);
                const progress = getProgress(achievement.id);
                const IconComponent = getIconComponent(achievement.icon);

                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl p-4 border-2 transition-all ${
                      unlocked
                        ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-75'
                    }`}
                  >
                    {/* Unlocked Badge */}
                    {unlocked && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-xl ${
                          unlocked
                            ? 'bg-gradient-to-br from-purple-500 to-violet-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        {unlocked ? (
                          <IconComponent className="w-6 h-6" />
                        ) : (
                          <Lock className="w-6 h-6" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mt-1 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>

                        {/* Points */}
                        <div className="flex items-center gap-2 mt-3">
                          <Star className={`w-4 h-4 ${unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${unlocked ? 'text-purple-600' : 'text-gray-500'}`}>
                            {achievement.points_reward} puntos
                          </span>
                        </div>

                        {/* Progress Bar (if not unlocked) */}
                        {!unlocked && progress > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progreso</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;

