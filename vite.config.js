// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import path from 'path'

// Lista de rutas estáticas de la plataforma
const routes = [
  '/',
  '/login',
  '/registro',
  '/dashboard',
  '/apertura-angelical',
  '/consulta-en-vivo',
  '/academia',
  '/academia/cursos',
  '/sonoterapia',
  '/terapias',
  '/limpiezas',
  '/blog',
  '/podcast',
  '/tienda',
  '/tienda/productos',
  '/eventos',
  '/perfil',
  '/contacto',
  '/sobre-nosotros',
  '/terminos',
  '/privacidad',
];

export default defineConfig({
  base: '/', // 🟢 obligatorio
  plugins: [
    react(),
    sitemap({
      hostname: 'https://plataforma-angelica-dev.vercel.app',
      dynamicRoutes: routes,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      exclude: ['/admin', '/user/settings'],
      readable: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
