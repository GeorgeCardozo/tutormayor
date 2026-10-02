import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        inicio: resolve('index.html'),
        'como-funciona': resolve('como-funciona/index.html'),
        'explorar-tutores': resolve('explorar-tutores/index.html'),
        materias: resolve('materias/index.html'),
        'ser-tutor': resolve('ser-tutor/index.html'),
        'iniciar-sesion': resolve('iniciar-sesion/index.html')
      }
    }
  }
});
