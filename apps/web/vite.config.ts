import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@clean-link-kit/core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  }
});
