import './style.css';
import './photos.css';
import { renderHome } from './pages/Home.js';
import { initCountryInfo } from './functions/initCountryInfo.js';
import { setupSavedListHandler } from './functions/savedListHandler.js';
import { setupAutosuggest } from './functions/autosuggest.js';
import { setupSearchRandomHandler } from './functions/searchRandomHandler.js';
import { initPhotoLightbox } from './functions/initPhotoLightbox.js';
import { initMapScrollControl } from './functions/initMapScrollControl.js';
import About from "./pages/About.js";
import CountryInfo from "./components/CountryInfo.js";

// === 1. Render base layout ===
document.querySelector('#app').innerHTML = renderHome();

// === 2. Initialize ===
await initCountryInfo();
initPhotoLightbox();
setupSavedListHandler();
setupAutosuggest();
setupSearchRandomHandler();


// About navigation
document.body.addEventListener("click", async (e) => {
  if (e.target.id === "about-link") {
    // Replace the entire <main> content with About
    document.querySelector("main").innerHTML = `
      <section style="grid-column: 1 / -1;">
        ${About()}
      </section>
    `;

    // Back button handler → restore full layout
    document.getElementById("back-btn").addEventListener("click", async () => {
      // reload your original layout here
      window.location.reload(); // simplest way (refreshes entire app)
      // OR if you prefer without reload:
      // const html = await CountryInfo();
      // document.querySelector("main section:nth-child(2)").innerHTML = html;
    });
  }
});
