import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // This tells Vite to look at ./index.html
  resolve: {
    alias: {
      '@daily/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
    },
  },
});
