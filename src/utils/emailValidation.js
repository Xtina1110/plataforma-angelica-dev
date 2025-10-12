import { supabase } from '../supabase';

/**
 * Valida el formato de un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el formato es válido
 */
export const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Verifica si un email ya existe en la base de datos
 * @param {string} email - Email a verificar
 * @returns {Promise<{exists: boolean, error: string|null}>}
 */
export const checkEmailExists = async (email) => {
  try {
    // Verificar en la tabla profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 es el código de "no rows returned", que es válido
      console.error('Error checking email:', error);
      return { exists: false, error: 'Error al verificar el email' };
    }

    return { exists: !!data, error: null };
  } catch (err) {
    console.error('Exception checking email:', err);
    return { exists: false, error: 'Error al verificar el email' };
  }
};

/**
 * Valida un email de forma completa (formato + existencia)
 * @param {string} email - Email a validar
 * @returns {Promise<{valid: boolean, error: string|null}>}
 */
export const validateEmail = async (email) => {
  // Validar formato
  if (!isValidEmailFormat(email)) {
    return { valid: false, error: 'El formato del email no es válido' };
  }

  // Verificar si ya existe
  const { exists, error } = await checkEmailExists(email);
  
  if (error) {
    return { valid: false, error };
  }

  if (exists) {
    return { valid: false, error: 'Este email ya está registrado' };
  }

  return { valid: true, error: null };
};

/**
 * Valida un email en tiempo real con debounce
 * @param {string} email - Email a validar
 * @param {Function} callback - Función a llamar con el resultado
 * @param {number} delay - Tiempo de espera en ms (default: 500)
 */
export const validateEmailDebounced = (() => {
  let timeoutId = null;
  
  return (email, callback, delay = 500) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      const result = await validateEmail(email);
      callback(result);
    }, delay);
  };
})();

