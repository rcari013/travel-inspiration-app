export default function SavedList(saved = []) {
  return `
    <h2>Saved Destinations</h2>
    <ul class="saved-list">
      ${
        saved.length > 0
          ? saved.map(item => `
              <li>
                <a href="#" class="saved-link" data-country="${item.name}">
                  ${item.name}
                </a>
                <button class="delete-btn" data-country="${item.name}">❌</button>
              </li>
            `).join("")
          : `<li class="empty">Empty</li>`
      }
    </ul>
  `;
}
