$(document).ready(function () {
    let cryptoDataCache = [];
    let isFirstUpdate = true;

    // Function to fetch crypto data
    function fetchCryptoData() {
        $.ajax({
            url: 'https://api.coincap.io/v2/assets',
            method: 'GET',
            success: function (data) {
                const newData = data.data;
                if (isFirstUpdate) {
                    cryptoDataCache = newData;
                    displayCryptoResults(cryptoDataCache);
                    displayTopGainersAndLosers(cryptoDataCache);
                    isFirstUpdate = false;
                    console.log('Initial data loaded successfully');
                } else {
                    updateTopGainersAndLosers(newData);
                    console.log('Data update successful'); // Log success
                }
            },
            error: function (error) {
                console.error('Error fetching data:', error);
                console.log('Data update error'); // Log error
            }
        });
    }

    // Initialize Typeahead
    $('#cryptoSearchInputField').typeahead({
        source: function(query, result) {
            // Make API call to get asset names
            axios.get('https://api.coincap.io/v2/assets')
                .then(function(response) {
                    const assets = response.data.data.map(asset => asset.name);
                    result(assets);
                })
                .catch(function(error) {
                    console.error('Error fetching assets:', error);
                });
        }
    });

       // Function to format supply value
function formatSupplyValue(supplyValue) {
    // Convert the supply value to a number
    let supplyNumber = parseFloat(supplyValue);

    // Check if the value is valid
    if (!isNaN(supplyNumber)) {
        // Use toLocaleString to add commas as thousands separators
        let formattedSupply = supplyNumber.toLocaleString('en-US', {
            maximumFractionDigits: 2, // Limiting to 2 decimal places
            minimumFractionDigits: 2 // Always display 2 decimal places
        });
        return formattedSupply;
    } else {
        return 'Invalid value';
    }
}

    // Function to fade out data points
    function fadeOutDataPoints(callback) {
        $('.card-body, .card-title').fadeOut(3000, callback);
    }

    // Function to fade in data points
    function fadeInDataPoints() {
        $('.card-body, .card-title').fadeIn(3000);
    }

    // Function to update top gainers and losers
    function updateTopGainersAndLosers(newData) {
        displayTopGainersAndLosers(newData);
        fadeInDataPoints();
    }

    // Function to update data points
    function updateDataPoints() {
        fetchCryptoData();
    }

    // Call updateDataPoints every 15 seconds (15000 milliseconds)
    setInterval(updateDataPoints, 15000);


    // ++++++++++++++++++++++++++++++++++++++++++++++


    // for top gainers and losers 

    // ++++++++++++++++++++++++++++++++++++++++++++++

    function displayCryptoResults(cryptoData) {
        // Only update if it's the initial load
        if (isFirstUpdate) {
            $('#cryptoResultsContainer').empty();
            cryptoData.forEach(function (crypto) {
                let changeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
                let changeIcon = parseFloat(crypto.changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';
                let html = `<div class="card cards col-md-4">
                                <div class="card-body ${changeClass}">
                                    <h5 class="card-title">${crypto.name} (${crypto.symbol})</h5>
                                    <p class="card-text"> Price: $ ${parseFloat(crypto.priceUsd).toFixed(2)}   ${changeIcon}</p>
                                    <p class="card-text">24h Change: <span>${formatSupplyValue(crypto.changePercent24Hr)}%</span></p>  
                                </div>
                            </div>`;
                $('#cryptoResultsContainer').append(html);
            });
        }
    }

    function displayTopGainersAndLosers(cryptoData) {
        let sortedByChange = [...cryptoData];
        sortedByChange.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr));

        $('#cryptoTopGainers').empty();
        $('#cryptoTopLosers').empty();

        for (let i = 0; i < 5; i++) {
            let changeClass = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';

            let gainerHtml = `<div class="card cards">
                                    <div class="card-body ${changeClass}">
                                        <h5 class="card-title">${sortedByChange[i].name} (${sortedByChange[i].symbol})</h5>
                                        <p class="card-text"> Price: $ ${parseFloat(sortedByChange[i].priceUsd).toFixed(2)}   ${changeIcon}</p>
                                        <p class="card-text">24h % Change: <span>${formatSupplyValue(sortedByChange[i].changePercent24Hr)}%</span></p>  
                                    </div>
                                </div>`;
            $('#cryptoTopGainers').append(gainerHtml);
        }

        for (let i = cryptoData.length - 1; i >= cryptoData.length - 5; i--) {
            let changeClass = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';

            let loserHtml = `<div class="card cards">
                                    <div class="card-body ${changeClass}">
                                        <h5 class="card-title">${sortedByChange[i].name} (${sortedByChange[i].symbol})</h5>
                                        <p class="card-text"> Price: $ ${parseFloat(sortedByChange[i].priceUsd).toFixed(2)}   ${changeIcon}</p>
                                        <p class="card-text">24h % Change: <span>${formatSupplyValue(sortedByChange[i].changePercent24Hr)}%</span></p>  
                                    </div>
                                </div>`;
            $('#cryptoTopLosers').append(loserHtml);
        }
    }

     // Function to display crypto results with dynamic column class
    function displayCryptoResults(cryptoData) {
        $('#cryptoResultsContainer').empty();
        cryptoData.forEach(function (crypto) {
            let changeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(crypto.changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';
            let html = `<div class="card cards col-md-4">
                            <div class="card-body ${changeClass}">
                                <h5 class="card-title">${crypto.name} (${crypto.symbol})</h5>
                                <p class="card-text">$ ${formatSupplyValue(parseFloat(crypto.priceUsd).toFixed(2))}</p>
                                <p class="card-text">${formatSupplyValue(crypto.changePercent24Hr)}%   ${changeIcon}</p>  
                            </div>
                        </div>`;
            $('#cryptoResultsContainer').append(html);
        });
    }

       // Function to display top gainers and losers
       function displayTopGainersAndLosers(cryptoData) {
        let sortedByChange = [...cryptoData];
        sortedByChange.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr));

        $('#cryptoTopGainers').empty();
        $('#cryptoTopLosers').empty();

        for (let i = 0; i < 15; i++) {
            let changeClass = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';

            let gainerHtml = `<div class="card cards">
                                    <div class="card-body ${changeClass}">
                                        <h5 class="card-title">${sortedByChange[i].name} (${sortedByChange[i].symbol})</h5>
                                        <p class="card-text">$ ${parseFloat(sortedByChange[i].priceUsd).toFixed(2)} </p>
                                        <p class="card-text">${formatSupplyValue(sortedByChange[i].changePercent24Hr)}%   ${changeIcon}</p>  
                                    </div>
                                </div>`;
            $('#cryptoTopGainers').append(gainerHtml);
        }

        for (let i = cryptoData.length - 1; i >= cryptoData.length - 15; i--) {
            let changeClass = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';

            let loserHtml = `<div class="card cards">
                                    <div class="card-body ${changeClass}">
                                        <h5 class="card-title">${sortedByChange[i].name} (${sortedByChange[i].symbol})</h5>
                                        <p class="card-text"> $ ${parseFloat(sortedByChange[i].priceUsd).toFixed(2)} </p>
                                        <p class="card-text">${formatSupplyValue(sortedByChange[i].changePercent24Hr)}%   ${changeIcon}</p>  
                                    </div>
                                </div>`;
            $('#cryptoTopLosers').append(loserHtml);
        }
    }



    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // for crypto searchCrypto


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Handle search button click
    $('#cryptoSearchButton').on('click', function() {
        const searchTerm = $('#cryptoSearchInputField').val();

        // Make API call to search for asset by name
        axios.get(`https://api.coincap.io/v2/assets?search=${searchTerm}`)
            .then(function(response) {
                const asset = response.data.data[0]; // Take the first matching asset
                if (asset) {
                    displaySearchResult(asset);
                } else {
                    displayNoResults();
                }
            })
            .catch(function(error) {
                console.error('Error searching assets:', error);
            });
    });

    // Function to display search result in modal
    function displaySearchResult(asset) {
        const modalBody = document.getElementById('cryptoResultsContainerModal');
        modalBody.innerHTML = '';
    
        const { name, rank, symbol, priceUsd, changePercent24Hr, marketCapUsd, explorer } = asset;
    
        // Determine the change class based on the change percentage value
        let changeClass = parseFloat(changePercent24Hr) >= 0 ? 'w3-text-green' : 'w3-text-red';
        let iconClass = parseFloat(changePercent24Hr) >= 0 ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down';
    
        const resultHtml = `
            <div class="w3-card cards w3-margin-bottom">
                <div class="w3-container ${changeClass}">
                    ${name} (${symbol})
                    <i class="${iconClass}"></i>
                </div>
                <div class="w3-container">
                    <p class="${changeClass}">Rank: ${rank}</p>
                    <p class="${changeClass}">Price (USD): $ ${formatSupplyValue(priceUsd)}</p>
                    <p class="${changeClass}">24h % Change: <span>${formatSupplyValue(changePercent24Hr)}%  <i class="${iconClass}"></i></span></p>
                    <p class="${changeClass}">Market Cap (USD): $ ${formatSupplyValue(marketCapUsd)}</p>
                    <a class="${changeClass}" target="_blank" href="${explorer}">Explore more ${name} (Link to another place)</a>
                    
                </div>
            </div>
        `;
        modalBody.insertAdjacentHTML('beforeend', resultHtml);
    
        // Apply the change class to the change percentage span
        modalBody.querySelector('.w3-container .w3-text-green').classList.add('w3-text-green');
        modalBody.querySelector('.w3-container .w3-text-red').classList.add('w3-text-red');
    
        document.getElementById('cryptoResultsModal').style.display = 'block';
    }

    // Function to display no results message in modal
    function displayNoResults() {
        const modalBody = $('#cryptoResultsContainerModal');
        modalBody.empty();

        const noResultsHtml = `
            <div class="alert alert-warning" role="alert">
                No results found for the entered search term.
            </div>
        `;
        modalBody.append(noResultsHtml);

        $('#cryptoResultsModal').modal('show');
    }

    // Initial fetch and display of crypto ALL data
    fetchCryptoData();
});




