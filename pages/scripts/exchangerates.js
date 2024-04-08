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

    function displayCryptoResults(cryptoData) {
        // Only update if it's the initial load
        if (isFirstUpdate) {
            $('#cryptoResultsContainer').empty();
            cryptoData.forEach(function (crypto) {
                let changeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
                let changeIcon = parseFloat(crypto.changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';
                let html = `<div class="card col-md-4">
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

            let gainerHtml = `<div class="card">
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

            let loserHtml = `<div class="card">
                                    <div class="card-body ${changeClass}">
                                        <h5 class="card-title">${sortedByChange[i].name} (${sortedByChange[i].symbol})</h5>
                                        <p class="card-text"> Price: $ ${parseFloat(sortedByChange[i].priceUsd).toFixed(2)}   ${changeIcon}</p>
                                        <p class="card-text">24h % Change: <span>${formatSupplyValue(sortedByChange[i].changePercent24Hr)}%</span></p>  
                                    </div>
                                </div>`;
            $('#cryptoTopLosers').append(loserHtml);
        }
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
    
        const { name, rank, symbol, price, priceUsd, changePercent24Hr, marketCapUsd } = asset;
    
        // Determine the change class based on the change percentage value
        let changeClass = parseFloat(changePercent24Hr) >= 0 ? 'w3-text-green' : 'w3-text-red';
        let iconClass = parseFloat(changePercent24Hr) >= 0 ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down';
    
        const resultHtml = `
            <div class="w3-card w3-margin-bottom">
                <div class="w3-container ${changeClass}">
                    ${name} (${symbol})
                    <i class="${iconClass}"></i>
                </div>
                <div class="w3-container">
                    <p class="${changeClass}">Rank: ${rank}</p>
                    <p class="${changeClass}">Price (USD): $ ${formatSupplyValue(priceUsd)}</p>
                    <p class="${changeClass}">24h % Change: <span>${formatSupplyValue(changePercent24Hr)}%  <i class="${iconClass}"></i></span></p>
                    <p class="${changeClass}">Market Cap (USD): $ ${formatSupplyValue(marketCapUsd)}</p>
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

    // Function to display crypto results with dynamic column class
    function displayCryptoResults(cryptoData) {
        $('#cryptoResultsContainer').empty();
        cryptoData.forEach(function (crypto) {
            let changeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(crypto.changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';
            let html = `<div class="card col-md-4">
                            <div class="card-body ${changeClass}">
                                <h5 class="card-title">${crypto.name} (${crypto.symbol})</h5>
                                <p class="card-text"> Price: $ ${formatSupplyValue(parseFloat(crypto.priceUsd).toFixed(2))}   ${changeIcon}</p>
                                <p class="card-text">24h % Change: <span>${formatSupplyValue(crypto.changePercent24Hr)}%</span></p>  
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

        for (let i = 0; i < 5; i++) {
            let changeClass = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? 'text-success' : 'text-danger';
            let changeIcon = parseFloat(sortedByChange[i].changePercent24Hr) >= 0 ? '<i class="fas fa-angle-double-up"></i>' : '<i class="fas fa-angle-double-down"></i>';

            let gainerHtml = `<div class="card">
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

            let loserHtml = `<div class="card">
                                    <div class="card-body ${changeClass}">
                                        <h5 class="card-title">${sortedByChange[i].name} (${sortedByChange[i].symbol})</h5>
                                        <p class="card-text"> Price: $ ${parseFloat(sortedByChange[i].priceUsd).toFixed(2)}   ${changeIcon}</p>
                                        <p class="card-text">24h % Change: <span>${formatSupplyValue(sortedByChange[i].changePercent24Hr)}%</span></p>  
                                    </div>
                                </div>`;
            $('#cryptoTopLosers').append(loserHtml);
        }
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
    
        const { name, rank, symbol, price, priceUsd, changePercent24Hr, marketCapUsd, explorer } = asset;
    
        // Determine the change class based on the change percentage value
        let changeClass = parseFloat(changePercent24Hr) >= 0 ? 'w3-text-green' : 'w3-text-red';
        let iconClass = parseFloat(changePercent24Hr) >= 0 ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down';
    
        const resultHtml = `
            <div class="w3-card w3-margin-bottom">
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

    // Initial fetch and display of crypto data
    fetchCryptoData();
});

