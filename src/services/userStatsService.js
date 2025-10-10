/**
 * Servicio de Estadísticas y Gamificación de Usuario
 * 
 * Sistema completo de niveles, puntos, logros y progreso espiritual.
 * Integrado con Supabase para persistencia de datos.
 */

import { supabase } from '../config/supabaseClient';

// Niveles espirituales y sus requisitos
export const SPIRITUAL_LEVELS = [
  { id: 1, name: 'Despertar', minPoints: 0, maxPoints: 499, color: '#E8D5F2', icon: '🌱' },
  { id: 2, name: 'Buscador', minPoints: 500, maxPoints: 1499, color: '#D4B5E8', icon: '🔍' },
  { id: 3, name: 'Aprendiz', minPoints: 1500, maxPoints: 2999, color: '#C095DE', icon: '📚' },
  { id: 4, name: 'Practicante', minPoints: 3000, maxPoints: 4999, color: '#AC75D4', icon: '🧘' },
  { id: 5, name: 'Sanador', minPoints: 5000, maxPoints: 7499, color: '#9855CA', icon: '💜' },
  { id: 6, name: 'Guía', minPoints: 7500, maxPoints: 9999, color: '#8435C0', icon: '🌟' },
  { id: 7, name: 'Iluminado', minPoints: 10000, maxPoints: 14999, color: '#7015B6', icon: '✨' },
  { id: 8, name: 'Maestro', minPoints: 15000, maxPoints: 24999, color: '#5C00AC', icon: '👑' },
  { id: 9, name: 'Ascendido', minPoints: 25000, maxPoints: 49999, color: '#4800A2', icon: '🦋' },
  { id: 10, name: 'Avatar', minPoints: 50000, maxPoints: Infinity, color: '#340098', icon: '🌌' }
];

// Acciones que otorgan puntos
export const POINT_ACTIONS = {
  // Lecturas Angelicales
  reading3Cards: { points: 50, name: 'Lectura de 3 Cartas', category: 'readings' },
  reading6Cards: { points: 100, name: 'Lectura de 6 Cartas', category: 'readings' },
  reading9Cards: { points: 150, name: 'Lectura de 9 Cartas', category: 'readings' },
  liveReading: { points: 300, name: 'Lectura en Vivo', category: 'readings' },
  
  // Sonoterapia
  soundSession: { points: 100, name: 'Sesión de Sonoterapia', category: 'sound' },
  channeling: { points: 150, name: 'Canalización', category: 'sound' },
  completeCourse: { points: 500, name: 'Curso Completado', category: 'sound' },
  
  // Terapias y Limpiezas
  energyTherapy: { points: 120, name: 'Terapia Energética', category: 'therapy' },
  cleaning: { points: 150, name: 'Limpieza Espiritual', category: 'therapy' },
  transformationProgram: { points: 1000, name: 'Programa de Transformación', category: 'therapy' },
  
  // Academia
  watchLesson: { points: 20, name: 'Lección Vista', category: 'academy' },
  completeModule: { points: 100, name: 'Módulo Completado', category: 'academy' },
  getCertification: { points: 1000, name: 'Certificación Obtenida', category: 'academy' },
  
  // Mensajes y Comunicación
  dailyMessage: { points: 10, name: 'Mensaje del Día', category: 'messages' },
  botConversation: { points: 25, name: 'Conversación con Bot', category: 'messages' },
  oracleConsult: { points: 30, name: 'Consulta de Oráculo', category: 'messages' },
  
  // Tienda
  firstPurchase: { points: 100, name: 'Primera Compra', category: 'shop' },
  purchase: { points: 50, name: 'Compra Realizada', category: 'shop' },
  review: { points: 20, name: 'Reseña Escrita', category: 'shop' },
  
  // Eventos
  attendEvent: { points: 200, name: 'Asistencia a Evento', category: 'events' },
  organizeEvent: { points: 500, name: 'Organizar Evento', category: 'events' },
  
  // Blog y Podcast
  readArticle: { points: 15, name: 'Artículo Leído', category: 'content' },
  listenPodcast: { points: 20, name: 'Podcast Escuchado', category: 'content' },
  shareContent: { points: 10, name: 'Contenido Compartido', category: 'content' },
  
  // Engagement
  dailyLogin: { points: 5, name: 'Inicio de Sesión Diario', category: 'engagement' },
  weeklyStreak: { points: 50, name: 'Racha Semanal', category: 'engagement' },
  monthlyStreak: { points: 200, name: 'Racha Mensual', category: 'engagement' },
  referFriend: { points: 100, name: 'Referir Amigo', category: 'engagement' }
};

