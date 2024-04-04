// Define the Marvel API public and private keys
const CUSTOM_PUBLIC_KEY = '6290afb298c151e1dd65994d6b75475d';
const CUSTOM_PRIVATE_KEY = '30b26f71fe92998a8479ec02dd44a180ab67bb0d';
// Define the Marvel API URL for characters
const CUSTOM_API_URL = 'https://gateway.marvel.com/v1/public/characters';

// Generate timestamp and hash for Marvel API authentication
const customTs = new Date().getTime();
const customHash = CryptoJS.MD5(customTs + CUSTOM_PRIVATE_KEY + CUSTOM_PUBLIC_KEY).toString();

// Function to fetch data from the Marvel API based on character name
const customFetchData = async (nameStartsWith = '') => {
    try {
        const response = await fetch(`${CUSTOM_API_URL}?ts=${customTs}&apikey=${CUSTOM_PUBLIC_KEY}&hash=${customHash}&nameStartsWith=${nameStartsWith}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

// Function to display Marvel character search results
const displayCustomResults = async () => {
    const customSearchInput = document.getElementById('customSearchInput').value.trim();
    const customResultsDiv = document.getElementById('customResults');
    customResultsDiv.innerHTML = ''; // Clear previous results

    if (customSearchInput) {
        const data = await customFetchData(customSearchInput);
        if (data && data.data && data.data.results) {
            data.data.results.forEach(character => {
                // Create HTML elements for each character result
                const characterDiv = document.createElement('div');
                characterDiv.classList.add('col-md-10', 'mb-10');

                // Construct image and character info HTML
                const thumbnail = `${character.thumbnail.path}.${character.thumbnail.extension}`;
                const characterImage = `<img src="${thumbnail}" class="img-fluid" alt="${character.name}">`;
                const characterInfo = `<h2>${character.name}</h2>
                                        <p>${character.description || 'No description available'}</p>`;                               
                
                // Set HTML content for character card
                characterDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            ${characterImage}
                            ${characterInfo}
                        </div>
                    </div>
                `;
                customResultsDiv.appendChild(characterDiv);
            });
        } else {
            customResultsDiv.innerHTML = '<p class="col">No matching characters found.</p>';
        }
    } else {
        customResultsDiv.innerHTML = '<p class="col">Please enter a character name to search.</p>';
    }
};

// Add event listener for search button to display results
document.getElementById('customSearchButton').addEventListener('click', displayCustomResults);

// Initialize autocomplete using Bootstrap Typeahead
$(document).ready(function() {
    $('#customSearchInput').typeahead({
        source: async function(query, result) {
            const data = await customFetchData(query);
            if (data && data.data && data.data.results) {
                // Extract character names from the data
                const characterNames = data.data.results.map(character => character.name);
                result(characterNames);
            } else {
                result([]);
            }
        }
    });
});


// ================================================================================

// FOR COMIC BOOK SEARCH 

// ================================================================================


// Define the Marvel Comics API URL
const CUSTOM_API_URL1 = 'https://gateway.marvel.com/v1/public/comics';

// Function to generate the hash required for Marvel API authentication
function getHash(timestamp) {
  const hash = CryptoJS.MD5(timestamp + CUSTOM_PRIVATE_KEY + CUSTOM_PUBLIC_KEY);
  return hash.toString();
}

// Construct the autocomplete URL with the necessary parameters
const autocompleteUrl = `${CUSTOM_API_URL1}?apikey=${CUSTOM_PUBLIC_KEY}&ts=${new Date().getTime()}&hash=${getHash(new Date().getTime())}`;

// Initialize the typeahead functionality for the search input
$('#searchInputComic').typeahead({
  source: function (query, result) {
    // Perform a JSON GET request to retrieve autocomplete suggestions
    $.getJSON(autocompleteUrl + '&titleStartsWith=' + query, function (data) {
      // Extract titles from the response data and pass them to the typeahead result
      const titles = data.data.results.map(comic => comic.title);
      result(titles);
    });
  }
});

// Function to search for comics based on user input
function searchComics() {
  // Get the search input value and trim whitespace
  const searchInput = document.getElementById('searchInputComic').value.trim();
  const timestamp = new Date().getTime();
  const hash = getHash(timestamp);

  // Construct the API URL for fetching comic data based on search input
  const apiUrl = `${CUSTOM_API_URL1}?apikey=${CUSTOM_PUBLIC_KEY}&ts=${timestamp}&hash=${hash}&titleStartsWith=${searchInput}`;

  // Fetch comic data from the Marvel API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const comicResultsElement = document.getElementById('comicResults');
      comicResultsElement.innerHTML = ''; // Clear previous results

      // Loop through the comic data and create HTML elements to display each comic
      data.data.results.forEach(comic => {
        const comicCard = document.createElement('div');
        comicCard.classList.add('col-lg-10', 'comic-card');
        comicCard.innerHTML = `
          <div class="card">
            <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" class="card-img-top" alt="${comic.title}">
            <div class="card-body">
              <h5 class="card-title">${comic.title}</h5>
              <p class="card-text">${comic.description || 'No description available'}</p>
            </div>
          </div>
        `;
        comicResultsElement.appendChild(comicCard);
      });
    })
    .catch(error => {
      console.error('There was a problem fetching the data:', error);
    });
}