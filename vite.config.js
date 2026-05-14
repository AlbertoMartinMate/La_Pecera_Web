import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/La_Pecera_Web/',
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        escuela: resolve(__dirname, 'escuela.html'),
      },
    },
  },
});
