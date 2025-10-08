export default function Header() {
  return `
    <header>
      <a href="/" class="home-link">🌍 Travel Inspiration App</a>
      <button class="nav-btn" onclick="window.location.href='/about'">About</button>
    </header>
  `;
}
