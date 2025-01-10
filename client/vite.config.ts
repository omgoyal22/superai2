import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000, // Ensure the server runs on a port
    host: true, // Allow external access
  },
  preview: {
    port: 3000, // Ensure the preview server runs on a port
    host: true, // Allow external access
  },
});