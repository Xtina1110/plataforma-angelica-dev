import React, { useState, useEffect } from 'react';
import { 
  Trophy, Target, Flame, Star, Award, TrendingUp, 
  BookOpen, Clock, CheckCircle, Zap, Crown, Medal
} from 'lucide-react';

const StudentProgress = ({ user }) => {
  const [stats, setStats] = useState({
    level: 12,
    xp: 2450,
    xpToNextLevel: 3000,
    streak: 15,
    totalCourses: 8,
    completedCourses: 3,
    inProgressCourses: 5,
    totalHours: 45.5,
    certificates: 3,
    achievements: 12,
    rank: 'Aprendiz Angelical'
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: 'Primera Conexión', description: 'Completaste tu primer curso', icon: '🌟', unlocked: true, date: '2025-10-01' },
    { id: 2, name: 'Estudiante Dedicado', description: 'Mantén una racha de 7 días', icon: '🔥', unlocked: true, date: '2025-10-15' },
    { id: 3, name: 'Maestro del Tarot', description: 'Completa todos los cursos de Tarot', icon: '🔮', unlocked: true, date: '2025-10-20' },
    { id: 4, name: 'Comunicador Angelical', description: 'Completa 5 cursos de Ángeles', icon: '👼', unlocked: false },
    { id: 5, name: 'Racha Imparable', description: 'Mantén una racha de 30 días', icon: '⚡', unlocked: false },
    { id: 6, name: 'Experto en Cristales', description: 'Completa todos los cursos de Cristales', icon: '💎', unlocked: false },
    { id: 7, name: 'Meditador Avanzado', description: 'Completa 10 meditaciones guiadas', icon: '🧘', unlocked: false },
    { id: 8, name: 'Sabio Espiritual', description: 'Alcanza el nivel 25', icon: '🌙', unlocked: false }
  ]);

  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: 'Lun', hours: 2.5, completed: true },
    { day: 'Mar', hours: 1.5, completed: true },
    { day: 'Mié', hours: 3.0, completed: true },
    { day: 'Jue', hours: 2.0, completed: true },
    { day: 'Vie', hours: 1.0, completed: true },
    { day: 'Sáb', hours: 0, completed: false },
    { day: 'Dom', hours: 0, completed: false }
  ]);

  const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;
  const courseCompletionPercentage = (stats.completedCourses / stats.totalCourses) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header con Nivel y XP */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">¡Hola, {user?.user_metadata?.first_name || 'Estudiante'}! 👋</h1>
              <p className="text-purple-100 text-lg">{stats.rank}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 justify-end mb-2">
                <Crown className="w-8 h-8 text-yellow-300" />
                <span className="text-5xl font-bold">Nivel {stats.level}</span>
              </div>
              <p className="text-purple-100">Rango #156 de 12,450 estudiantes</p>
            </div>
          </div>

          {/* Barra de XP */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{stats.xp} XP</span>
              </span>
              <span>{stats.xpToNextLevel} XP para nivel {stats.level + 1}</span>
            </div>
            <div className="w-full bg-purple-800/30 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${xpPercentage}%` }}
              >
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Racha */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-orange-600">{stats.streak}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Días de Racha 🔥</h3>
            <p className="text-sm text-gray-500 mt-1">¡Sigue así! Tu mejor racha: 21 días</p>
          </div>

          {/* Cursos Completados */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-green-600">{stats.completedCourses}/{stats.totalCourses}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Cursos Completados</h3>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${courseCompletionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Horas de Estudio */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.totalHours}h</span>
            </div>
            <h3 className="text-gray-600 font-medium">Horas de Estudio</h3>
            <p className="text-sm text-gray-500 mt-1">Promedio: 2.5h por semana</p>
          </div>

          {/* Certificados */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-purple-600">{stats.certificates}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Certificados Obtenidos</h3>
            <p className="text-sm text-gray-500 mt-1">Verificables en blockchain</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Actividad Semanal */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span>Actividad Semanal</span>
            </h3>
            <div className="flex items-end justify-between space-x-2 h-48">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="flex-1 w-full flex items-end">
                    <div 
                      className={`w-full rounded-t-lg transition-all ${
                        day.completed 
                          ? 'bg-gradient-to-t from-purple-600 to-blue-500' 
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${(day.hours / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{day.day}</span>
                  {day.hours > 0 && (
                    <span className="text-xs text-gray-500">{day.hours}h</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Meta semanal:</strong> 10 horas · Progreso: {weeklyActivity.reduce((sum, day) => sum + day.hours, 0)}h / 10h
              </p>
            </div>
          </div>

          {/* Logros Recientes */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <span>Logros ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:shadow-md'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-bold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      {achievement.unlocked && achievement.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Desbloqueado: {new Date(achievement.date).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Objetivos y Metas */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Target className="w-6 h-6 text-purple-600" />
            <span>Objetivos del Mes</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Completar 2 cursos</span>
                <span className="text-sm font-bold text-purple-600">1/2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" style={{ width: '50%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Recompensa: +500 XP 🎁</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Racha de 30 días</span>
                <span className="text-sm font-bold text-orange-600">15/30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '50%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Recompensa: Badge "Imparable" 🔥</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">40 horas de estudio</span>
                <span className="text-sm font-bold text-green-600">45.5/40</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">✅ ¡Completado! +300 XP</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProgress;

