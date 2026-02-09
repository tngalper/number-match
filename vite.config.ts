
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-assets',
      apply: 'build',
      closeBundle() {
        // Ana dizinde olup dist klasörüne gitmesi gereken dosyalar
        const assets = ['sw.js', 'manifest.json'];
        assets.forEach(file => {
          // Fix: Use path.resolve directly as it resolves relative to the current working directory by default
          const src = path.resolve(file);
          const dest = path.resolve('dist', file);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`[CopyRootAssets] ${file} kopyalandı -> dist/${file}`);
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
  }
});
