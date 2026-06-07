import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { lossy: true, quality: 80 },
    }),
  ],
  server: {
    port: 3000,
  },
  base: '/',
})
