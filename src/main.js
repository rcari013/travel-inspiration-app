import './style.css';
import { renderHome } from './pages/Home.js';
import CountryInfo from './components/CountryInfo.js';
import SavedList from './components/SavedList.js';

// ✅ 1. Render base layout
document.querySelector('#app').innerHTML = renderHome();

// ✅ 2. Render initial CountryInfo placeholder
(async () => {
  const html = await CountryInfo(null);
  document.querySelector('main section:nth-child(2)').innerHTML = html;
  initPhotoLightbox();
})();

// ✅ 3. Attach event delegation for saved list (only once)
const savedContainer = document.getElementById("saved-destinations");
if (savedContainer) {
  savedContainer.addEventListener("click", async (e) => {
    // --- Handle clicking a saved country ---
    if (e.target.classList.contains("saved-link")) {
      e.preventDefault();
      const countryName = e.target.dataset.country;
      const saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];
      const country = saved.find(c => c.name === countryName);

      if (country) {
        const html = await CountryInfo(country);
        document.querySelector("main section:nth-child(2)").innerHTML = html;
        initPhotoLightbox();
      }
    }

    // --- Handle deleting a saved country ---
    if (e.target.classList.contains("delete-btn")) {
      const name = e.target.dataset.country;
      let saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];
      saved = saved.filter(c => c.name !== name);
      localStorage.setItem("savedDestinations", JSON.stringify(saved));
      savedContainer.innerHTML = SavedList(saved);
    }
  });
}

// ✅ 4. AUTOSUGGEST HANDLER
const input = document.getElementById('country-input');
const suggestions = document.getElementById('suggestions');

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestions.innerHTML = '';
    suggestions.classList.remove('active');
    return;
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    if (!res.ok) throw new Error("No match");
    const data = await res.json();

    suggestions.innerHTML = data.slice(0, 5).map(c =>
      `<li data-country="${c.name.common}">${c.name.common}</li>`
    ).join('');
    suggestions.classList.add('active');
  } catch {
    suggestions.innerHTML = '';
    suggestions.classList.remove('active');
  }
});

// ✅ 5. CLICK AUTOSUGGEST OPTION (with loading overlay)
suggestions.addEventListener('click', async (e) => {
  if (e.target.tagName === 'LI') {
    const selectedCountry = e.target.dataset.country;
    input.value = selectedCountry;
    suggestions.innerHTML = '';
    suggestions.classList.remove('active');

    showLoading();
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${selectedCountry}?fullText=true`);
      if (!res.ok) throw new Error("Country not found");
      const data = await res.json();

      const country = data[0];
      const info = {
        name: country.name.common,
        capital: country.capital ? country.capital[0] : "N/A",
        population: country.population.toLocaleString(),
        languages: country.languages ? Object.values(country.languages).join(", ") : "N/A",
        flag: country.flags.svg,
        latlng: country.latlng
      };

      const html = await CountryInfo(info);
      document.querySelector('main section:nth-child(2)').innerHTML = html;
      initPhotoLightbox();
    } catch (err) {
      console.error(err);
      document.querySelector('main section:nth-child(2)').innerHTML = `
        <h2 id="country-info-title">Country Info</h2>
        <div class="country-info">
          <p style="color:red;">Country not found. Try again.</p>
        </div>`;
    } finally {
      hideLoading();
    }
  }
});

// ✅ 6. EVENT DELEGATION for SEARCH + RANDOM BUTTONS
document.addEventListener('click', async (e) => {
  // --- SEARCH HANDLER ---
  if (e.target.classList.contains('search-btn')) {
    const query = document.querySelector('.search-box input').value.trim();
    if (!query) {
      alert("Please enter a country name");
      return;
    }

    showLoading();
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
      if (!res.ok) throw new Error("Country not found");
      const data = await res.json();

      const country = data[0];
      const info = {
        name: country.name.common,
        capital: country.capital ? country.capital[0] : "N/A",
        population: country.population.toLocaleString(),
        languages: country.languages ? Object.values(country.languages).join(", ") : "N/A",
        flag: country.flags.svg,
        latlng: country.latlng
      };

      const html = await CountryInfo(info);
      document.querySelector('main section:nth-child(2)').innerHTML = html;
      initPhotoLightbox();
    } catch (err) {
      console.error(err);
      document.querySelector('main section:nth-child(2)').innerHTML = `
        <h2 id="country-info-title">Country Info</h2>
        <div class="country-info">
          <p style="color:red;">Country not found. Try again.</p>
        </div>`;
    } finally {
      hideLoading();
    }
  }

  // --- RANDOM COUNTRY HANDLER ---
  if (e.target.classList.contains('random-btn')) {
    const region = document.querySelector('#region-select').value;

    showLoading();
    try {
      const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
      if (!res.ok) throw new Error("Region not found");
      const countries = await res.json();

      const randomCountry = countries[Math.floor(Math.random() * countries.length)];

      const info = {
        name: randomCountry.name.common,
        capital: randomCountry.capital ? randomCountry.capital[0] : "N/A",
        population: randomCountry.population.toLocaleString(),
        languages: randomCountry.languages ? Object.values(randomCountry.languages).join(", ") : "N/A",
        flag: randomCountry.flags.svg,
        latlng: randomCountry.latlng
      };

      const html = await CountryInfo(info);
      document.querySelector('main section:nth-child(2)').innerHTML = html;
      initPhotoLightbox();
    } catch (err) {
      console.error(err);
      document.querySelector('main section:nth-child(2)').innerHTML = `
        <h2 id="country-info-title">Country Info</h2>
        <div class="country-info">
          <p style="color:red;">Could not load random country.</p>
        </div>`;
    } finally {
      hideLoading();
    }
  }
});

// === Click-to-enlarge photos (Dynamic Rebinding) ===
function initPhotoLightbox() {
  const existingOverlay = document.querySelector(".photo-overlay");
  if (existingOverlay) existingOverlay.remove();

  let overlay = document.createElement("div");
  overlay.className = "photo-overlay";
  overlay.innerHTML = `
  <div class="photo-box">
    <span class="close-btn">&times;</span>
    <img src="" alt="Zoomed Photo">
  </div>
  `;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".close-btn");

  document.querySelectorAll(".photos img").forEach(img => {
    img.addEventListener("click", () => {
      overlayImg.src = img.src;
      overlay.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.classList.remove("active");
  });
}

// === LOADING OVERLAY ===
const loadingOverlay = document.getElementById("loading-overlay");
function showLoading() {
  loadingOverlay.classList.remove("hidden");
}
function hideLoading() {
  loadingOverlay.classList.add("hidden");
}
