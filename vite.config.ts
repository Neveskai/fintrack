import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  return {
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL ?? ''),
    },
    plugins: [
      react(),
      tsconfigPaths()
    ],
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
  }
})
