import { supabase } from '../supabase';

// Arcángeles y sus atributos
const ARCHANGELS = [
  { name: 'Chamuel', attribute: 'Amor Incondicional', day: 2 }, // Martes
  { name: 'Gabriel', attribute: 'Comunicación Divina', day: 1 }, // Lunes
  { name: 'Jofiel', attribute: 'Sabiduría e Iluminación', day: 0 }, // Domingo
  { name: 'Miguel', attribute: 'Protección y Fortaleza', day: 3 }, // Miércoles
  { name: 'Rafael', attribute: 'Sanación y Bienestar', day: 4 }, // Jueves
  { name: 'Uriel', attribute: 'Luz de Dios', day: 5 }, // Viernes
  { name: 'Zadquiel', attribute: 'Transmutación y Perdón', day: 6 } // Sábado
];

/**
 * Obtiene el arcángel del día según el día de la semana
 * @param {Date} date - Fecha para obtener el arcángel
 * @returns {Object} - Arcángel del día
 */
const getArchangelOfDay = (date = new Date()) => {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
  return ARCHANGELS.find(arch => arch.day === dayOfWeek) || ARCHANGELS[0];
};

/**
 * Genera un mensaje angélico usando OpenAI
 * @param {string} archangelName - Nombre del arcángel
 * @param {string} attribute - Atributo del arcángel
 * @param {Object} userData - Datos del usuario (opcional)
 * @returns {Promise<string>} - Mensaje generado
 */
const generateMessageWithAI = async (archangelName, attribute, userData = {}) => {
  try {
    // Aquí se integraría con OpenAI API
    // Por ahora, retornamos un mensaje predefinido
    const messages = {
      'Chamuel': [
        'El amor incondicional fluye desde tu corazón hacia todo lo que te rodea. Eres un canal de amor divino.',
        'Hoy es un día perfecto para expresar amor y gratitud a quienes te rodean. El amor que das regresa multiplicado.',
        'Tu capacidad de amar es infinita. Permítete dar y recibir amor sin condiciones.'
      ],
      'Gabriel': [
        'Tus palabras tienen poder divino. Úsalas para crear, sanar y elevar a otros.',
        'La comunicación clara y amorosa abre puertas que creías cerradas. Habla desde el corazón.',
        'Hoy es un día excelente para expresar tus verdades con claridad y compasión.'
      ],
      'Jofiel': [
        'La sabiduría divina fluye a través de ti. Confía en tu intuición y en tu conocimiento interior.',
        'Cada experiencia es una oportunidad para aprender y crecer. Abraza la sabiduría que viene de cada momento.',
        'Tu mente es un templo de luz. Llénala de pensamientos elevados y positivos.'
      ],
      'Miguel': [
        'Estás protegido por la luz divina. Ningún mal puede tocarte cuando caminas en tu verdad.',
        'Tu fortaleza interior es inquebrantable. Confía en tu poder y en tu capacidad de superar cualquier desafío.',
        'Hoy corto todas las cuerdas que te atan al miedo. Eres libre, fuerte y protegido.'
      ],
      'Rafael': [
        'La energía sanadora fluye a través de ti. Permítete recibir sanación en todos los niveles de tu ser.',
        'Tu cuerpo, mente y espíritu están en perfecta armonía. La salud divina es tu estado natural.',
        'Hoy es un día perfecto para cuidar de ti mismo con amor y compasión. Tu bienestar es prioritario.'
      ],
      'Uriel': [
        'La luz de Dios ilumina tu camino. Cada paso que das está guiado por la sabiduría divina.',
        'Tu intuición es clara y precisa. Confía en las señales que recibes del universo.',
        'Hoy brilla tu luz interior con más fuerza que nunca. Eres un faro de esperanza para otros.'
      ],
      'Zadquiel': [
        'El perdón libera tu alma y abre espacio para milagros. Suelta el pasado con amor.',
        'La transmutación está ocurriendo en tu vida. Lo viejo se transforma en nuevo, lo denso en luz.',
        'Hoy es un día perfecto para perdonarte a ti mismo y a otros. El perdón es el camino a la libertad.'
      ]
    };

    const archangelMessages = messages[archangelName] || messages['Miguel'];
    const randomIndex = Math.floor(Math.random() * archangelMessages.length);
    
    return archangelMessages[randomIndex];
  } catch (error) {
    console.error('Error generating AI message:', error);
    return `Que la luz y el amor del Arcángel ${archangelName} te acompañen en este día.`;
  }
};

/**
 * Obtiene o genera el mensaje del día para un usuario
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos del usuario (opcional)
 * @returns {Promise<Object>} - Mensaje del día
 */
export const getDailyMessage = async (userId, userData = {}) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Verificar si ya existe un mensaje para hoy
    const { data: existingMessage, error: fetchError } = await supabase
      .from('daily_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('generated_date', todayStr)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Si ya existe, retornarlo
    if (existingMessage) {
      return {
        success: true,
        data: existingMessage,
        isNew: false
      };
    }

    // Si no existe, generar uno nuevo
    const archangel = getArchangelOfDay(today);
    const messageText = await generateMessageWithAI(
      archangel.name,
      archangel.attribute,
      userData
    );

    // Guardar en la base de datos
    const { data: newMessage, error: insertError } = await supabase
      .from('daily_messages')
      .insert({
        user_id: userId,
        archangel_name: archangel.name,
        archangel_attribute: archangel.attribute,
        message_text: messageText,
        generated_date: todayStr,
        day_of_week: today.getDay(),
        is_ai_generated: true
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      success: true,
      data: newMessage,
      isNew: true
    };
  } catch (error) {
    console.error('Error getting daily message:', error);
    
    // Retornar mensaje de fallback
    const archangel = getArchangelOfDay();
    return {
      success: false,
      data: {
        archangel_name: archangel.name,
        archangel_attribute: archangel.attribute,
        message_text: `Que la luz y el amor del Arcángel ${archangel.name} te acompañen en este día.`,
        generated_date: new Date().toISOString().split('T')[0],
        day_of_week: new Date().getDay(),
        is_ai_generated: false
      },
      error: error.message
    };
  }
};

/**
 * Obtiene el historial de mensajes del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limit - Límite de mensajes a retornar
 * @returns {Promise<Array>} - Array de mensajes
 */
export const getMessageHistory = async (userId, limit = 30) => {
  try {
    const { data, error } = await supabase
      .from('daily_messages')
      .select('*')
      .eq('user_id', userId)
      .order('generated_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting message history:', error);
    return [];
  }
};

/**
 * Obtiene información del arcángel del día
 * @param {Date} date - Fecha (opcional, por defecto hoy)
 * @returns {Object} - Información del arcángel
 */
export const getArchangelInfo = (date = new Date()) => {
  return getArchangelOfDay(date);
};

