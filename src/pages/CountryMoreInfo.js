export default async function CountryMoreInfo(countryName) {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    // Handle missing pages
    if (data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
      return `<h2>No info found for ${countryName}</h2>`;
    }

    const imageHTML = data.thumbnail
      ? `<img src="${data.thumbnail.source}" alt="${data.title}" class="wiki-image" />`
      : "";

    return `
    <button id="back-btn">Back</button>
      <div class="country-more-info">
        
        <h2>${data.title}</h2>
        <p><em>${data.description || ""}</em></p>
        ${imageHTML}
        <p>${data.extract}</p>
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(
          data.title
        )}" target="_blank">Read more on Wikipedia →</a>
      </div>
    `;
  } catch (error) {
    console.error("Wikipedia fetch error:", error);
    return `<p>Failed to load info for ${countryName}</p>`;
  }
}
