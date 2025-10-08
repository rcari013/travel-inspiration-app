import CountryInfo from "../components/CountryInfo.js";
import SavedList from "../components/SavedList.js";
import { initPhotoLightbox } from "./initPhotoLightbox.js";

export function setupSavedListHandler() {
  const savedContainer = document.getElementById("saved-destinations");
  if (!savedContainer) return;

  savedContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("saved-link")) {
      e.preventDefault();
      const countryName = e.target.dataset.country;
      const saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];
      const country = saved.find(c => c.name === countryName);

      if (country) {
        const html = await CountryInfo(country);
        document.querySelector("main section:nth-child(2)").innerHTML = html;
        initPhotoLightbox();
      }
    }

    if (e.target.classList.contains("delete-btn")) {
      const name = e.target.dataset.country;
      let saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];
      saved = saved.filter(c => c.name !== name);
      localStorage.setItem("savedDestinations", JSON.stringify(saved));
      savedContainer.innerHTML = SavedList(saved);
    }
  });
}
