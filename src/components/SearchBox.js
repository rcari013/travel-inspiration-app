export default function SearchBox() {
  return `
    <h2 id="search-label">Search</h2>
    <div class="search-box">
      <div class="search-input-group" style="position: relative;">
        <input type="text" id="country-input" placeholder="Search for a country...">
        <button class="search-btn">Search</button>
        <ul id="suggestions"></ul>
      </div>

      <div>
        <h2 id="random-country">Random Country</h2>
        <select id="region-select">
          <option>Asia</option>
          <option>Europe</option>
          <option>Africa</option>
          <option>Americas</option>
          <option>Oceania</option>
        </select>
      </div>
      <button class="random-btn">Random Country</button>
    </div>
  `;
}
