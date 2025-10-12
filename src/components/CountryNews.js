export default async function CountryNews(countryName) {
  const apiKey = "f28973964f840298bcc27f4fda6dbc8a"; // your GNews API key
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(countryName)}&lang=en&max=3&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      return `
        <div class="country-news">
          <h3>🗞️ Latest News</h3>
          <p>No recent news found for ${countryName}.</p>
        </div>
      `;
    }

    const articlesHTML = data.articles
      .map(
        (a) => `
        <div class="news-card">
          <a href="${a.url}" target="_blank">
            <img src="${a.image || "./img/news-placeholder.jpg"}" alt="${a.title}">
            <h4>${a.title}</h4>
            <p>${a.description || ""}</p>
            <span class="source">Source: ${a.source?.name || "Unknown"}</span>
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
  } catch (err) {
    console.error(err);
    return `
      <div class="country-news">
        <h3>🗞️ Latest News</h3>
        <p style="color:red;">Unable to load news right now.</p>
      </div>
    `;
  }
}
