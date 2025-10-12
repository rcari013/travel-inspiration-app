import CountryInfo from "./components/CountryInfo.js";
import CountryMoreInfo from "./pages/CountryMoreInfo.js";
import About from "./pages/About.js";

// === ROUTER HANDLER ===
export async function handleRouting() {
  const path = window.location.pathname;

  // Target only the RIGHT column (2nd <section>)
  const rightPanel = document.querySelector("main section:nth-child(2)");
  if (!rightPanel) return;

  const overlay = document.getElementById("intro-overlay");
  const app = document.getElementById("app");

  // === HOME PAGE ===
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

    // ✅ Show intro overlay only on home
    if (overlay && app) {
      const shown = sessionStorage.getItem("introShown");
      if (!shown) {
        overlay.classList.remove("hidden");
        app.classList.remove("visible");
        setTimeout(() => {
          overlay.classList.add("hidden");
          app.classList.add("visible");
        }, 2500);
        sessionStorage.setItem("introShown", "true");
      } else {
        overlay.classList.add("hidden");
        app.classList.add("visible");
      }
    }
  }

  // === MORE INFO PAGE ===
  else if (path.startsWith("/moreinfo/")) {
    const countryName = decodeURIComponent(path.split("/moreinfo/")[1]);
    const html = await CountryMoreInfo(countryName);
    rightPanel.innerHTML = html;

    // ✅ Ensure app is visible immediately (no overlay)
    if (app) app.classList.add("visible");
    if (overlay) overlay.classList.add("hidden");

    const backBtn = document.getElementById("back-btn-more-info");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        history.pushState({}, "", "/");
        handleRouting();
      });
    }
  }

  // === ABOUT PAGE ===
  else if (path === "/about") {
    const html = About();
    rightPanel.innerHTML = html;

    // ✅ Ensure app is visible immediately (no overlay)
    if (app) app.classList.add("visible");
    if (overlay) overlay.classList.add("hidden");

    const backBtn = document.getElementById("back-btn-more-info");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        history.pushState({}, "", "/");
        handleRouting();
      });
    }
  }

  // === 404 FALLBACK ===
  else {
    rightPanel.innerHTML = `
      <section style="grid-column: 1 / -1;">
        <h2>Page not found</h2>
      </section>
    `;
    if (app) app.classList.add("visible");
    if (overlay) overlay.classList.add("hidden");
  }
}

// Handle browser navigation (back/forward)
window.addEventListener("popstate", handleRouting);

// Run once on first page load
document.addEventListener("DOMContentLoaded", handleRouting);
