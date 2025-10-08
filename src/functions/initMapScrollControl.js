// src/functions/initMapScrollControl.js
export function initMapScrollControl(map) {
  if (!map) return;

  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // Disable scroll zoom by default
  map.scrollWheelZoom.disable();
  mapContainer.classList.add("map-scroll-locked"); // default state

  // On click: enable zoom and hide notification
  map.on("click", () => {
    map.scrollWheelZoom.enable();
    mapContainer.classList.remove("map-scroll-locked");
    mapContainer.classList.add("map-scroll-active");
  });

  // On mouse leave: disable zoom again and restore note
  map.on("mouseout", () => {
    map.scrollWheelZoom.disable();
    mapContainer.classList.remove("map-scroll-active");
    mapContainer.classList.add("map-scroll-locked");
  });
}
