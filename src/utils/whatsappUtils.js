/**
 * WhatsApp Business API Integration
 * 
 * Este módulo maneja todas las comunicaciones con WhatsApp Business API
 * para enviar notificaciones y mensajes a los usuarios.
 */

// Configuración de WhatsApp Business API
const WHATSAPP_CONFIG = {
  apiUrl: process.env.REACT_APP_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  phoneNumberId: process.env.REACT_APP_WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.REACT_APP_WHATSAPP_ACCESS_TOKEN,
  businessAccountId: process.env.REACT_APP_WHATSAPP_BUSINESS_ACCOUNT_ID
};

/**
 * Enviar mensaje de texto simple por WhatsApp
 * @param {string} to - Número de teléfono del destinatario (formato internacional)
 * @param {string} message - Mensaje a enviar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await fetch(
      `${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''), // Limpiar formato
          type: 'text',
          text: {
            body: message
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error al enviar mensaje de WhatsApp');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

/**
 * Enviar mensaje usando template de WhatsApp
 * @param {string} to - Número de teléfono del destinatario
 * @param {string} templateName - Nombre del template aprobado
 * @param {string} languageCode - Código de idioma (es, en, etc.)
 * @param {Array} components - Componentes del template (variables)
 * @returns {Promise<Object>} Respuesta de la API
 */
