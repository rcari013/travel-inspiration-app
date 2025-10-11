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

  const photoHTML = photos.map(
    (url, i) => `
      <div class="photo-item">
        <img src="${url}" alt="${country.name} photo ${i + 1}">
      </div>
    `
  ).join("");

  const [lat, lon] = country.latlng || [0, 0];

  // HTML
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
    <div class="photos">
      ${photoHTML}
    </div>

    <div id="save-button-section">
      <button id="more-info-button" class="info-btn">More Info</button>
      <button id="save-destination-btn">Save On Destination List</button>
    </div>
  `;

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

    // === Waving flag ===
    const flagContainer = document.querySelector(".flag");
    if (flagContainer) {
      const flagUrl = flagContainer.dataset.flag;
      flagContainer.innerHTML = "";

      const simpleFlags = ["Japan", "Switzerland", "South Korea", "Bangladesh", "Palau"];
      const isSimpleFlag = simpleFlags.some(name =>
        country.name.toLowerCase().includes(name.toLowerCase())
      );

      if (isSimpleFlag) {
        flagContainer.style.background = `url(${flagUrl}) center/cover no-repeat`;
        flagContainer.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25)";
        flagContainer.style.borderRadius = "6px";
      } else {
        const w = flagContainer.offsetWidth;
        const sliceWidth = 4;
        const slices = Math.floor(w / sliceWidth);
        for (let i = 0; i < slices; i++) {
          const slice = document.createElement("div");
          slice.className = "flag-element";
          slice.style.width = sliceWidth + "px";
          slice.style.left = i * sliceWidth + "px";
          slice.style.backgroundImage = `url(${flagUrl})`;
          slice.style.backgroundPosition = `-${i * sliceWidth}px 0`;
          slice.style.animationDelay = i * 50 + "ms";
          flagContainer.appendChild(slice);
        }
      }
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
      saveBtn.addEventListener("click", async () => {
        let saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];

        const destination = {
          name: country.name,
          capital: country.capital,
          population: country.population,
          languages: country.languages,
          flag: country.flag,
          latlng: country.latlng,
          photos: photos
        };

        if (!saved.find(item => item.name === country.name)) {
          saved.push(destination);
          localStorage.setItem("savedDestinations", JSON.stringify(saved));
        }

        // re-render saved list
        const savedContainer = document.getElementById("saved-destinations");
        if (savedContainer) {
          savedContainer.innerHTML = SavedList(saved);
        }
      });
    }

    // ✅ Always initialize photo lightbox after render
    initPhotoLightbox();

  }, 300);
    // ✅ Remember last viewed country
  window.currentCountry = country;
  localStorage.setItem("lastViewedCountry", JSON.stringify(country));


  return html;
}
