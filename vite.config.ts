import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works both on a custom domain and on a
// GitHub Pages sub-path (routing is hash-based).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});
