// base: '/' — custom domain lapecerapadelclub.com
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
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
        ligas: resolve(__dirname, 'ligas.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        instalaciones: resolve(__dirname, 'instalaciones.html'),
        fotos: resolve(__dirname, 'fotos.html'),
      },
    },
  },
});
