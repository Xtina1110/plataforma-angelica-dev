// Planes de suscripción de Plataforma Angélica

export const subscriptionPlans = {
  gratis: {
    id: 'gratis',
    name: 'Gratis',
    nameEnglish: 'Free',
    price: 0,
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'EUR',
    stripePriceId: null, // No requiere Stripe
    color: 'from-gray-400 to-gray-600',
    icon: '🌟',
    popular: false,
    description: 'Acceso básico a la plataforma',
    descriptionEnglish: 'Basic platform access',
    features: [
      {
        name: 'Acceso al dashboard',
        included: true,
        limit: null
      },
      {
        name: 'Perfil personalizado',
        included: true,
        limit: null
      },
      {
        name: 'Consultas con terapeutas',
        included: true,
        limit: '1 consulta/mes'
      },
      {
        name: 'Meditaciones guiadas',
        included: true,
        limit: 'Biblioteca básica'
      },
      {
        name: 'Mensaje del día',
        included: true,
        limit: null
      },
      {
        name: 'Soporte por email',
        included: true,
        limit: '48h respuesta'
      },
      {
        name: 'Grabación de sesiones',
        included: false,
        limit: null
      },
      {
        name: 'Traducción en tiempo real',
        included: false,
        limit: null
      },
      {
        name: 'Consultas ilimitadas',
        included: false,
        limit: null
      },
      {
        name: 'Acceso a talleres',
        included: false,
        limit: null
      }
    ],
    limits: {
      consultationsPerMonth: 1,
      meditationsAccess: 'basic',
      recordingSessions: false,
      realtimeTranslation: false,
      workshopsAccess: false,
      prioritySupport: false,
      customThemes: false,
      apiAccess: false
    }
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    nameEnglish: 'Premium',
    price: 19.99,
    priceMonthly: 19.99,
    priceYearly: 199.99, // 2 meses gratis
    currency: 'EUR',
    stripePriceIdMonthly: 'price_premium_monthly', // Reemplazar con ID real de Stripe
    stripePriceIdYearly: 'price_premium_yearly',
    color: 'from-purple-500 to-violet-600',
    icon: '✨',
    popular: true,
    description: 'Perfecto para usuarios regulares',
    descriptionEnglish: 'Perfect for regular users',
    features: [
      {
        name: 'Todo de Gratis',
        included: true,
        limit: null
      },
      {
        name: 'Consultas con terapeutas',
        included: true,
        limit: '5 consultas/mes'
      },
      {
        name: 'Meditaciones guiadas',
        included: true,
        limit: 'Biblioteca completa'
      },
      {
        name: 'Grabación de sesiones',
        included: true,
        limit: 'Hasta 10 sesiones'
      },
      {
        name: 'Traducción en tiempo real',
        included: true,
        limit: null
      },
      {
        name: 'Acceso a talleres',
        included: true,
        limit: '2 talleres/mes'
      },
      {
        name: 'Soporte prioritario',
        included: true,
        limit: '24h respuesta'
      },
      {
        name: 'Temas personalizados',
        included: true,
        limit: '3 temas'
      },
      {
        name: 'Consultas ilimitadas',
        included: false,
        limit: null
      },
      {
        name: 'API Access',
        included: false,
        limit: null
      }
    ],
    limits: {
      consultationsPerMonth: 5,
      meditationsAccess: 'full',
      recordingSessions: true,
      recordingLimit: 10,
      realtimeTranslation: true,
      workshopsAccess: true,
      workshopsPerMonth: 2,
      prioritySupport: true,
      customThemes: true,
      themesLimit: 3,
      apiAccess: false
    }
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    nameEnglish: 'Pro',
    price: 49.99,
    priceMonthly: 49.99,
    priceYearly: 499.99, // 2 meses gratis
    currency: 'EUR',
    stripePriceIdMonthly: 'price_pro_monthly',
    stripePriceIdYearly: 'price_pro_yearly',
    color: 'from-blue-500 to-cyan-600',
    icon: '💎',
    popular: false,
    description: 'Para usuarios avanzados y terapeutas',
    descriptionEnglish: 'For advanced users and therapists',
    features: [
      {
        name: 'Todo de Premium',
        included: true,
        limit: null
      },
      {
        name: 'Consultas ilimitadas',
        included: true,
        limit: null
      },
      {
        name: 'Grabación ilimitada',
        included: true,
        limit: null
      },
      {
        name: 'Talleres ilimitados',
        included: true,
        limit: null
      },
      {
        name: 'Soporte VIP',
        included: true,
        limit: '2h respuesta'
      },
      {
        name: 'Temas ilimitados',
        included: true,
        limit: null
      },
      {
        name: 'Perfil de terapeuta',
        included: true,
        limit: null
      },
      {
        name: 'Calendario avanzado',
        included: true,
        limit: null
      },
      {
        name: 'Analytics detallados',
        included: true,
        limit: null
      },
      {
        name: 'API Access',
        included: true,
        limit: 'Básico'
      }
    ],
    limits: {
      consultationsPerMonth: -1, // Ilimitado
      meditationsAccess: 'full',
      recordingSessions: true,
      recordingLimit: -1, // Ilimitado
      realtimeTranslation: true,
      workshopsAccess: true,
      workshopsPerMonth: -1, // Ilimitado
      prioritySupport: true,
      vipSupport: true,
      customThemes: true,
      themesLimit: -1, // Ilimitado
      therapistProfile: true,
      advancedCalendar: true,
      analytics: true,
      apiAccess: 'basic'
    }
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    nameEnglish: 'Enterprise',
    price: 199.99,
    priceMonthly: 199.99,
    priceYearly: 1999.99, // 2 meses gratis
    currency: 'EUR',
    stripePriceIdMonthly: 'price_enterprise_monthly',
    stripePriceIdYearly: 'price_enterprise_yearly',
    color: 'from-yellow-500 to-amber-600',
    icon: '👑',
    popular: false,
    description: 'Para centros y organizaciones',
    descriptionEnglish: 'For centers and organizations',
    features: [
      {
        name: 'Todo de Pro',
        included: true,
        limit: null
      },
      {
        name: 'Múltiples terapeutas',
        included: true,
        limit: 'Hasta 10'
      },
      {
        name: 'Gestión de equipo',
        included: true,
        limit: null
      },
      {
        name: 'Branding personalizado',
        included: true,
        limit: null
      },
      {
        name: 'Dominio propio',
        included: true,
        limit: null
      },
      {
        name: 'Soporte dedicado',
        included: true,
        limit: '1h respuesta'
      },
      {
        name: 'API Access completo',
        included: true,
        limit: null
      },
      {
        name: 'Webhooks',
        included: true,
        limit: null
      },
      {
        name: 'SLA garantizado',
        included: true,
        limit: '99.9%'
      },
      {
        name: 'Onboarding personalizado',
        included: true,
        limit: null
      }
    ],
    limits: {
      consultationsPerMonth: -1,
      meditationsAccess: 'full',
      recordingSessions: true,
      recordingLimit: -1,
      realtimeTranslation: true,
      workshopsAccess: true,
      workshopsPerMonth: -1,
      prioritySupport: true,
      vipSupport: true,
      dedicatedSupport: true,
      customThemes: true,
      themesLimit: -1,
      therapistProfile: true,
      multipleTherapists: true,
      therapistsLimit: 10,
      advancedCalendar: true,
      analytics: true,
      teamManagement: true,
      customBranding: true,
      customDomain: true,
      apiAccess: 'full',
      webhooks: true,
      sla: '99.9%'
    }
  }
};

