import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate', // auto updates the service worker
      injectRegister: 'auto',     // handles sw registration automatically

      manifest: {
        name: 'pccoe-ht',
        short_name: 'pccoe-ht',
        description: 'Smart hospital triage & appointment system',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
  {
    src: '/pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: '/pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png'
  },
  {
    src: '/pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any maskable'
  }
]

      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,               // enable PWA in dev mode
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
    }),
  ],
})
