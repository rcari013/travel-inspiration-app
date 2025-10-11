import "./style.css";
import "./photos.css";
import { renderHome } from "./pages/Home.js";
import { setupSavedListHandler } from "./functions/savedListHandler.js";
import { setupAutosuggest } from "./functions/autosuggest.js";
import { setupSearchRandomHandler } from "./functions/searchRandomHandler.js";
import { initPhotoLightbox } from "./functions/initPhotoLightbox.js";
import { initMapScrollControl } from "./functions/initMapScrollControl.js";
import { handleRouting } from "./router.js";
import { initCountryInfo } from "./functions/initCountryInfo.js"; // ✅ ADD BACK

document.getElementById("loading-overlay")?.classList.add("hidden");

// === 1. Render Base Layout ===
document.querySelector("#app").innerHTML = renderHome();

// === 2. Initialize Global UI Features ===
initPhotoLightbox();
setupSavedListHandler();
setupAutosuggest();
setupSearchRandomHandler();
initCountryInfo(); // ✅ RESTORE THIS LINE

// === 3. Run Router ===
handleRouting();

// === 4. Link Handlers ===
document.body.addEventListener("click", (e) => {
  // About link
  if (e.target.id === "about-link") {
    e.preventDefault();
    history.pushState({}, "", "/about");
    handleRouting();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id === "clear-list-btn") {
    e.preventDefault();
    if (confirm("Are you sure you want to clear all saved destinations?")) {
      localStorage.removeItem("savedDestinations");
      location.reload(); // reload to refresh the UI
    }
  }
});
