import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/notes': 'http://localhost:5001',
      '/translate': 'http://localhost:5001',
      '/extract': 'http://localhost:5001',
    },
  },
});