// Tipos de usuario
export const userTypes = {
  usuario: {
    id: 'usuario',
    name: 'Usuario',
    nameEnglish: 'User',
    description: 'Busco terapias y consultas espirituales',
    descriptionEnglish: 'Looking for therapies and spiritual consultations',
    icon: '👤',
    color: 'from-blue-500 to-cyan-600',
    defaultPlan: 'gratis',
    availablePlans: ['gratis', 'premium', 'pro'],
    features: [
      'Reservar consultas',
      'Acceder a meditaciones',
      'Participar en talleres',
      'Recibir mensaje del día'
    ]
  },
  
  terapeuta: {
    id: 'terapeuta',
    name: 'Terapeuta',
    nameEnglish: 'Therapist',
    description: 'Ofrezco terapias y consultas espirituales',
    descriptionEnglish: 'Offering therapies and spiritual consultations',
    icon: '🧘',
    color: 'from-purple-500 to-violet-600',
    defaultPlan: 'pro',
    availablePlans: ['pro', 'enterprise'],
    features: [
      'Perfil de terapeuta',
      'Gestionar consultas',
      'Calendario avanzado',
      'Recibir pagos'
    ],
    requiresVerification: true
  },
  
  centro: {
    id: 'centro',
    name: 'Centro/Organización',
    nameEnglish: 'Center/Organization',
    description: 'Gestiono un centro de terapias',
    descriptionEnglish: 'Managing a therapy center',
    icon: '🏢',
    color: 'from-yellow-500 to-amber-600',
    defaultPlan: 'enterprise',
    availablePlans: ['enterprise'],
    features: [
      'Múltiples terapeutas',
      'Gestión de equipo',
      'Branding personalizado',
      'Analytics avanzados'
    ],
    requiresVerification: true
  }
};

// Comparación de planes (para tabla)
export const planComparison = [
  {
    feature: 'Consultas mensuales',
    gratis: '1',
    premium: '5',
    pro: 'Ilimitadas',
    enterprise: 'Ilimitadas'
  },
  {
    feature: 'Meditaciones',
    gratis: 'Básicas',
    premium: 'Completas',
    pro: 'Completas',
    enterprise: 'Completas'
  },
  {
    feature: 'Grabación de sesiones',
    gratis: '❌',
    premium: '✅ (10)',
    pro: '✅ Ilimitado',
    enterprise: '✅ Ilimitado'
  },
  {
    feature: 'Traducción en tiempo real',
    gratis: '❌',
    premium: '✅',
    pro: '✅',
    enterprise: '✅'
  },
  {
    feature: 'Talleres',
    gratis: '❌',
    premium: '2/mes',
    pro: 'Ilimitados',
    enterprise: 'Ilimitados'
  },
  {
    feature: 'Soporte',
    gratis: '48h',
    premium: '24h',
    pro: '2h VIP',
    enterprise: '1h Dedicado'
  },
  {
    feature: 'Temas personalizados',
    gratis: '❌',
    premium: '3',
    pro: 'Ilimitados',
    enterprise: 'Ilimitados'
  },
  {
    feature: 'Perfil de terapeuta',
    gratis: '❌',
    premium: '❌',
    pro: '✅',
    enterprise: '✅'
  },
  {
    feature: 'Múltiples terapeutas',
    gratis: '❌',
    premium: '❌',
    pro: '❌',
    enterprise: '✅ (10)'
  },
  {
    feature: 'API Access',
    gratis: '❌',
    premium: '❌',
    pro: 'Básico',
    enterprise: 'Completo'
  }
];

export default subscriptionPlans;

