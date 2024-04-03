const CUSTOM_PUBLIC_KEY = '6290afb298c151e1dd65994d6b75475d'; 
const CUSTOM_PRIVATE_KEY = '30b26f71fe92998a8479ec02dd44a180ab67bb0d'; 
const CUSTOM_API_URL = 'https://gateway.marvel.com/v1/public/characters';

const customTs = new Date().getTime();
const customHash = CryptoJS.MD5(customTs + CUSTOM_PRIVATE_KEY + CUSTOM_PUBLIC_KEY).toString();

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

const displayCustomResults = async () => {
    const customSearchInput = document.getElementById('customSearchInput').value.trim();
    const customResultsDiv = document.getElementById('customResults');
    customResultsDiv.innerHTML = ''; // Clear previous results

    if (customSearchInput) {
        const data = await customFetchData(customSearchInput);
        if (data && data.data && data.data.results) {
            data.data.results.forEach(character => {
                const characterDiv = document.createElement('div');
                characterDiv.classList.add('col-md-10', 'mb-10');

                const thumbnail = `${character.thumbnail.path}.${character.thumbnail.extension}`;
                const characterImage = `<img src="${thumbnail}" class="img-fluid" alt="${character.name}">`;

                const characterInfo = `<h2>${character.name}</h2>
                                        <p>${character.description || 'No description available'}</p>`;                               
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

document.getElementById('customSearchButton').addEventListener('click', displayCustomResults);

// Initialize autocomplete using Bootstrap Typeahead
$(document).ready(function() {
    $('#customSearchInput').typeahead({
        source: async function(query, result) {
            const data = await customFetchData(query);
            if (data && data.data && data.data.results) {
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


const CUSTOM_API_URL1 = 'https://gateway.marvel.com/v1/public/comics';

function getHash(timestamp) {
    const hash = CryptoJS.MD5(timestamp + CUSTOM_PRIVATE_KEY + CUSTOM_PUBLIC_KEY);
    return hash.toString();
  }

  const autocompleteUrl = `${CUSTOM_API_URL1}?apikey=${CUSTOM_PUBLIC_KEY}&ts=${new Date().getTime()}&hash=${getHash(new Date().getTime())}`;

  $('#searchInputComic').typeahead({
    source: function (query, result) {
      $.getJSON(autocompleteUrl + '&titleStartsWith=' + query, function (data) {
        const titles = data.data.results.map(comic => comic.title);
        result(titles);
      });
    }
  });

  function searchComics() {
    const searchInput = document.getElementById('searchInputComic').value.trim();
    const timestamp = new Date().getTime();
    const hash = getHash(timestamp);

    const apiUrl = `${CUSTOM_API_URL1}?apikey=${CUSTOM_PUBLIC_KEY}&ts=${timestamp}&hash=${hash}&titleStartsWith=${searchInput}`;

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