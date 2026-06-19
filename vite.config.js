import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Replace 'veil-studio' with your repository name if it is different
  base: process.env.NODE_ENV === 'production' ? '/veil-studio/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})

