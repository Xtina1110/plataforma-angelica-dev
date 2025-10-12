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
          // Use placeholder if not defined to prevent errors
          const gaId = env.VITE_GA_MEASUREMENT_ID || '%VITE_GA_MEASUREMENT_ID%'
          const mixpanelToken = env.VITE_MIXPANEL_TOKEN || '%VITE_MIXPANEL_TOKEN%'
          
          return html
            .replace(/%VITE_GA_MEASUREMENT_ID%/g, gaId)
            .replace(/%VITE_MIXPANEL_TOKEN%/g, mixpanelToken)
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})

