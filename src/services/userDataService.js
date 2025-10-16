import { supabase } from '../supabase';

/**
 * Carga los datos completos del usuario desde Supabase
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos del usuario
 */
export const loadUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data || {},
      error: null
    };
  } catch (err) {
    console.error('Error loading user data:', err);
    return {
      success: false,
      data: null,
      error: err.message
    };
  }
};

/**
 * Carga la actividad del usuario (racha de días)
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos de actividad
 */
export const loadUserActivity = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Si no existe el registro, crear uno nuevo
      if (error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('user_activity')
          .insert({
            user_id: userId,
            consecutive_days: 1,
            total_logins: 1,
            longest_streak: 1,
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return { success: true, data: newData, error: null };
      }
      throw error;
    }

    return {
      success: true,
      data: data || { consecutive_days: 1, total_logins: 1, longest_streak: 1 },
      error: null
    };
  } catch (err) {
    console.error('Error loading user activity:', err);
    return {
      success: false,
      data: { consecutive_days: 1, total_logins: 1, longest_streak: 1 },
      error: err.message
    };
  }
};

/**
 * Actualiza el último login del usuario y calcula racha de días
 * @param {string} userId - ID del usuario
 */
export const updateLastLogin = async (userId) => {
  try {
    // Obtener actividad actual
    const { data: currentActivity, error: fetchError } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .single();

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (fetchError && fetchError.code === 'PGRST116') {
      // No existe registro, crear uno nuevo
      const { error: insertError } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          consecutive_days: 1,
          total_logins: 1,
          longest_streak: 1,
          last_login: now.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });
      
      if (insertError) throw insertError;
      return { success: true, error: null };
    }

    if (fetchError) throw fetchError;

    // Calcular si es un nuevo día
    const lastLoginDate = currentActivity.last_login ? new Date(currentActivity.last_login).toISOString().split('T')[0] : null;
    const isNewDay = lastLoginDate !== today;
    
    let consecutiveDays = currentActivity.consecutive_days || 1;
    let longestStreak = currentActivity.longest_streak || 1;
    
    if (isNewDay && lastLoginDate) {
      // Calcular diferencia de días
      const lastDate = new Date(lastLoginDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Login consecutivo
        consecutiveDays += 1;
        longestStreak = Math.max(longestStreak, consecutiveDays);
      } else if (diffDays > 1) {
        // Racha rota
        consecutiveDays = 1;
      }
    }

    // Actualizar registro
    const { error: updateError } = await supabase
      .from('user_activity')
      .update({
        consecutive_days: consecutiveDays,
        total_logins: (currentActivity.total_logins || 0) + 1,
        longest_streak: longestStreak,
        last_login: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error updating last login:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Carga el contador del carrito
 * @param {string} userId - ID del usuario
 * @returns {Promise<number>} - Número de items en el carrito
 */
export const loadCartCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error('Error loading cart count:', err);
    return 0;
  }
};

/**
 * Carga el contador de notificaciones no leídas
 * @param {string} userId - ID del usuario
 * @returns {Promise<number>} - Número de notificaciones no leídas
 */
export const loadUnreadNotifications = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error('Error loading unread notifications:', err);
    return 0;
  }
};

/**
 * Carga todas las notificaciones del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limit - Límite de notificaciones a cargar
 * @returns {Promise<Array>} - Array de notificaciones
 */
export const loadNotifications = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error loading notifications:', err);
    return [];
  }
};

/**
 * Marca una notificación como leída
 * @param {string} notificationId - ID de la notificación
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error marking notification as read:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Marca todas las notificaciones como leídas
 * @param {string} userId - ID del usuario
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Carga el mensaje del día del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Mensaje del día
 */
export const loadDailyMessage = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('generated_date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error('Error loading daily message:', err);
    return {
      success: false,
      data: null,
      error: err.message
    };
  }
};

/**
 * Carga los logros del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} - Array de logros desbloqueados
 */
export const loadUserAchievements = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error loading user achievements:', err);
    return [];
  }
};

/**
 * Carga todos los logros disponibles
 * @returns {Promise<Array>} - Array de todos los logros
 */
export const loadAllAchievements = async () => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points_reward', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error loading achievements:', err);
    return [];
  }
};

