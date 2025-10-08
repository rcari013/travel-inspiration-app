const loadingOverlay = document.getElementById("loading-overlay");

export function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

export function hideLoading() {
  loadingOverlay.classList.add("hidden");
}
