import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function copyManifest(): Plugin {
  return {
    name: 'copy-extension-files',
    async closeBundle() {
      await mkdir(path.resolve(__dirname, 'dist'), { recursive: true });
      await mkdir(path.resolve(__dirname, 'dist/popup'), { recursive: true });
      await copyFile(path.resolve(__dirname, 'manifest.json'), path.resolve(__dirname, 'dist/manifest.json'));
      await copyFile(path.resolve(__dirname, 'dist/src/popup/index.html'), path.resolve(__dirname, 'dist/popup/index.html'));
    }
  };
}

export default defineConfig({
  plugins: [copyManifest()],
  resolve: {
    alias: {
      '@clean-link-kit/core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background.ts'),
        content: path.resolve(__dirname, 'src/content.ts'),
        popup: path.resolve(__dirname, 'src/popup/index.html')
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') {
            return 'background.js';
          }

          if (chunk.name === 'content') {
            return 'content.js';
          }

          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
