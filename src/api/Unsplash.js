const UNSPLASH_ACCESS_KEY = "D6hYVCDCP0Wm3CK_l-xc0-ZnCo96kzQvRvl_tLojXHM"; 

export async function fetchPhotos(query) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!res.ok) throw new Error("Failed to fetch photos");
    const data = await res.json();

    return data.results.map(photo => photo.urls.full || photo.urls.regular);

  } catch (err) {
    console.error("Unsplash error:", err);
    return [];
  }
}
