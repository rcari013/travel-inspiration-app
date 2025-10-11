import { fetchPhotos } from "../api/Unsplash.js";
import SavedList from "./SavedList.js";
import { initPhotoLightbox } from "../functions/initPhotoLightbox.js";
import { initMapScrollControl } from "../functions/initMapScrollControl.js";

export default async function CountryInfo(country = null) {
  if (!country) {
    return `
      <h2 id="country-info-title">Country Info</h2>
      <div class="country-info empty">
        <p>No country selected yet. Please search or pick a random country.</p>
      </div>
    `;
  }

  const photos = await fetchPhotos(country.name);
  const [lat, lon] = country.latlng || [0, 0];

  const photoHTML = photos.map(
    (url, i) => `
      <div class="photo-item">
        <img src="${url}" alt="${country.name} photo ${i + 1}">
      </div>
    `
  ).join("");

  // === Template ===
  const html = `
    <h2 id="country-info-title">Country Info</h2>

    <div class="country-info">
      <div class="flag" data-flag="${country.flag}"></div>
      <p><strong>Country:</strong> ${country.name}</p>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${country.languages}</p>
    </div>

    <div class="map">
      <h3>Map</h3>
      <div id="map"></div>
    </div>

    <h3 id="photos-title">Photos</h3>
    <div class="photos">${photoHTML}</div>

    <div id="save-button-section">
      <button id="more-info-button" class="info-btn">More Info</button>
      <button id="save-destination-btn">Save On Destination List</button>
    </div>
  `;

  // === DOM Initialization ===
  setTimeout(() => {
    // === Map ===
    if (lat && lon) {
      if (window._mapInstance) window._mapInstance.remove();

      const map = L.map("map").setView([lat, lon], 5);
      window._mapInstance = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${country.name}</b><br>Capital: ${country.capital}`)
        .openPopup();

      initMapScrollControl(map);
    }

    // === Flag Display ===
    const flagContainer = document.querySelector(".flag");
    if (flagContainer) {
      const flagUrl = flagContainer.dataset.flag;
      flagContainer.style.background = `url(${flagUrl}) center/cover no-repeat`;
      flagContainer.style.boxShadow = "0 6px 12px rgba(0,0,0,0.25)";
      flagContainer.style.borderRadius = "6px";
    }

    // === More Info button ===
    const infoBtn = document.getElementById("more-info-button");
    if (infoBtn) {
      infoBtn.addEventListener("click", async () => {
        const newUrl = `/moreinfo/${encodeURIComponent(country.name)}`;
        history.pushState({}, "", newUrl);
        const { handleRouting } = await import("../router.js");
        handleRouting();
      });
    }

    // === Save button ===
    const saveBtn = document.getElementById("save-destination-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const destination = {
          name: country.name,
          capital: country.capital,
          population: country.population,
          languages: country.languages,
          flag: country.flag,
          latlng: country.latlng,
          photos: photos
        };

        let saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];

        // ✅ prevent duplicate save
        if (!saved.find(item => item.name === country.name)) {
          saved.push(destination);
          localStorage.setItem("savedDestinations", JSON.stringify(saved));
          showSaveOverlay(`${country.name} saved on list`);
        }

        // ✅ refresh SavedList panel
        const savedContainer = document.getElementById("saved-destinations");
        if (savedContainer) {
          savedContainer.innerHTML = SavedList(saved);

          // rebind delete button
          savedContainer.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
              const name = e.target.dataset.country;
              saved = saved.filter(c => c.name !== name);
              localStorage.setItem("savedDestinations", JSON.stringify(saved));
              savedContainer.innerHTML = SavedList(saved);
            });
          });
        }
      });
    }

    // ✅ Always re-init photo lightbox
    initPhotoLightbox();

  }, 300);

  // ✅ Remember last viewed country
  window.currentCountry = country;
  localStorage.setItem("lastViewedCountry", JSON.stringify(country));

  // === Overlay helper ===
  function showSaveOverlay(message = "Saved!") {
    let overlay = document.getElementById("save-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "save-overlay";
      overlay.innerHTML = `<div class="save-message"></div>`;
      document.body.appendChild(overlay);
    }

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.5);
      opacity: 0;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;

    const msg = overlay.querySelector(".save-message");
    msg.textContent = message;
    msg.style.cssText = `
      background: rgba(0,0,0,0.7);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1.2rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;

    requestAnimationFrame(() => (overlay.style.opacity = "1"));

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 500);
    }, 1800);
  }

  return html;
}
