import CountryInfo from "../components/CountryInfo.js";

export async function initCountryInfo() {
  const html = await CountryInfo(null);
  document.querySelector('main section:nth-child(2)').innerHTML = html;
}
