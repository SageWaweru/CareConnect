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
  base: "/static/",  // Change Vite's output path to use Django's static URL
  build: {
    outDir: "../care_app/static/",  // Ensure it outputs to Django's static directory
    emptyOutDir: true, // Clears old files on rebuild
    manifest: true, // Generates manifest.json for Django to use
  }
});
