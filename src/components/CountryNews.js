import { getNews } from "../functions/getNews.js";

export default async function CountryNews(countryName) {
  const data = await getNews(countryName);

  if (!data.results || data.results.length === 0) {
    return `
      <div class="country-news">
        <h3>🗞️ Latest News</h3>
        <p>No recent news found for ${countryName}.</p>
      </div>
    `;
  }

  const articlesHTML = data.results
    .slice(0, 3)
    .map(
      (a) => `
        <div class="news-card">
          <a href="${a.link}" target="_blank">
            <img src="${a.image_url || "./img/news-placeholder.jpg"}" alt="${a.title}">
            <h4>${a.title}</h4>
            <p>${a.description || ""}</p>
            <span class="source">Source: ${a.source_id || "Unknown"}</span>
          </a>
        </div>
      `
    )
    .join("");

  return `
    <div class="country-news">
      <h3>🗞️ Latest News from ${countryName}</h3>
      <div class="news-grid">${articlesHTML}</div>
    </div>
  `;
}
