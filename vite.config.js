// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '/', // 🟢 obligatorio
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          // Replace environment variables in HTML
          return html
            .replace(/%VITE_GA_MEASUREMENT_ID%/g, env.VITE_GA_MEASUREMENT_ID || '')
            .replace(/%VITE_MIXPANEL_TOKEN%/g, env.VITE_MIXPANEL_TOKEN || '')
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Make env variables available in the app
      'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(env.VITE_GA_MEASUREMENT_ID),
      'import.meta.env.VITE_MIXPANEL_TOKEN': JSON.stringify(env.VITE_MIXPANEL_TOKEN),
    }
  }
})

