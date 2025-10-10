/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors from CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        
        // Modern Podcast Colors
        'podcast-dark': 'hsl(220 13% 18%)',
        'podcast-darker': 'hsl(220 15% 12%)',
        'podcast-orange': 'hsl(24 80% 55%)',
        'podcast-orange-hover': 'hsl(24 80% 50%)',
        'podcast-red-overlay': 'hsl(0 85% 50%)',
        'podcast-text-light': 'hsl(0 0% 100%)',
        'podcast-text-muted': 'hsl(220 9% 70%)',
        
        // Original colors for compatibility
        dorado: '#d4af37',
        'dorado-claro': '#f4e4a6',
        'dorado-oscuro': '#b8941f',
        morado: '#6a0dad',
        lavanda: '#e6e6fa',
        'blanco-transparente': 'rgba(255, 255, 255, 0.85)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        marmoleado: "url('/src/assets/Fondomarmoleado.jpg')",
        'san-miguel': "url('/src/assets/FondoPantallaIniciovf.png')",
        'gradient-hero': 'linear-gradient(135deg, hsl(220 13% 18%), hsl(0 85% 20%))',
        'gradient-orange': 'linear-gradient(135deg, hsl(24 80% 55%), hsl(14 90% 50%))',
        'gradient-dark': 'linear-gradient(180deg, hsl(220 13% 18%), hsl(220 15% 12%))',
      },
      boxShadow: {
        angelical: '0 4px 20px rgba(106, 13, 173, 0.3)',
        dorado: '0 4px 20px rgba(212, 175, 55, 0.4)',
        'podcast': '0 10px 30px -5px hsl(220 13% 18% / 0.5)',
        'card': '0 4px 20px -2px hsl(220 13% 18% / 0.1)',
      },
      animation: {
        'hero-glow': 'heroGlow 6s ease-in-out infinite alternate',
        'card-float': 'cardFloat 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