// Logros desbloqueables
export const ACHIEVEMENTS = [
  // Lecturas
  { id: 'first_reading', name: 'Primera Conexión', description: 'Realiza tu primera lectura angelical', icon: '🎴', points: 50 },
  { id: 'reading_master', name: 'Maestro de Cartas', description: 'Completa 100 lecturas', icon: '🃏', points: 500 },
  { id: 'all_card_types', name: 'Explorador Angelical', description: 'Prueba todos los tipos de lectura', icon: '✨', points: 200 },
  
  // Sonoterapia
  { id: 'sound_healer', name: 'Sanador Sonoro', description: 'Completa 50 sesiones de sonoterapia', icon: '🎵', points: 300 },
  { id: 'frequency_master', name: 'Maestro de Frecuencias', description: 'Experimenta todas las frecuencias', icon: '🔊', points: 400 },
  
  // Academia
  { id: 'eternal_student', name: 'Estudiante Eterno', description: 'Completa 10 cursos', icon: '📚', points: 1000 },
  { id: 'certified', name: 'Certificado', description: 'Obtén tu primera certificación', icon: '🎓', points: 500 },
  
  // Engagement
  { id: 'daily_devotion', name: 'Devoción Diaria', description: 'Inicia sesión 30 días seguidos', icon: '🌟', points: 300 },
  { id: 'community_pillar', name: 'Pilar de la Comunidad', description: 'Ayuda a 10 personas', icon: '🤝', points: 500 },
  
  // Especiales
  { id: 'enlightened_one', name: 'Iluminado', description: 'Alcanza el nivel Iluminado', icon: '💫', points: 1000 },
  { id: 'avatar', name: 'Avatar Espiritual', description: 'Alcanza el nivel Avatar', icon: '🌌', points: 5000 }
];

class UserStatsService {
  constructor() {
    this.cache = {
      stats: null,
      lastFetch: null,
      cacheDuration: 5 * 60 * 1000 // 5 minutos
    };
  }

