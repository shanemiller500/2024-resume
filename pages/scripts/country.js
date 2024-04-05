/**
* Asynchronous function to fetch data from the specified API URL.
* Handles fetching data and parsing JSON response.
* Returns the parsed data or an empty array if an error occurs.
*/
async function fetchData() {
    const apiUrl = "https://restcountries.com/v3.1/all";
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  
  /**
  * Function to render country cards based on fetched data and user input.
  * Retrieves DOM elements, fetches countries data asynchronously, and then filters and renders country cards.
  * Handles displaying error message if data fetch fails or if no search results are found.
  * Also updates the map URL based on the searched country.
  * Finally, sets up event listener for search input and initializes autocomplete using Bootstrap Typeahead.
  */
  async function renderCountries() {
    const countryListDiv = document.getElementById("countryList");
    const searchInput = document.getElementById("searchInput1");
    const countriesData = await fetchData();
  
    if (countriesData.length === 0) {
      countryListDiv.innerHTML = "<p>Error fetching data.</p>";
      return;
    }
  
    countryListDiv.innerHTML = ""; // Clear previous content
  
    const filteredCountries = countriesData.filter((country) =>
      country.name.common.toLowerCase().startsWith(searchInput.value.toLowerCase())
    );
  
    filteredCountries.forEach((country) => {
      const countryCard = document.createElement("div");
  
      countryCard.innerHTML = `
        <div class="card">
          <img src="${country.flags.png}" class="card-img-top" alt="${country.name.common} Flag">
          <p class="card-text">Flag details:${country.flags.alt} </p>
          <div class="container">
            <div class="row">
              <div class="col">
                <h3 class="card-title">${country.name.common}</h3>
                <p class="card-text">Alt Spelling: ${country.altSpellings}</p>
              </div>
              <div class="col">
                <p class="card-text">Capital: ${country.capital}</p>
                <p class="card-text">Population: ${country.population}</p>
                <p class="card-text">Region: ${country.region}</p>
                <p class="card-text">currencies: ${(country.currencies && Object.values(country.currencies)[0] && Object.values(country.currencies)[0].name) || 'N/A'}</p>
              </div>
              <div class="col">
                <p class="card-text">languages: ${country.languages}</p>
                <p class="card-text">UN Member: ${country.unMember}</p>
              </div>
            </div>
          </div>
        </div>
      `;
  
      countryListDiv.appendChild(countryCard);
    });
  
    // Show or hide country cards based on search input
    if (searchInput.value.trim() === "") {
      countryListDiv.style.display = "none"; // Hide all country cards
    } else {
      countryListDiv.style.display = "block"; // Show country cards if search is performed
    }
  
    // Set map URL based on the searched country
    const searchedCountry = filteredCountries.length > 0 ? filteredCountries[0] : null;
    const mapUrl = searchedCountry ? `https://maps.google.com/maps?q=${searchedCountry.latlng[0]},${searchedCountry.latlng[1]}&z=4&output=embed` : "";
    document.getElementById("countryMap").src = mapUrl;
  }
  
  /**
  * Executes initial setup when the window is fully loaded.
  * Sets up event listener for search input to trigger country rendering.
  * Initializes autocomplete feature using Bootstrap Typeahead plugin.
  * Calls renderCountries() to initially render country cards.
  */
  window.onload = () => {
    const searchInput = document.getElementById("searchInput1");
    searchInput.addEventListener("input", () => {
      // Show loading spinner for 2 seconds
      document.getElementById("loadingSpinner").style.display = "block";
      setTimeout(() => {
        renderCountries();
        document.getElementById("loadingSpinner").style.display = "none";
      }, 2000); // 2-second delay
    });
  
    renderCountries(); // Initial rendering of country cards
  };