export function initIntroOverlay() {
  const overlay = document.getElementById("intro-overlay");
  const app = document.getElementById("app");
  if (!overlay || !app) return;

  // Run only if session is new (browser closed & reopened)
  const shown = sessionStorage.getItem("introShown");
  const isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";

  if (isHome && !shown) {
    // app starts hidden
    app.classList.remove("visible");
    overlay.classList.remove("hidden");

    // Hold for 3 seconds before fading out
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 3000);

    // Fade app in 1 second later (after overlay starts fading)
    setTimeout(() => {
      app.classList.add("visible");
    }, 4000);

    sessionStorage.setItem("introShown", "true");
  } else {
    overlay.classList.add("hidden");
    app.classList.add("visible");
  }
}
