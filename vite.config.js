import { defineConfig } from "vite";

export default defineConfig({
  server: {
    open: true,
    historyApiFallback: true, // ✅ Enables SPA-style routing
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