// =====================================================



//       FOR CRYPTO HEATMAP


// ======================================================

const cryptoSocket = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

cryptoSocket.onopen = function(e) {
    console.log("Connection established");
};

cryptoSocket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    for (const [symbol, price] of Object.entries(data)) {
        updateCryptoTradeInfoDisplay(symbol, parseFloat(price));
    }
};

cryptoSocket.onerror = function(error) {
    console.log(`WebSocket error: ${error.message}`);
};

function updateCryptoTradeInfoDisplay(symbol, price) {
    const tradeInfoGrid = document.getElementById('tradeInfoGridCrypto');

    let tradeInfoElement = document.getElementById(`tradeInfo_${symbol}`);
    if (!tradeInfoElement) {
        tradeInfoElement = document.createElement('div');
        tradeInfoElement.style.display = 'inline-block';
        tradeInfoElement.classList.add('mb-6', 'col', 'blockCrypto');
        tradeInfoElement.id = `tradeInfo_${symbol}`;
        tradeInfoGrid.appendChild(tradeInfoElement);
    }

    let card = tradeInfoElement.querySelector('.card');
    if (!card) {
        card = document.createElement('div');
        card.classList.add('card', 'cards', 'h-100');
        tradeInfoElement.appendChild(card);
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const combinedInfo = document.createElement('h5');
    combinedInfo.classList.add('card-title');
    combinedInfo.innerText = symbol;

    const tradeContent = document.createElement('div');
    tradeContent.classList.add('trade-content', 'p-3', 'rounded');
    tradeContent.innerText = `$${price.toFixed(2)}`;

    card.innerHTML = '';
    card.appendChild(cardBody);
    cardBody.appendChild(combinedInfo);
    cardBody.appendChild(tradeContent);

    const prevPrice = parseFloat(tradeInfoElement.getAttribute('data-prev-price'));
    updateCryptoTradeColor(card, prevPrice, price);
    tradeInfoElement.setAttribute('data-prev-price', price.toString());
}

function updateCryptoTradeColor(card, prevPrice, currentPrice) {
    if (prevPrice !== null && currentPrice > prevPrice) {
        card.style.backgroundColor = '#4CAF50';
    } else if (prevPrice !== null && currentPrice < prevPrice) {
        card.style.backgroundColor = '#F44336';
    } else {
        card.style.backgroundColor = '';
    }
}

// Typeahead search functionality
function searchCrypto() {
    const searchText = document.getElementById('searchCrypto').value.toLowerCase();
    const tradeInfoElements = document.querySelectorAll('[id^="tradeInfo_"]');

    tradeInfoElements.forEach(element => {
        const symbol = element.id.replace('tradeInfo_', '');
        if (symbol.toLowerCase().includes(searchText)) {
            element.style.display = ''; // Let CSS handle the display
        } else {
            element.style.display = 'none'; // Hide non-matching elements
        }
    });
}

document.getElementById('searchCrypto').addEventListener('input', searchCrypto);
