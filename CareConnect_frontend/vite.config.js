// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://careconnect-1-aayd.onrender.com', 
        changeOrigin: true,
        secure: false, 
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    manifest: true,
  },
});
