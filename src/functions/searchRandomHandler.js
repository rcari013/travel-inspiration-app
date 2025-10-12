import CountryInfo from "../components/CountryInfo.js";
import { showLoading, hideLoading } from "./loadingOverlay.js";
import { initPhotoLightbox } from "./initPhotoLightbox.js";

export function setupSearchRandomHandler() {
  document.addEventListener("click", async (e) => {
    // SEARCH BUTTON
    if (e.target.classList.contains("search-btn")) {
      const input = document.querySelector(".search-box input");
      const query = input?.value.trim();
      if (!query) return alert("Please enter a country name");

      await fetchAndRender(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
    }

    // RANDOM BUTTON
    if (e.target.classList.contains("random-btn")) {
      const region = document.querySelector("#region-select").value;
      await fetchAndRender(`https://restcountries.com/v3.1/region/${region}`, true);
    }
  });

  // ENTER KEY
  document.addEventListener("keydown", async (e) => {
    if (e.target.matches(".search-box input") && e.key === "Enter") {
      e.preventDefault();
      const query = e.target.value.trim();
      if (!query) return alert("Please enter a country name");

      await fetchAndRender(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
    }
  });

  // ✅ AUTOCOMPLETE FIX — fires when user clicks a browser suggestion
  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("blur", async () => {
      setTimeout(async () => {
        const query = searchInput.value.trim();
        if (query.length > 1) {
          await fetchAndRender(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
        }
      }, 150);
    });
  }
}

// === FETCH FUNCTION ===
async function fetchAndRender(url, random = false) {
  showLoading();
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch error");
    const data = await res.json();

    const country = random
      ? data[Math.floor(Math.random() * data.length)]
      : data[0];

    const info = {
      name: country.name.common,
      capital: country.capital ? country.capital[0] : "N/A",
      population: country.population.toLocaleString(),
      languages: country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A",
      flag: country.flags.svg,
      latlng: country.latlng,
    };

    const html = await CountryInfo(info);
    document.querySelector("main section:nth-child(2)").innerHTML = html;

    // Lightbox
    initPhotoLightbox();

    // ✅ Auto-scroll on mobile (with offset)
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const target = document.getElementById("country-info-title");
        if (target) {
          const yOffset = -80; // adjust spacing above title
          const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500);
    }
  } catch (err) {
    console.error(err);
    document.querySelector("main section:nth-child(2)").innerHTML = `
      <h2 id="country-info-title">Country Info</h2>
      <div class="country-info"><p style="color:red;">Failed to load country.</p></div>`;
  } finally {
    hideLoading();
  }
}
