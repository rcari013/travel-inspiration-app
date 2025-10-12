import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import SearchBox from '../components/SearchBox.js';
import SavedList from '../components/SavedList.js';


export function renderHome() {
  // 🔹 Load saved destinations from localStorage
  const saved = JSON.parse(localStorage.getItem("savedDestinations")) || [];

  return `
    ${Header()}
    <main>
      <section>
        ${SearchBox()}
        <div id="saved-destinations">
          ${SavedList(saved)}
        </div>
      </section>
      <section>
        ${awaitPlaceholderCountryInfo()}
      </section>
    </main>
    ${Footer()}
  `;
}

// Helper: show an empty placeholder on page load
function awaitPlaceholderCountryInfo() {
  return `
    <h2 id="country-info-title">Country Info</h2>
    <div class="country-info empty">
      <p>No country selected yet. Please search or pick a random country.</p>
    </div>
  `;
}
