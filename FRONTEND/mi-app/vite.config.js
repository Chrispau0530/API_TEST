import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:8000',
      '/roles': 'http://localhost:8000',
      '/usuarios': 'http://localhost:8000',
      '/clientes': 'http://localhost:8000',
      '/servicios': 'http://localhost:8000',
      '/vehiculos': 'http://localhost:8000',
      '/productos': 'http://localhost:8000'
    }
  }
})
