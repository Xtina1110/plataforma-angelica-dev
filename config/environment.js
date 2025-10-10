// Environment configuration
export const config = {
  development: {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    stripe: {
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY
    },
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    },
    webrtc: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }
  },
  
  production: {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    stripe: {
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY
    },
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    },
    webrtc: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  }
};

const env = import.meta.env.MODE || 'development';
export default config[env];