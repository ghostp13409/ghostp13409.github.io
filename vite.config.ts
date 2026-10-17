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
      // GIFs are excluded: the animated demo GIF exceeds sharp's pixel limit
      // and re-encoding animated GIFs gains nothing.
      test: /\.(jpe?g|png|tiff|webp|svg)$/i,
      // The embedded Flutter build ships its own optimized assets.
      exclude: /windchime-preview\//,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  server: {
    port: 3000,
  },
  base: '/',
})
