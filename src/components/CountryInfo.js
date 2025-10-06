import { fetchPhotos } from "../api/Unsplash.js";
import SavedList from "./SavedList.js";

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

  const photoHTML = photos.length
    ? photos.map((url, i) => `<img src="${url}" alt="${country.name} photo ${i + 1}">`).join("")
    : `<p>No photos available</p>`;

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
      <div id="map" style="height:400px; width:90%;"></div>
    </div>

    <h3 id="photos-title">Photos</h3>
    <div class="photos">
      ${photoHTML}
    </div>

    <div id="save-button-section">
      <button id="save-destination-btn">Save On Destination List</button>
    </div>
  `;

  // delay so #map div + flag div exist
  setTimeout(() => {
    // === Map ===
    if (lat && lon) {
      if (window._mapInstance) {
        window._mapInstance.remove();
      }

      const map = L.map("map").setView([lat, lon], 5);
      window._mapInstance = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${country.name}</b><br>Capital: ${country.capital}`)
        .openPopup();
    }

    // === Waving flag ===
// === Waving flag (with auto-detect for simple flags) ===
  const flagContainer = document.querySelector(".flag");
  if (flagContainer) {
    const flagUrl = flagContainer.dataset.flag;
    flagContainer.innerHTML = "";

    // Detect flags that don't work well with slicing
    const simpleFlags = ["Japan", "Switzerland", "South Korea", "Bangladesh", "Palau"];
    const isSimpleFlag = simpleFlags.some(name =>
      country.name.toLowerCase().includes(name.toLowerCase())
    );

    if (isSimpleFlag) {
      // Use a flat, static flag with subtle shadow
      flagContainer.style.background = `url(${flagUrl}) center/cover no-repeat`;
      flagContainer.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25)";
      flagContainer.style.borderRadius = "6px";
    } else {
      // Normal waving slice effect
      const w = flagContainer.offsetWidth;
      const sliceWidth = 4;
      const slices = Math.floor(w / sliceWidth);
      for (let i = 0; i < slices; i++) {
        const slice = document.createElement("div");
        slice.className = "flag-element";
        slice.style.width = sliceWidth + "px";
        slice.style.left = (i * sliceWidth) + "px";
        slice.style.backgroundImage = `url(${flagUrl})`;
        slice.style.backgroundPosition = `-${i * sliceWidth}px 0`;
        slice.style.animationDelay = (i * 50) + "ms";
        flagContainer.appendChild(slice);
      }
    }
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

          // re-attach listeners
          savedContainer.querySelectorAll(".saved-link").forEach(link => {
            link.addEventListener("click", async (e) => {
              e.preventDefault();
              const countryName = e.target.dataset.country;

              const saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];
              const country = saved.find(c => c.name === countryName);

              if (country) {
                const html = await CountryInfo(country);
                document.querySelector("main section:nth-child(2)").innerHTML = html;
              }
            });
          });

          savedContainer.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
              const name = e.target.dataset.country;
              let saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];
              saved = saved.filter(c => c.name !== name);
              localStorage.setItem("savedDestinations", JSON.stringify(saved));
              savedContainer.innerHTML = SavedList(saved);
            });
          });
        }
      });
    }
  }, 300);

  return html;
}
