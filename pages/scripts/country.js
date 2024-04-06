
const countryListDiv = document.getElementById("countryList");
const searchInput = document.getElementById("searchInputCountry");
const countrySearchInput = document.getElementById("countrySearchInput");
const loader = document.getElementById("loader");

loader.innerHTML = '<div class="lds-ripple"><div></div><div></div></div>'; // Custom spinner HTML

let countriesData = [];

async function fetchCountries() {
  try {
    // Simulate a 2-second delay using setTimeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    countriesData = data;
    populateCountrySuggestions();
  } catch (error) {
    console.error("Error fetching countries:", error);
  } finally {
    loader.style.display = "none"; // Hide loader after data is loaded
  }
}

function populateCountrySuggestions() {
  const datalist = document.getElementById("countrySuggestions");
  datalist.innerHTML = "";
  countriesData.forEach(country => {
    const option = document.createElement("option");
    option.value = country.name.common;
    datalist.appendChild(option);
  });
}

function displayCountries(filteredCountries) {
  loader.style.display = "block"; // Show loader for country search
  countryListDiv.innerHTML = ""; // Clear previous country data
  setTimeout(() => {
    loader.style.display = "none"; // Hide loader after 2 seconds (fake loading)
    filteredCountries.forEach(country => {
      const countryInfo = document.createElement("div");
      countryInfo.classList.add("country-info", "col");
      countryInfo.innerHTML = `
        <h3>${country.name.common}</h3>    
        <img src="${country.flags.png}" alt="${country.name.common} Flag">
        <p><strong>Flag details:</strong> ${country.flags.alt}</p>      
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Continent:</strong> ${country.continents[0]}</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</p>
        <p><strong>UN Member:</strong> ${country.unMember}</p>
        <img src="${country.coatOfArms.png}" alt="${country.name.common} Coat of Arms">
      `;
      countryListDiv.appendChild(countryInfo);
    });
  }, 2000); // Simulate 2-second loading delay
}

// Fetch countries on page load
fetchCountries();

// Add event listener for search button
countrySearchInput.addEventListener("click", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  const filteredCountries = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(searchText)
  );
  displayCountries(filteredCountries);

  setTimeout(() => {
    // Set map URL based on the searched country
    const searchedCountry = filteredCountries.length > 0 ? filteredCountries[0] : null;
    const mapUrl = searchedCountry ? `https://maps.google.com/maps?q=${searchedCountry.latlng[0]},${searchedCountry.latlng[1]}&z=4&output=embed` : "";
    document.getElementById("countrySearchMap").src = mapUrl;
  });
}, 2000);