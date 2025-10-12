import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    open: true,
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
      },
    },
  },
});