  /**
   * Obtener estadísticas completas del usuario
   * @param {string} userId - ID del usuario
   * @returns {Object} Estadísticas completas
   */
  async getUserStats(userId) {
    // Verificar cache
    if (this.cache.stats && this.cache.lastFetch && 
        Date.now() - this.cache.lastFetch < this.cache.cacheDuration) {
      return this.cache.stats;
    }

    try {
      // Obtener datos de Supabase
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      // Si no existe, crear registro inicial
      if (!data) {
        const initialStats = await this.createInitialStats(userId);
        this.cache.stats = initialStats;
        this.cache.lastFetch = Date.now();
        return initialStats;
      }

      // Calcular nivel actual
      const level = this.calculateLevel(data.total_points);
      const progress = this.calculateLevelProgress(data.total_points);

      const stats = {
        ...data,
        level,
        progress,
        nextLevel: level.id < SPIRITUAL_LEVELS.length ? SPIRITUAL_LEVELS[level.id] : null,
        pointsToNextLevel: level.id < SPIRITUAL_LEVELS.length 
          ? SPIRITUAL_LEVELS[level.id].minPoints - data.total_points 
          : 0
      };

      // Actualizar cache
      this.cache.stats = stats;
      this.cache.lastFetch = Date.now();

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Crear estadísticas iniciales para nuevo usuario
   * @param {string} userId - ID del usuario
   */
  async createInitialStats(userId) {
    const initialData = {
      user_id: userId,
      total_points: 0,
      readings_count: 0,
      sessions_count: 0,
      courses_completed: 0,
      achievements: [],
      daily_streak: 0,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .insert([initialData])
        .select()
        .single();

      if (error) throw error;

      const level = SPIRITUAL_LEVELS[0];
      return {
        ...data,
        level,
        progress: 0,
        nextLevel: SPIRITUAL_LEVELS[1],
        pointsToNextLevel: SPIRITUAL_LEVELS[1].minPoints
      };
    } catch (error) {
      console.error('Error al crear estadísticas iniciales:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Agregar puntos por una acción
   * @param {string} userId - ID del usuario
   * @param {string} action - Tipo de acción
   * @param {Object} metadata - Metadatos adicionales
   */
  async addPoints(userId, action, metadata = {}) {
    if (!POINT_ACTIONS[action]) {
      console.warn(`Acción no reconocida: ${action}`);
      return null;
    }

    const pointsToAdd = POINT_ACTIONS[action].points;

    try {
      // Obtener stats actuales
      const currentStats = await this.getUserStats(userId);
      const newTotal = currentStats.total_points + pointsToAdd;

      // Verificar si sube de nivel
      const oldLevel = currentStats.level;
      const newLevel = this.calculateLevel(newTotal);
      const leveledUp = newLevel.id > oldLevel.id;

      // Actualizar en base de datos
      const updates = {
        total_points: newTotal,
        updated_at: new Date().toISOString()
      };

      // Actualizar contadores específicos
      if (POINT_ACTIONS[action].category === 'readings') {
        updates.readings_count = (currentStats.readings_count || 0) + 1;
      } else if (POINT_ACTIONS[action].category === 'sound' || 
                 POINT_ACTIONS[action].category === 'therapy') {
        updates.sessions_count = (currentStats.sessions_count || 0) + 1;
      } else if (POINT_ACTIONS[action].category === 'academy') {
        if (action === 'getCertification') {
          updates.courses_completed = (currentStats.courses_completed || 0) + 1;
        }
      }

      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache
      this.cache.stats = null;

      // Registrar en historial
      await this.logPointsHistory(userId, action, pointsToAdd, metadata);

      // Si subió de nivel, registrar logro
      if (leveledUp) {
        await this.unlockAchievement(userId, `level_${newLevel.id}`);
      }

      return {
        pointsAdded: pointsToAdd,
        newTotal,
        oldLevel,
        newLevel,
        leveledUp,
        action: POINT_ACTIONS[action].name
      };
    } catch (error) {
      console.error('Error al agregar puntos:', error);
      return null;
    }
  }

  /**
   * Registrar historial de puntos
   */
  async logPointsHistory(userId, action, points, metadata) {
    try {
      await supabase
        .from('points_history')
        .insert([{
          user_id: userId,
          action,
          points,
          metadata,
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error al registrar historial:', error);
    }
  }

  /**
   * Desbloquear logro
   */
  async unlockAchievement(userId, achievementId) {
    try {
      const currentStats = await this.getUserStats(userId);
      const achievements = currentStats.achievements || [];

      if (achievements.includes(achievementId)) {
        return; // Ya desbloqueado
      }

      achievements.push(achievementId);

      await supabase
        .from('user_stats')
        .update({ achievements })
        .eq('user_id', userId);

      // Invalidar cache
      this.cache.stats = null;

      // Agregar puntos del logro
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        await this.addPoints(userId, 'achievement_' + achievementId, { 
          achievement: achievement.name 
        });
      }

      return achievement;
    } catch (error) {
      console.error('Error al desbloquear logro:', error);
      return null;
    }
  }

  /**
   * Calcular nivel según puntos
   */
  calculateLevel(points) {
    for (let i = SPIRITUAL_LEVELS.length - 1; i >= 0; i--) {
      const level = SPIRITUAL_LEVELS[i];
      if (points >= level.minPoints) {
        return level;
      }
    }
    return SPIRITUAL_LEVELS[0];
  }

  /**
   * Calcular progreso dentro del nivel actual (0-100)
   */
  calculateLevelProgress(points) {
    const level = this.calculateLevel(points);
    const pointsInLevel = points - level.minPoints;
    const levelRange = level.maxPoints - level.minPoints;
    return Math.min(100, Math.floor((pointsInLevel / levelRange) * 100));
  }

  /**
   * Obtener logros desbloqueados
   */
  getUnlockedAchievements(userAchievements) {
    return ACHIEVEMENTS.filter(a => userAchievements.includes(a.id));
  }

  /**
   * Obtener logros bloqueados
   */
  getLockedAchievements(userAchievements) {
    return ACHIEVEMENTS.filter(a => !userAchievements.includes(a.id));
  }

  /**
   * Estadísticas por defecto (fallback)
   */
  getDefaultStats() {
    return {
      total_points: 0,
      readings_count: 0,
      sessions_count: 0,
      courses_completed: 0,
      achievements: [],
      daily_streak: 0,
      level: SPIRITUAL_LEVELS[0],
      progress: 0,
      nextLevel: SPIRITUAL_LEVELS[1],
      pointsToNextLevel: SPIRITUAL_LEVELS[1].minPoints
    };
  }

  /**
   * Actualizar racha diaria
   */
  async updateDailyStreak(userId) {
    try {
      const currentStats = await this.getUserStats(userId);
      const lastLogin = new Date(currentStats.last_login);
      const now = new Date();
      const daysDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

      let newStreak = currentStats.daily_streak || 0;

      if (daysDiff === 1) {
        // Día consecutivo
        newStreak += 1;
        
        // Premios por rachas
        if (newStreak === 7) {
          await this.addPoints(userId, 'weeklyStreak');
        } else if (newStreak === 30) {
          await this.addPoints(userId, 'monthlyStreak');
          await this.unlockAchievement(userId, 'daily_devotion');
        }
      } else if (daysDiff > 1) {
        // Se rompió la racha
        newStreak = 1;
      }

      await supabase
        .from('user_stats')
        .update({ 
          daily_streak: newStreak,
          last_login: now.toISOString()
        })
        .eq('user_id', userId);

      // Puntos por login diario
      await this.addPoints(userId, 'dailyLogin');

      this.cache.stats = null;

      return newStreak;
    } catch (error) {
      console.error('Error al actualizar racha:', error);
      return 0;
    }
  }

  /**
   * Limpiar cache
   */
  clearCache() {
    this.cache.stats = null;
    this.cache.lastFetch = null;
  }
}

// Exportar instancia singleton
const userStatsService = new UserStatsService();
export default userStatsService;

