import CountryInfo from "./components/CountryInfo.js";
import CountryMoreInfo from "./pages/CountryMoreInfo.js";
import About from "./pages/About.js";

// === ROUTER HANDLER ===
export async function handleRouting() {
  const path = window.location.pathname;

  // Target only the RIGHT column (2nd <section>)
  const rightPanel = document.querySelector("main section:nth-child(2)");
  if (!rightPanel) return;

  if (path === "/" || path === "/index.html") {
    // 🩵 Try to restore last viewed country
    const last = localStorage.getItem("lastViewedCountry");
    let country = null;

    if (last) {
      try {
        country = JSON.parse(last);
      } catch (err) {
        console.error("Failed to parse last viewed country", err);
      }
    }

    const html = await CountryInfo(country);
    rightPanel.innerHTML = html;
  }


  // === More Info page ===
  else if (path.startsWith("/moreinfo/")) {
    const countryName = decodeURIComponent(path.split("/moreinfo/")[1]);
    const html = await CountryMoreInfo(countryName);
    rightPanel.innerHTML = html;

    // Back button → return to home view
    const backBtn = document.getElementById("back-btn-more-info");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        history.pushState({}, "", "/");
        handleRouting();
      });
    }
  }

  // === About page ===
  else if (path === "/about") {
    const html = About();
    rightPanel.innerHTML = html;

    const backBtn = document.getElementById("back-btn-more-info");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        history.pushState({}, "", "/");
        handleRouting();
      });
    }
  }

  // === 404 Fallback ===
  else {
    rightPanel.innerHTML = `
      <section style="grid-column: 1 / -1;">
        <h2>Page not found</h2>
      </section>
    `;
  }
}

// Handle browser navigation (back/forward)
window.addEventListener("popstate", handleRouting);

// Run once on first page load
document.addEventListener("DOMContentLoaded", handleRouting);
