import './style.css';
import './photos.css';
import { renderHome } from './pages/Home.js';
import { initCountryInfo } from './functions/initCountryInfo.js';
import { setupSavedListHandler } from './functions/savedListHandler.js';
import { setupAutosuggest } from './functions/autosuggest.js';
import { setupSearchRandomHandler } from './functions/searchRandomHandler.js';
import { initPhotoLightbox } from './functions/initPhotoLightbox.js';
import { initMapScrollControl } from './functions/initMapScrollControl.js';


// === 1. Render base layout ===
document.querySelector('#app').innerHTML = renderHome();

// === 2. Initialize ===
await initCountryInfo();
initPhotoLightbox();
setupSavedListHandler();
setupAutosuggest();
setupSearchRandomHandler();