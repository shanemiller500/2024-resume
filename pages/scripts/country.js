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
    country.name.common.toLowerCase().includes(searchInput.value.toLowerCase())
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
                        <p class="card-text">languages: ${country.languages.eng}</p>
                        <p class="card-text">languages (Native): ${country.languages.rar}</p>
                        <p class="card-text">UN Member: ${country.unMember}</p>
                    </div>           
            </div>                    
                </div>
            </div>
        `;

    countryListDiv.appendChild(countryCard);
  });

  // Show the cards that match the search
  if (searchInput.value.trim() === "") {
    countryListDiv.style.display = "none"; // Hide all country cards
  } else {
    countryListDiv.style.display = "block"; // Show country cards if search is performed
  }

  // Set map URL based on the searched country
  const searchedCountry =
    filteredCountries.length > 0 ? filteredCountries[0] : null;
  const mapUrl = searchedCountry
    ? `https://maps.google.com/maps?q=${searchedCountry.latlng[0]},${searchedCountry.latlng[1]}&z=4&output=embed`
    : "";
  document.getElementById("countryMap").src = mapUrl;
}

window.onload = () => {
  const searchInput = document.getElementById("searchInput1");
  searchInput.addEventListener("input", renderCountries);

  // Autocomplete using Bootstrap Typeahead
  $(document).ready(function () {
    $("#searchInput").typeahead({
      source: function (query, result) {
        const countries = [];
        fetchData().then((countriesData) => {
          countriesData.forEach((country) => {
            if (
              country.name.common.toLowerCase().includes(query.toLowerCase())
            ) {
              countries.push(country.name.common);
            }
          });
          result(countries);
        });
      },
    });
  });

  renderCountries();
};
