import animatedMe from "../img/animated_me.png";

export default function About() {
  return `
    <div class="about-us-container">
      <section class="about-hero">
        <h1>About This App</h1>
        <p class="intro">
          Welcome to the <strong>Travel Inspiration App</strong> — a project built to help you explore the world from your screen.
          Search countries, discover new destinations, and learn about their people, culture, and history.
        </p>
      </section>

      <section class="about-content">
        <h2>🌍 What This App Does</h2>
        <p>
          The Travel Inspiration App combines live country data and visuals using
          <strong>RestCountries</strong>, <strong>Unsplash</strong>, and <strong>Wikipedia APIs</strong>.
          Whether you’re planning a trip or just curious, it provides quick facts, maps, and beautiful photos for every nation.
        </p>

        <div class="features">
          <div class="feature-box">
            <h3>🌐 Explore Countries</h3>
            <p>Search or select a random country to learn about its geography, culture, and stats.</p>
          </div>
          <div class="feature-box">
            <h3>📸 Visual Discovery</h3>
            <p>Get a glimpse of the country through photos sourced from Unsplash.</p>
          </div>
          <div class="feature-box">
            <h3>🗺️ Interactive Maps</h3>
            <p>View each country’s exact location on a dynamic Leaflet-powered map.</p>
          </div>
          <div class="feature-box">
            <h3>📖 Learn More</h3>
            <p>Read Wikipedia summaries for richer background and insights.</p>
          </div>
        </div>
      </section>

      <section class="about-author">
        <h2>👨‍💻 About the Developer</h2>
        <div class="author-profile">
          <img src="${animatedMe}" alt="Romelito Carino - Developer" class="author-photo">
          <div class="author-text">
            <p>
              Hi! I’m <strong>Romelito Bianan Cariño</strong> — the developer behind this app.
              I’m a passionate web developer from the Philippines, currently studying web development at BYU–Idaho through BYU–Pathway Worldwide.
            </p>
            <p>
              This project reflects my goal of blending design, interactivity, and data-driven content to create meaningful web experiences.
            </p>
            <p class="credits">
              Built with ❤️ using <em>JavaScript (ES Modules)</em>, <em>Vite</em>, <em>Leaflet</em>, and <em>Unsplash API</em>.
            </p>
          </div>
        </div>
      </section>

      <div class="about-footer">
        <button id="back-btn">← Back to App</button>
      </div>
    </div>
  `;
}
