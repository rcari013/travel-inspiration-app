import "./style.css";      // ✅ main site styles
import "./css/photos.css";     // ✅ optional, if you want shared photo styles

import About from "./pages/About.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

document.querySelector("#app").innerHTML = `
  ${Header()}
  ${About()}     <!-- ✅ Render directly -->
  ${Footer()}
`;


document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "back-btn") {
    window.location.href = "/"; // back to home
  }
});
