import CountryInfo from "../components/CountryInfo.js";
import { showLoading, hideLoading } from "./loadingOverlay.js";
import { initPhotoLightbox } from "./initPhotoLightbox.js";

export function setupAutosuggest() {
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
      } catch {
        document.querySelector('main section:nth-child(2)').innerHTML = `
          <h2 id="country-info-title">Country Info</h2>
          <div class="country-info"><p style="color:red;">Country not found. Try again.</p></div>`;
      } finally {
        hideLoading();
      }
    }
  });
}
