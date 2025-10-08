import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // your project root
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
      },
    },
  },
});
