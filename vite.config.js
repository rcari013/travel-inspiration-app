import animatedMe from "../img/animated_me.png";
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

export default function About() {
  return `
    <section class="about">
      <h2>About the Developer</h2>
      <img src="${animatedMe}" alt="Romelito Cariño - Developer" class="about-photo">
      <p>Hi! I’m <strong>Romelito Bianan Cariño</strong>...</p>
    </section>
  `;
}