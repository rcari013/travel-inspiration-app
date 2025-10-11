import { defineConfig } from "vite";

export default defineConfig({
  server: {
    open: true,
    historyApiFallback: true, // ✅ Enables SPA-style routing (useful for / routes)
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html", // ✅ entry point
      },
    },
  },
});
