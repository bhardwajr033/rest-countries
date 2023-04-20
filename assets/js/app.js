insertCountryCards();

const filterMenu = document.querySelector(".dropdown-menu");

filterMenu.addEventListener("click", (event) => {
  displayFilteredCountries(event.target.textContent);
});

const searchText = document.querySelector(".search-text");

searchText.addEventListener("keyup", (event) => {
  displaySearchedCountries(event.target.value.trim());
});

const countryCardClick = document.querySelector(".country-cards");

countryCardClick.addEventListener("click", (event) => {
  try {
    const countryName = event.target
      .closest(".card")
      .querySelector(".card-title").textContent;
    sessionStorage.setItem("countryName", countryName);
  } catch (error) {}
});

async function fetchCountryDetails() {
  const countriesDetails = JSON.parse(
    sessionStorage.getItem("countriesDetails")
  );
  if (countriesDetails) {
    return countriesDetails;
  }

  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countryData = await response.json();
    const countryCodes = countryData.reduce((acc, country) => {
      acc[country.cca3] = country.name.common;
      return acc;
    }, {});
    const countriesDetails = countryData.reduce((acc, country) => {
      acc[country.name.common] = {
        name: country.name.common,
        population: country.population.toLocaleString("en-US"),
        region: country.region,
        capital: (country.capital || ["Not Found"])[0],
        flag: country.flags.svg,
        //for detail page
        nativeName: Object.values(
          country.name.nativeName || { common: "Not Found" }
        )[0].common,
        subregion: country.subregion,
        topLevelDomain: (country.tld || ["Not Found"])[0],
        currencies: Object.values(
          country.currencies || { name: "Not Found" }
        ).reduce((acc, currency) => {
          acc.push(currency.name);
          return acc;
        }, []),
        languages: Object.values(country.languages || {}) || ["Not Found"],
        borderCountries: (country.borders || [])
          .reduce((acc, countryCode) => {
            acc.push(countryCodes[countryCode]);
            return acc;
          }, [])
          .filter((country) => country),
      };
      return acc;
    }, {});

    return countriesDetails;
  } catch (error) {
    return error;
  }
}

function createElementFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

async function insertCountryCards() {
  const countriesDetails = await fetchCountryDetails().catch((error) =>
    console.log(error)
  );

  sessionStorage; // session store countriesDetail
  sessionStorage.setItem("countriesDetails", JSON.stringify(countriesDetails));

  const countriesDetailsArray = Object.values(countriesDetails);

  for (let i = 0; i < countriesDetailsArray.length; i++) {
    const htmlString = `
        <a href="detail.html" class="card-click">
        <div class="card" style="width: 100%">
            <img src="${countriesDetailsArray[i].flag}" class="card-img-top" alt="" />
            <div class="card-body">
                <h2 class="card-title">${countriesDetailsArray[i].name}</h2>
                <p class="card-text">
                    Population : <span>${countriesDetailsArray[i].population}</span>
                </p>
                <p class="card-text">
                    Region : <span class="region">${countriesDetailsArray[i].region}</span>
                </p>
                <p class="card-text">
                    Capital : <span>${countriesDetailsArray[i].capital}</span>
                </p>
            </div>
        </div>
        </a>`;
    const card = createElementFromHTML(htmlString);
    document.querySelector(".country-cards").appendChild(card);
  }
}

let lastFilteredValue = "All";
function displayFilteredCountries(filterValue) {
  if (filterValue === lastFilteredValue) {
    return;
  }

  lastFilteredValue = filterValue;

  const filterButtonText = document.querySelector(".filter-button");
  filterButtonText.textContent = `Filter by Region - ${filterValue}`;

  const countries = document.querySelectorAll(".card-click");

  if (filterValue === "All") {
    if (lastSearchTextValue === "") {
      Array.from(countries).forEach((country) => {
        country.style.display = "block";
      });
      return;
    } else {
      Array.from(countries).forEach((country) => {
        const countryName = country.querySelector(".card-title").textContent;
        if (
          countryName.toLowerCase().includes(lastSearchTextValue.toLowerCase())
        ) {
          country.style.display = "block";
        } else {
          country.style.display = "none";
        }
      });
      return;
    }
  }

  Array.from(countries).forEach((country) => {
    const countryRegion = country.querySelector(".region").textContent;
    const countryName = country.querySelector(".card-title").textContent;
    if (
      countryRegion === filterValue &&
      (countryName.toLowerCase().includes(lastSearchTextValue.toLowerCase()) ||
        lastSearchTextValue === "")
    ) {
      country.style.display = "block";
    } else {
      country.style.display = "none";
    }
  });
}

let lastSearchTextValue = "";
function displaySearchedCountries(searchTextValue) {
  if (searchTextValue === lastSearchTextValue) {
    return;
  }
  lastSearchTextValue = searchTextValue;

  const countries = document.querySelectorAll(".card-click");

  Array.from(countries).forEach((country) => {
    const countryRegion = country.querySelector(".region").textContent;
    const countryName = country.querySelector(".card-title").textContent;
    if (
      countryName.toLowerCase().includes(searchTextValue.toLowerCase()) &&
      (countryRegion === lastFilteredValue || lastFilteredValue === "All")
    ) {
      country.style.display = "block";
    } else {
      country.style.display = "none";
    }
  });
}
