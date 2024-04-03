const CUSTOM_PUBLIC_KEY = '6290afb298c151e1dd65994d6b75475d'; // Replace 'your_public_key' with your actual public key from Marvel API
const CUSTOM_PRIVATE_KEY = '30b26f71fe92998a8479ec02dd44a180ab67bb0d'; // Replace 'your_private_key' with your actual private key from Marvel API
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