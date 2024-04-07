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

    // Function to display crypto results with dynamic column class
    function displayCryptoResults(cryptoData) {
        $('#cryptoResults').empty();
        cryptoData.forEach(function (crypto) {
            let changeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let html = `<div class="card col-md-4">
                            <div class="card-body ${changeClass}">
                                <h5 class="card-title">${crypto.name} (${crypto.symbol})</h5>
                                <p class="card-text"> Price: $ ${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                                <p class="card-text">24h Change: <span>${formatSupplyValue(crypto.changePercent24Hr)}%</span></p>
                            </div>
                        </div>`;
            $('#cryptoResults').append(html);
        });
    }

    // Initial fetch and display of crypto data
    fetchCryptoData();
});