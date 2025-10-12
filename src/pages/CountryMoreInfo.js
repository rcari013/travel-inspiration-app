import CountryNews from "../components/CountryNews.js";

export default async function CountryMoreInfo(countryName) {
  const wikiApi = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(countryName)}`;

  try {
    // === Fetch Wikipedia summary ===
    const res = await fetch(wikiApi);
    const data = await res.json();

    if (data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
      return `<h2>No info found for ${countryName}</h2>`;
    }

    const imageHTML = data.thumbnail
      ? `<img src="${data.thumbnail.source}" alt="${data.title}" class="wiki-image" />`
      : "";

    // === Fetch GNews articles ===
    const newsHTML = await CountryNews(countryName);

    // === Combined HTML layout ===
    return `
      <button id="back-btn-more-info">Back</button>

      <div class="country-more-info">
        <h2>${data.title}</h2>
        <p><em>${data.description || ""}</em></p>
        ${imageHTML}
        <p>${data.extract || "No additional information available."}</p>

        <a href="${wikiUrl}" class="wiki-link" target="_blank" style="color: red;">
          Read more on Wikipedia →
        </a>

        ${newsHTML}
      </div>
    `;
  } catch (error) {
    console.error("Wikipedia fetch error:", error);
    return `<p>Failed to load info for ${countryName}</p>`;
  }
}
