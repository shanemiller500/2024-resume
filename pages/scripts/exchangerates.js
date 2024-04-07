$(document).ready(function () {
    let cryptoDataCache = [];

    // Function to fetch crypto data
    function fetchCryptoData() {
        $.ajax({
            url: 'https://api.coincap.io/v2/assets',
            method: 'GET',
            success: function (data) {
                cryptoDataCache = data.data;
                displayCryptoResults(cryptoDataCache);
                initializeAutocomplete(cryptoDataCache);
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    function formatSupplyValue(supplyValue) {
// Convert the supply value to a number
let supplyNumber = parseFloat(supplyValue);

// Check if the value is valid
if (!isNaN(supplyNumber)) {
// Use toLocaleString to add commas as thousands separators
let formattedSupply = supplyNumber.toLocaleString('en-US', {
    maximumFractionDigits: 2 // Limiting to 2 decimal places
});
return formattedSupply;
} else {
return 'Invalid value';
}
}

function displayCryptoResults(cryptoData, isAutocomplete) {
    $('#cryptoResults').empty();

    // Sort cryptoData based on 24-hour change percentage in descending order
    cryptoData.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr));

    // Separate top gainers and top losers
    let topGainers = cryptoData.filter(crypto => parseFloat(crypto.changePercent24Hr) >= 0).slice(0, 10);
    let topLosers = cryptoData.filter(crypto => parseFloat(crypto.changePercent24Hr) < 0).slice(0, 10);

    // Display top gainers and top losers side by side
    $('#cryptoResults').append('<div class="row"></div>');
    displayCryptoCards(topGainers, isAutocomplete, 'Top Gainers');
    displayCryptoCards(topLosers, isAutocomplete, 'Top Losers');
}

function displayCryptoCards(cryptoData, isAutocomplete, title) {
    let columnClass = isAutocomplete ? 'col-md-6' : 'col-sm-6'; // Adjust column class as needed

    let html = `<div class="${columnClass}">
                    <h3>${title}</h3>`;
    
    cryptoData.forEach(function (crypto) {
        let changeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
        html += `<div class="card mb-3 ${changeClass}">
                    <div class="card-body">
                        <h5 class="card-title">${crypto.name} (${crypto.symbol})</h5>
                        <p class="card-text">Price: $ ${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                        <p class="card-text">Volume: ${formatSupplyValue(crypto.volumeUsd24Hr)}</p>
                        <p class="card-text">24h Change: <span>${formatSupplyValue(crypto.changePercent24Hr)}%</span></p>
                        <p class="card-text">Ranking: ${crypto.rank}</p>
                        <p class="card-text">Supply: ${formatSupplyValue(crypto.supply)}</p>
                        <p class="card-text">Market Cap (USD): ${formatSupplyValue(crypto.marketCapUsd)}</p>
                    </div>
                </div>`;
    });

    html += '</div>'; // Close the column div
    $('#cryptoResults .row').append(html);
}

// Initialize autocomplete for search input
function initializeAutocomplete(cryptoData) {
    let cryptoNames = cryptoData.map(crypto => crypto.name);
    let cryptoSymbols = cryptoData.map(crypto => crypto.symbol);
    let allCryptoNamesAndSymbols = [...cryptoNames, ...cryptoSymbols];

    $('#searchCrypto').autocomplete({
        source: allCryptoNamesAndSymbols,
        select: function (event, ui) {
            let selectedCrypto = ui.item.value;
            let filteredCryptoData = cryptoDataCache.filter(crypto => crypto.name === selectedCrypto || crypto.symbol === selectedCrypto);
            displayCryptoResults(filteredCryptoData, true); // Pass true to indicate autocomplete display
            return false;
        }
    });

    $('#searchCrypto').on('keyup', function () {
        if ($(this).val() === '') {
            displayCryptoResults(cryptoDataCache, false); // Pass false to indicate keyup display
        }
    });
}

// Initial fetch and display of crypto data
fetchCryptoData();
});