sessionStorage;
const countriesDetails = JSON.parse(sessionStorage.getItem("countriesDetails"));
const countryName = sessionStorage.getItem("countryName");

const countryDetails = countriesDetails[countryName];

displayDetails();

const bordersClick = document.querySelector(".borders");

bordersClick.addEventListener("click", (event) => {
  const countryName = event.target.textContent;
  sessionStorage;
  sessionStorage.setItem("countryName", countryName);
});

function displayDetails() {
  if (!countriesDetails) {
    return;
  }
  const countryCard = document.querySelector(".country-card");
  countryCard.querySelector(".country-img").src = countryDetails.flag;
  countryCard.querySelector(".country-name").textContent = countryName;
  countryCard.querySelector(".native-name").textContent =
    countryDetails.nativeName;
  countryCard.querySelector(".population").textContent =
    countryDetails.population;
  countryCard.querySelector(".region").textContent = countryDetails.region;
  countryCard.querySelector(".sub-region").textContent =
    countryDetails.subregion;
  countryCard.querySelector(".capital").textContent = countryDetails.capital;
  countryCard.querySelector(".top-level-domain").textContent =
    countryDetails.topLevelDomain;
  countryCard.querySelector(".currencies").textContent =
    countryDetails.currencies.toString();
  countryCard.querySelector(".languages").textContent =
    countryDetails.languages.toString();

  //border countries
  const borderCountries = countryDetails.borderCountries;
  if (borderCountries.length !== 0) {
    const borderDiv = countryCard.querySelector(".borders");
    borderDiv.querySelector(".border").style.display = "none";
    for (let index = 0; index < borderCountries.length; index++) {
      const htmlText = `<button class="border" onclick="window.location.href='detail.html';">${borderCountries[index]}</button>`;
      const borderCard = createElementFromHTML(htmlText);
      borderDiv.appendChild(borderCard);
    }
  }
}

function createElementFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
