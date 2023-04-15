DisplayCounties();

const filterMenu = document.querySelector(".dropdown-menu");

filterMenu.addEventListener("click", (event) => {
  DisplayFilteredCountries(event.target.textContent);
});

const searchText = document.querySelector(".search-text");

searchText.addEventListener("keyup", (e) => {
  DisplaySearchedCountries(e.target.value);
});

async function fetchCountryDetails() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countryData = await response.json();
    const countryCodes = countryData.reduce((acc, country) => {
      acc[country.fifa] = country.name.official;
      return acc;
    }, {});
    const countriesDetails = countryData.reduce((acc, country) => {
      acc.push({
        name: country.name.official,
        population: country.population.toLocaleString("en-US"),
        region: country.region,
        capital: (country.capital || ["Not Found"])[0],
        flag: country.flags.svg,
        //for detail page
        nativeName: Object.values(
          country.name.nativeName || { official: "Not Found" }
        )[0].official,
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
      });
      return acc;
    }, []);
    return countriesDetails;
  } catch (error) {
    return error;
  }
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

async function DisplayCounties() {
  const countriesDetails = await fetchCountryDetails().catch((error) =>
    console.log(error)
  );
  for (let i = 0; i < countriesDetails.length; i++) {
    const htmlString = `
        <div class="card" style="width: 100%">
            <img src="${countriesDetails[i].flag}" class="card-img-top" alt="" />
            <div class="card-body">
                <h2 class="card-title">${countriesDetails[i].name}</h2>
                <p class="card-text">
                    Population : <span>${countriesDetails[i].population}</span>
                </p>
                <p class="card-text">
                    Region : <span class="region">${countriesDetails[i].region}</span>
                </p>
                <p class="card-text">
                    Capital : <span>${countriesDetails[i].capital}</span>
                </p>
            </div>
        </div>`;
    const card = createElementFromHTML(htmlString);
    document.querySelector(".country-cards").appendChild(card);
  }
}

function DisplayFilteredCountries(filterValue) {
  const filterButtonText = document.querySelector(".filter-button");
  filterButtonText.textContent = `Filter by Region - ${filterValue}`;

  const countries = document.querySelectorAll(".card");

  if (filterValue === "All") {
    Array.from(countries).forEach((country) => {
      const countryRegion = country.querySelector(".region").textContent;
      country.style.display = "";
    });
    return;
  }

  Array.from(countries).forEach((country) => {
    const countryRegion = country.querySelector(".region").textContent;
    if (countryRegion === filterValue) {
      country.style.display = "";
    } else {
      country.style.display = "none";
    }
  });
}

let searchTextValueLast;
function DisplaySearchedCountries(searchTextValue) {
  if (searchTextValue === searchTextValueLast) {
    return;
  }
  searchTextValueLast = searchTextValue;

  const countries = document.querySelectorAll(".card");

  Array.from(countries).forEach((country) => {
    const countryName = country.querySelector(".card-title").textContent;
    if (!countryName.toLowerCase().includes(searchTextValue.toLowerCase())) {
      country.style.display = "none";
    } else {
      country.style.display = "";
    }
  });
}
