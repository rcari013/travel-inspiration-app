// src/functions/getNews.js
export async function getNews(countryName = "Philippines") {
  const apiKey = "pub_e031e94a6e694b05910d06690aa57e8e";
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(countryName)}&language=en`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");
    return await res.json();
  } catch (err) {
    console.error("News API error:", err);
    return { error: err.message };
  }
}
