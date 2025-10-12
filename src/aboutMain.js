import "./style.css";
import "./css/photos.css";

import About from "./pages/About.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

document.querySelector("#app").innerHTML = `
  ${Header()}
  ${About()}
  ${Footer()}
`;

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "back-btn") {
    window.location.href = "/";
  }
});
