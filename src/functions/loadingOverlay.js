export function showLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.style.display = "flex"; // ✅ make visible again
    overlay.classList.remove("hidden");
  }
}

export function hideLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    // ✅ optional fade-out, then hide fully
    setTimeout(() => (overlay.style.display = "none"), 300);
  }
}

// Ensure overlay starts hidden after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.display = "none";
  }
});
