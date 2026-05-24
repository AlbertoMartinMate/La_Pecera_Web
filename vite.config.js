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
        actividades: resolve(__dirname, 'actividades.html'),
        tarifas: resolve(__dirname, 'tarifas.html'),
        avisoLegal: resolve(__dirname, 'aviso-legal.html'),
        privacidad: resolve(__dirname, 'privacidad.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        subvencion: resolve(__dirname, 'subvencion.html'),
        equipos: resolve(__dirname, 'equipos.html'),
      },
    },
  },
});
