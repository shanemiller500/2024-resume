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



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// new searchCrypto

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let chart;
let cryptocurrencies = {};

async function getCryptoList() {
    const url = 'https://api.coincap.io/v2/assets';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.reduce((acc, crypto) => {
            acc[crypto.symbol] = crypto.name.toLowerCase(); // Map symbol to lowercase name
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching cryptocurrency list:', error);
        return {};
    }
}

async function fetchCryptoData(cryptoName) {
    const end = Date.now();
    const start = end - 24 * 60 * 60 * 1000;
    const url = `https://api.coincap.io/v2/assets/${cryptoName}/history?interval=m1&start=${start}&end=${end}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            console.log("No data received or empty data array.");
            return [];
        }
        return data.data.map(entry => ({
            t: entry.time,
            y: parseFloat(entry.priceUsd)
        }));
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        return [];
    }
}

async function fetchCryptoDetails(cryptoName) {
    const url = `https://api.coincap.io/v2/assets/${cryptoName}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching cryptocurrency details:', error);
        return null;
    }
}

function displayCryptoDetails(data) {
    const detailsBody = document.getElementById('cryptoDetails').querySelector('tbody');
    const priceUsd = parseFloat(data.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const changePercent24Hr = parseFloat(data.changePercent24Hr).toFixed(2);
    const color = changePercent24Hr.startsWith('-') ? '#F44336' : '#4CAF50';
    var iconClass =changePercent24Hr.startsWith('-')? 'fa fa-angle-double-down' : 'fa fa-angle-double-up';
    detailsBody.innerHTML = ''; // Clear previous entries
    if (!data) {
        const row = `<tr><td colspan="11">No details available</td></tr>`;
        detailsBody.innerHTML = row;
        return;
    }
    const row = `
        
        <h2>${data.name} (${data.symbol}) </h2>
        <h2 style="color: ${color};">$${priceUsd} | ${changePercent24Hr}% <i style="color: ${color};" class="${iconClass}"></i></h2>
        <br>
        <tr>
            <td>Rank:</td>
            <td>${data.rank}</td>
            <td>Supply:</td>
            <td>${parseInt(data.supply).toLocaleString()}</td>
            </tr>
            <tr>
            <td>Max Supply:</td>
            <td>${data.maxSupply ? parseInt(data.maxSupply).toLocaleString() : 'N/A'}</td>
            <td>Market Cap (USD):</td>
            <td>${parseFloat(data.marketCapUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
            <td>24Hr Volume (USD):</td>
            <td>${parseFloat(data.volumeUsd24Hr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>VWAP (24Hr):</td>
            <td>${data.vwap24Hr ? parseFloat(data.vwap24Hr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</td>
        
            </tr>
        <br><br>
            <p><a href="${data.explorer}" target="_blank">${data.name} Blockchain Explorer</a></p>`;
    detailsBody.innerHTML = row;
}

    function loadTypeaheadScript() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.3.1/typeahead.bundle.min.js';
        script.onload = () => {
            console.log('Typeahead script loaded successfully.');
            initializeTypeahead(); // Function to initialize Typeahead
        };
        script.onerror = () => {
            console.error('Failed to load the Typeahead script.');
        };
        document.head.appendChild(script);
    }
    document.addEventListener('DOMContentLoaded', function() {
        loadTypeaheadScript(); // Load Typeahead when the DOM is fully loaded
    });

    function setupTypeahead(cryptocurrencies) {
        const cryptoSymbols = Object.keys(cryptocurrencies);
        var bloodhound = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: cryptoSymbols
        });

        $('#cryptoName').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'cryptocurrencies',
            source: bloodhound
        });
    }

document.getElementById('fetchData').addEventListener('click', async () => {
    const symbol = document.getElementById('cryptoName').value.trim().toUpperCase();
    const name = cryptocurrencies[symbol];
    if (name) {
        await renderChart(name);
        const details = await fetchCryptoDetails(name);
        if (details && details.data) {
            displayCryptoDetails(details.data);
        } else {
            displayCryptoDetails(null);
        }
    } else {
        console.log('Invalid cryptocurrency symbol.');
    }
});

async function renderChart(cryptoName) {
    const cryptoData = await fetchCryptoData(cryptoName);
    if (cryptoData.length === 0) {
        console.log("No data to display.");
        return;
    }
    const ctx = document.getElementById('cryptoChart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `${cryptoName.charAt(0).toUpperCase() + cryptoName.slice(1)} Price (USD)`,
                data: cryptoData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        tooltipFormat: 'MMM D, HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price in USD'
                    }
                }
            },
            parsing: {
                xAxisKey: 't',
                yAxisKey: 'y'
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function init() {
    cryptocurrencies = await getCryptoList();
    setupTypeahead(cryptocurrencies);
    await renderChart('bitcoin'); // Default chart rendering
    const details = await fetchCryptoDetails('bitcoin');
    if (details && details.data) {
        displayCryptoDetails(details.data);
    } else {
        displayCryptoDetails(null);
    }
}

init();



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
    combinedInfo.classList.add('card-title', 'crypto-title');
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
