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
        population: country.population,
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

fetchCountryDetails()
  .then((countriesDetails) => console.log(countriesDetails))
  .catch((error) => console.log(error));
