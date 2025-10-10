// Application constants
export const APP_CONFIG = {
  name: 'Plataforma Angélica',
  version: '2.0.0',
  description: 'Sistema completo de consultas angélicas con IA y AR',
  author: 'Equipo Angélico',
  website: 'https://angelical-platform.com'
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CARDS: '/tirada-angelical',
  LIVE_CONSULTATION: '/consulta-en-vivo',
  AFFILIATES: '/afiliados',
  PAYMENTS: '/pagos',
  SETTINGS: '/configuracion'
};

export const CARD_TYPES = {
  ANGEL: 'angel',
  ARCHANGEL: 'arcangel',
  GUIDANCE: 'guia',
  PROTECTION: 'proteccion'
};

export const CONSULTATION_TYPES = {
  GENERAL: 'general',
  LOVE: 'amor',
  WORK: 'trabajo',
  HEALTH: 'salud',
  SPIRITUAL: 'espiritual'
};

export const PAYMENT_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Básico',
    price: 9.99,
    currency: 'EUR',
    features: ['3 consultas/mes', 'Cartas básicas', 'Soporte email']
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: 'EUR',
    features: ['Consultas ilimitadas', 'Todas las cartas', 'IA avanzada', 'Soporte prioritario']
  },
  VIP: {
    id: 'vip',
    name: 'VIP',
    price: 39.99,
    currency: 'EUR',
    features: ['Todo Premium', 'Consultas en vivo', 'AR exclusivo', 'Coach personal']
  }
};

export const LANGUAGES = {
  ES: { code: 'es', name: 'Español', flag: '🇪🇸' },
  EN: { code: 'en', name: 'English', flag: '🇺🇸' },
  FR: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  IT: { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  PT: { code: 'pt', name: 'Português', flag: '🇧🇷' }
};

export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  WHATSAPP: 'whatsapp'
};

export const AI_INTERPRETATION_STYLES = {
  TRADITIONAL: 'traditional',
  MODERN: 'modern',
  MYSTICAL: 'mystical',
  PRACTICAL: 'practical'
};

export const AFFILIATE_SETTINGS = {
  DEFAULT_COMMISSION: 0.20, // 20%
  MINIMUM_PAYOUT: 50, // €50
  PAYOUT_SCHEDULE: 'monthly'
};

export const REMINDER_TYPES = {
  DAILY_MESSAGE: 'daily_message',
  CONSULTATION: 'consultation',
  MEDITATION: 'meditation',
  ENERGY_CLEANSING: 'energy_cleansing'
};