export const sendWhatsAppTemplate = async (to, templateName, languageCode = 'es', components = []) => {
  try {
    const response = await fetch(
      `${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components: components
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error al enviar template de WhatsApp');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp template:', error);
    throw error;
  }
};

/**
 * Enviar notificación de bienvenida por WhatsApp
 * @param {string} phoneNumber - Número de teléfono del usuario
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<Object>}
 */
export const sendWelcomeNotification = async (phoneNumber, userName) => {
  const message = `¡Bienvenido/a a Plataforma Angélica, ${userName}! 🕊️✨

Tu registro ha sido completado exitosamente. Ahora puedes:

🎴 Acceder a tu Tirada Angélica personalizada
🎵 Disfrutar de Canalizaciones y Sonoterapia
💜 Reservar consultas con terapeutas certificados
📚 Explorar la Academia Angélica

¡Que tu camino espiritual esté lleno de luz! 💫

Equipo Plataforma Angélica`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Enviar recordatorio de cita por WhatsApp
 * @param {string} phoneNumber - Número de teléfono
 * @param {Object} appointmentData - Datos de la cita
 * @returns {Promise<Object>}
 */
export const sendAppointmentReminder = async (phoneNumber, appointmentData) => {
  const { therapistName, date, time, service } = appointmentData;
  
  const message = `📅 Recordatorio de Cita - Plataforma Angélica

Hola! Te recordamos tu próxima sesión:

👤 Terapeuta: ${therapistName}
🗓️ Fecha: ${date}
🕐 Hora: ${time}
💆 Servicio: ${service}

Por favor, confirma tu asistencia respondiendo a este mensaje.

¡Nos vemos pronto! 🕊️`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Enviar confirmación de pago por WhatsApp
 * @param {string} phoneNumber - Número de teléfono
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<Object>}
 */
export const sendPaymentConfirmation = async (phoneNumber, paymentData) => {
  const { amount, plan, transactionId } = paymentData;
  
  const message = `✅ Pago Confirmado - Plataforma Angélica

Tu pago ha sido procesado exitosamente:

💳 Plan: ${plan}
💰 Monto: €${amount}
🔢 ID Transacción: ${transactionId}

¡Gracias por tu confianza! Ahora tienes acceso completo a todas las funcionalidades de tu plan.

Equipo Plataforma Angélica 💜`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Enviar notificación de nueva consulta disponible
 * @param {string} phoneNumber - Número de teléfono
 * @param {string} therapistName - Nombre del terapeuta
 * @returns {Promise<Object>}
 */
export const sendNewConsultationNotification = async (phoneNumber, therapistName) => {
  const message = `🔔 Nueva Consulta Disponible

${therapistName} ha respondido a tu consulta en Plataforma Angélica.

Ingresa a tu cuenta para ver la respuesta:
https://plataforma-angelica.com/consultas

¡Que tengas un día lleno de luz! ✨`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Enviar notificación de contenido nuevo
 * @param {string} phoneNumber - Número de teléfono
 * @param {Object} contentData - Datos del contenido
 * @returns {Promise<Object>}
 */
export const sendNewContentNotification = async (phoneNumber, contentData) => {
  const { title, type, url } = contentData;
  
  const message = `✨ Nuevo Contenido Disponible

Hemos publicado nuevo contenido que te puede interesar:

📝 ${title}
🎯 Tipo: ${type}

Ver ahora: ${url}

Equipo Plataforma Angélica 🕊️`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Enviar mensaje de verificación de número de teléfono
 * @param {string} phoneNumber - Número de teléfono
 * @param {string} code - Código de verificación
 * @returns {Promise<Object>}
 */
export const sendPhoneVerification = async (phoneNumber, code) => {
  const message = `🔐 Código de Verificación - Plataforma Angélica

Tu código de verificación es: ${code}

Este código expirará en 10 minutos.

Si no solicitaste este código, ignora este mensaje.

Equipo Plataforma Angélica`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Enviar notificación de suscripción próxima a vencer
 * @param {string} phoneNumber - Número de teléfono
 * @param {Object} subscriptionData - Datos de la suscripción
 * @returns {Promise<Object>}
 */
export const sendSubscriptionExpiryNotification = async (phoneNumber, subscriptionData) => {
  const { plan, expiryDate, daysLeft } = subscriptionData;
  
  const message = `⏰ Renovación de Suscripción

Tu suscripción al plan ${plan} vencerá en ${daysLeft} días (${expiryDate}).

Para continuar disfrutando de todos los beneficios, renueva tu suscripción:
https://plataforma-angelica.com/suscripcion

¿Necesitas ayuda? Contáctanos.

Equipo Plataforma Angélica 💜`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Verificar si el número de WhatsApp es válido
 * @param {string} phoneNumber - Número de teléfono
 * @returns {Promise<boolean>}
 */
export const verifyWhatsAppNumber = async (phoneNumber) => {
  try {
    // Limpiar número
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Validar formato básico
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      return false;
    }

    // Aquí podrías hacer una llamada a la API de WhatsApp para verificar
    // si el número está registrado en WhatsApp
    // Por ahora, solo validamos el formato
    
    return true;
  } catch (error) {
    console.error('Error verifying WhatsApp number:', error);
    return false;
  }
};

/**
 * Obtener estado de un mensaje enviado
 * @param {string} messageId - ID del mensaje
 * @returns {Promise<Object>}
 */
export const getMessageStatus = async (messageId) => {
  try {
    const response = await fetch(
      `${WHATSAPP_CONFIG.apiUrl}/${messageId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener estado del mensaje');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting message status:', error);
    throw error;
  }
};

/**
 * Enviar notificación según preferencias del usuario
 * @param {Object} user - Datos del usuario
 * @param {string} type - Tipo de notificación
 * @param {Object} data - Datos de la notificación
 * @returns {Promise<Object>}
 */
export const sendNotification = async (user, type, data) => {
  const { preferred_contact, phone, email } = user;

  // Si el usuario prefiere WhatsApp o ambos métodos
  if (preferred_contact === 'whatsapp' || preferred_contact === 'both') {
    if (phone) {
      try {
        switch (type) {
          case 'welcome':
            return await sendWelcomeNotification(phone, user.full_name);
          
          case 'appointment_reminder':
            return await sendAppointmentReminder(phone, data);
          
          case 'payment_confirmation':
            return await sendPaymentConfirmation(phone, data);
          
          case 'new_consultation':
            return await sendNewConsultationNotification(phone, data.therapistName);
          
          case 'new_content':
            return await sendNewContentNotification(phone, data);
          
          case 'subscription_expiry':
            return await sendSubscriptionExpiryNotification(phone, data);
          
          default:
            console.warn('Unknown notification type:', type);
        }
      } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        // Si falla WhatsApp, intentar con email como fallback
        if (preferred_contact === 'both' && email) {
          // Aquí se enviaría por email
          console.log('Fallback to email:', email);
        }
      }
    }
  }

  // Si el usuario prefiere email o no tiene WhatsApp configurado
  if (preferred_contact === 'email' || !phone) {
    // Enviar por email
    console.log('Sending email notification to:', email);
    // Implementar envío de email aquí
  }
};

export default {
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  sendWelcomeNotification,
  sendAppointmentReminder,
  sendPaymentConfirmation,
  sendNewConsultationNotification,
  sendNewContentNotification,
  sendPhoneVerification,
  sendSubscriptionExpiryNotification,
  verifyWhatsAppNumber,
  getMessageStatus,
  sendNotification
};

