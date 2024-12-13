import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base:'/',
  build: {
    outDir: 'htdocs', // Directorio de salida
  },
  define: {
    'process.env.BASE_URL': JSON.stringify(
      mode === 'development' ? 'http://localhost/LuzInterior/API/' : 'https://luz-interior.free.nf/API/'
    ),
  },
}));
