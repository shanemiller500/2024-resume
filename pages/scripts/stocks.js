// +++++++++++++++++++++++++++++++++++++++++++++++++++++++

            // for stock quote


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
$(document).ready(function () {
    var stockInput = $('#stockInput');
    var currentPage = 1;
    var pageSize = 5;

    stockInput.typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'stocks',
        display: 'symbol',
        source: function (query, syncResults, asyncResults) {
            $.get('https://finnhub.io/api/v1/search', {
                q: query,
                token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
            }, function (data) {
                asyncResults(data.result.map(function (item) {
                    return item.symbol;
                }));
            });
        }
    });

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' };
        return date.toLocaleString('en-US', options);
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

    $('#stockSearchBtn').on('click', function () {
        var selectedSymbol = stockInput.val();
    
        if (selectedSymbol) {
            $('#randomSpinner').show(); // Show spinner
    
            $.get('https://finnhub.io/api/v1/quote', {
                symbol: selectedSymbol,
                token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
            }, function (quoteData) {
                $.get('https://finnhub.io/api/v1/stock/profile2', {
                    symbol: selectedSymbol,
                    token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
                }, function (profileData) {
                    $.get('https://finnhub.io/api/v1/stock/metric', {
                        symbol: selectedSymbol,
                        metric: 'all',
                        token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
                    }, function (metricData) {
                        $.get('https://finnhub.io/api/v1/stock/market-status', {
                            exchange: 'US',
                            token: 'coatnm1r01qro9kpiodgcoatnm1r01qro9kpioe0'
                        }, function (marketStatusData) {
                            var description = profileData.name;
                            var stockSymbol = profileData.ticker;
    
                            // Check if description or stockSymbol is null
                            if (!description || !stockSymbol) {
                                alert("WHAT THE HELL EVEN IS THAT?? Just kidding, its likely invalid or not available in this universe");
                                $('#randomSpinner').hide(); // Hide spinner
                                return; // Stop further execution
                            }
    
                            var logo = profileData.logo;
                            var priceColor = quoteData.c > quoteData.o ? 'green' : 'red';
                            var iconClass = parseFloat(quoteData.c > quoteData.o ? 1 : -1) >= 0 ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down';
                            var fiftyTwoWeekHigh = metricData.metric['52WeekHigh'];
                            var fiftyTwoWeekHighDate = metricData.metric['52WeekHighDate'];
                            var fiftyTwoWeekLow = metricData.metric['52WeekLow'];
                            var fiftyTwoWeekLowDate = metricData.metric['52WeekLowDate'];
                            var marketCapitalization = metricData.metric['marketCapitalization'];
                            var epsTTM = metricData.metric['epsTTM'];
                            var isOpenText = marketStatusData.isOpen ? 'Market Open' : 'Market closed';
                     
                            

    
                            var stockInfo = `
                                <div class="row">
                                    <div class="col-xs-6">
                                        <h2>${description} - (${stockSymbol})  <img src="${logo}" alt="Stock Logo" style="max-width: 200px; max-height: 200px; float: right;"></h2>
                                        <h2 style="color: ${priceColor}">$${formatSupplyValue(quoteData.c)} | ${formatSupplyValue(quoteData.dp)}%  <i class="${iconClass}"></i></h2>
                                        <br><br>
                                        <dd>${isOpenText} | As of: ${formatDate(marketStatusData.t)}</dd>
                                        <dd>Exchange: ${marketStatusData.exchange}</dd>
                                        <br>
                                    </div>
                                </div>
    
                                <table class="table table-striped">
                                    <tr>
                                        <td style="color: ${priceColor}">Current Price: </td>
                                        <td style="color: ${priceColor}">$${formatSupplyValue(quoteData.c)} <i class="${iconClass}"></i></span></td>
                                        <td>Open Price</td>
                                        <td>$${formatSupplyValue(quoteData.o)}</td>
                                    </tr>
                                    <tr>
                                        <td>High Price</td>
                                        <td>$${formatSupplyValue(quoteData.h)}</td>
                                        <td>Low Price</td>
                                        <td>$${formatSupplyValue(quoteData.l)}</td>
                                    </tr>
                                    <tr>
                                        <td>52 Week High</td>
                                        <td>$${formatSupplyValue(fiftyTwoWeekHigh)}</td>
                                        <td>Date</td>
                                        <td>${fiftyTwoWeekHighDate}</td>
                                    </tr>
                                    <tr>
                                        <td>52 Week Low</td>
                                        <td>$${formatSupplyValue(fiftyTwoWeekLow)}</td>
                                        <td>Date</td>
                                        <td>${fiftyTwoWeekLowDate}</td>
                                    </tr>
                                    <tr>
                                        <td>Market Cap</td>
                                        <td>$${formatSupplyValue(marketCapitalization)}</td>
                                        <td> EPS TTM:</td>
                                        <td>$${formatSupplyValue(epsTTM)}</td>
                                    </tr>
        
                                </table>
                            `;
                            $('#stockData').html(stockInfo);

                            function formatDate(timestamp) {
                                var date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
                                var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                                return date.toLocaleDateString('en-US', options);
                              }
    
                            $.get('https://finnhub.io/api/v1/company-news', {
                                symbol: selectedSymbol,
                                from: new Date(Date.now() - 86400000).toISOString().slice(0, 10), // 86400000 milliseconds = 1 day
                                to: new Date().toISOString().slice(0, 10),
                                token: 'coatnm1r01qro9kpiodgcoatnm1r01qro9kpioe0'
                            }, function (newsData) {
                                var newsHtml = '';
                                if (newsData && newsData.length > 0) {
                                    var startIndex = (currentPage - 1) * pageSize;
                                    var endIndex = startIndex + pageSize;
                                    var paginatedData = newsData.slice(startIndex, endIndex);
                            
                                    paginatedData.forEach(function (newsItem, index) {
                                        newsHtml += `
                                        ${index === 0 ? '<h3>Latest News</h3>' : ''} 
                                            <div class="card mb-3">
                                                <div class="card-body">
                                                    <h5 class="card-title">${newsItem.headline}</h5>
                                                    <dd style='color:white;' >Release date: ${formatDate(newsItem.datetime)}</dd> 
                                                    ${newsItem.image !== '' ? `<img src="${newsItem.image}" style="max-width: 170px; max-height: 200px; float: right;" alt="News Image">` : ''}
                                                    <p class="card-text" id="newsSummaryColor">${newsItem.summary}</p>
                                                    <dd style='color:white;' >Source: ${newsItem.source}</dd> 
                                                    <br>
                                                    <a class="aTypeButton" href="${newsItem.url}" target="_blank">Read More</a>
                                                </div>
                                            </div>`;
                                    });
                                } else {
                                    newsHtml = '<p>No news found for today.</p>';
                                }
                            
                                $('#stockNewsResults').html(newsHtml);
                                $('#randomSpinner').hide(); // Hide spinner after data is loaded
                            });
                        });
                    });
                });
            });
        }
    });

    // Event listener for Enter key press
    stockInput.on('keydown', function (event) {
        if (event.keyCode === 13) { // 13 is the keycode for Enter key
            $('#stockSearchBtn').trigger('click'); // Trigger the search button click event
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//      FOR IPO 


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function openTab(tabName) {
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
}

document.addEventListener('DOMContentLoaded', function () {
    fetchIPOCalendar();
    document.getElementById('searchInput').addEventListener('input', function () {
        filterIPOCalendar(this.value.trim().toLowerCase());
    });
});

async function fetchIPOCalendar() {
    try {
        const response = await fetch('https://finnhub.io/api/v1/calendar/ipo?from=2024-01-01&to=2025-01-01&token=co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0');
        const data = await response.json();
        if (data && data.ipoCalendar && data.ipoCalendar.length > 0) {
            renderIPOCalendar(data.ipoCalendar);
        } else {
            console.error('No IPO data found.');
        }
    } catch (error) {
        console.error('Error fetching IPO calendar:', error);
    }
}

function renderIPOCalendar(ipoEvents) {
    const ipoCalendarContainer = document.getElementById('ipoCalendar');
    ipoCalendarContainer.innerHTML = ''; // Clear previous content

    ipoEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('col-md-4');

        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = event.name;

        const date = document.createElement('p');
        date.classList.add('card-text', 'mb-2');
        date.textContent = `Date: ${event.date}`;

        const exchange = document.createElement('p');
        exchange.classList.add('card-text', 'mb-2');
        exchange.textContent = `Exchange: ${event.exchange}`;

        const price = document.createElement('p');
        price.classList.add('card-text', 'mb-2');
        price.textContent = `Price Range: ${event.price}`;

        const shares = document.createElement('p');
        shares.classList.add('card-text', 'mb-2');
        shares.textContent = `Shares: ${event.shares}`;

        const status = document.createElement('p');
        status.classList.add('card-text', 'mb-2');
        status.textContent = `Status: ${event.status}`;

        cardBody.appendChild(title);
        cardBody.appendChild(date);
        cardBody.appendChild(exchange);
        cardBody.appendChild(price);
        cardBody.appendChild(shares);
        cardBody.appendChild(status);

        card.appendChild(cardBody);
        eventCard.appendChild(card);

        ipoCalendarContainer.appendChild(eventCard);
    });
}

function filterIPOCalendar(searchTerm) {
    const eventCards = document.querySelectorAll('.col-md-4');
    let dataFound = false; // Flag to track if data is found
    eventCards.forEach(card => {
        const eventName = card.querySelector('.card-title').textContent.toLowerCase();
        if (eventName.includes(searchTerm)) {
            card.classList.add('sizingCol'); // Add the 'sizingCol' class
            card.style.display = 'block';
            dataFound = true; // Set the flag to true if data is found
        } else {
            card.classList.remove('sizingCol'); // Remove the 'sizingCol' class
            card.style.display = 'none';
        }
    });

    // Show "No data found" message if no data is found
    const noDataMessage = document.getElementById('dataNotFoundMessage');
    if (!dataFound) {
        noDataMessage.style.display = 'block';
    } else {
        noDataMessage.style.display = 'none';
    }
}




// ++++++++++++++++++++++++++++++++++++++++++++++++++++


//               EARNINGS


// ++++++++++++++++++++++++++++++++++++++++++++++++++++



function openTab(tabName) {
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
  }
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

document.addEventListener('DOMContentLoaded', function () {
    const earningsTable = document.getElementById('earningsTable');
    const earningsBody = document.getElementById('earningsBody');

    // Make API request to Finnhub
    fetch('https://finnhub.io/api/v1/calendar/earnings?from=2024-01-01&to=2024-04-31&token=co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0')
        .then(response => response.json())
        .then(data => {
            // Sort the earningsCalendar array by date, with today's date first
            const today = new Date().toISOString().slice(0, 10);
            data.earningsCalendar.sort((a, b) => {
                if (a.date === today) return -1;
                if (b.date === today) return 1;
                return a.date.localeCompare(b.date);
            });

            data.earningsCalendar.forEach(item => {
                const row = document.createElement('tr');
                // Use the formatSupplyValue function and handle null values
                const epsEstimate = item.epsEstimate ? formatSupplyValue(item.epsEstimate) : '--';
                const revenueActual = item.revenueActual ? formatSupplyValue(item.revenueActual) : '--';
                row.innerHTML = `
                    <td>${item.symbol}</td>
                    <td>${item.date}</td>
                    <td>${epsEstimate}</td>
                    <td>${revenueActual}</td>
                    <td>${item.epsSurprise}</td>
                    <td>${item.quarter}</td>
                `;
                earningsBody.appendChild(row);
            });

            // Initialize Typeahead for the search input
            const searchInput = document.getElementById('earningsSearchInput');
            $(searchInput).typeahead({
                source: data.earningsCalendar.map(item => item.symbol),
                afterSelect: function (item) {
                    filterTable(item);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to filter the table based on the selected ticker symbol
    function filterTable(ticker) {
        const rows = earningsBody.querySelectorAll('tr');
        rows.forEach(row => {
            const symbol = row.querySelector('td').textContent;
            if (symbol.toLowerCase().includes(ticker.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
});



// +++++++++++++++++++++++++++++++++++++++++++


// news search tab 


// +++++++++++++++++++++++++++++++++++++++++++



$(document).ready(function() {
  // Function to fetch and display news based on user input
  function searchNews() {
    var selectedSymbol = $('#searchNewsTabStockInput').val();
    $.get('https://finnhub.io/api/v1/company-news', {
      symbol: selectedSymbol,
      from: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
      token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
    }, function(data) {
      displayNews(data);
    });
  }

  // Call searchNews() when search button is clicked
  $('#searchNewsTabBtn').on('click', function() {
    searchNews();
  });

  // Call searchNews() when Enter key is pressed in the input field
  $('#searchNewsTabStockInput').keypress(function(event) {
    if (event.which == 13) {
      searchNews();
    }
  });

  // Function to format Unix timestamp to a date string
  function formatDate(timestamp) {
    var date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Function to display news data
  function displayNews(newsData) {
    var newsResults = $('#searchNewsTabNewsResults');
    newsResults.empty();
    if (newsData && newsData.length > 0) {
      newsData.forEach(function(news) {
        var newsItem = $('<div class="col-md-6 mb-6"></div>');
        var newsCard = $('<div class="card"></div>');
        var cardBody = $('<div class="card-body"></div>');

        var category = $('<h5 class="card-title white">' + news.category + '</h5>');
        var datetime = $('<p class="card-text white">Released: ' + formatDate(news.datetime) + '</p>');
        var related = $('<p class="card-text white">Related: ' + news.related + '</p>');
        var source = $('<p class="card-text white">Source: ' + news.source + '</p>');
        var summary = $('<p class="card-text white">Summary: ' + news.summary + '</p> <br>');
        var url = $('<a class="aTypeButton" href="' + news.url + '" target="_blank">Read More</a>');

        cardBody.append(category);
        cardBody.append(datetime);
        cardBody.append(related);
        cardBody.append(source);
        cardBody.append(summary);
        cardBody.append(url);

        if (news.image && news.image !== "") {
          var image = $('<img class="card-img-top" src="' + news.image + '" alt="News Image">');
          newsCard.append(image);
        }

        newsCard.append(cardBody);
        newsItem.append(newsCard);

        newsResults.append(newsItem);
      });
    } else {
      newsResults.append('<p class="col-md-12">No news found for the selected symbol.</p>');
    }
  }

  // Fetch and display all news on page load
  $.get('https://finnhub.io/api/v1/news', {
    category: 'general',
    token: 'coatnm1r01qro9kpiodgcoatnm1r01qro9kpioe0'
  }, function(data) {
    displayNews(data);
  });
});






// +++++++++++++++++++++++++++++++++++++++


// Live streaming top quotes 


// +++++++++++++++++++++++++++++++++++++++


const socket = new WebSocket('wss://ws.finnhub.io?token=coatnm1r01qro9kpiodgcoatnm1r01qro9kpioe0');

console.info('1. New websocket created.');


function formatDate(timestamp) {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' };
    return date.toLocaleString('en-US', options);
}
// Initialize object to store trade information for each symbol
const tradeInfoMap = {};

// Function to check market status
// Function to check market status
function checkMarketStatus() {
    fetch('https://finnhub.io/api/v1/stock/market-status?exchange=US&token=coatnm1r01qro9kpiodgcoatnm1r01qro9kpioe0')
      .then(response => response.json())
      .then(data => {
        const marketStatus = document.getElementById('marketStatus');
        if (data.isOpen) {
          marketStatus.textContent = `Market is open. Current time: ${formatDate(data.t)}`;
          subscribeToSymbols();
        } else {
          marketStatus.textContent = 'Market is closed.';
        }
      })
      .catch(error => console.error('Error checking market status:', error));
  }

// Subscribe to symbols if market is open
function subscribeToSymbols() {
  const symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'FB', 'NVDA', 'PYPL', 'ASML', 'ADBE', 'CMCSA', 'CSCO', 'PEP', 'NFLX', 'AVGO', 'INTU', 'AMD', 'IBM', 'TXN', 'QCOM', 'COST', 'ABBV', 'CRM', 'ACN', 'T', 'NKE', 'NEE', 'DHR', 'ORCL', 'UNH', 'FIS', 'BMY', 'LLY', 'CVX', 'LIN', 'SBUX', 'HD', 'AMGN', 'MDT', 'HON', 'MO', 'NVO', 'MMM', 'VRTX', 'REGN', 'TMO', 'LMT', 'PYPL', 'SBUX', 'NOW', 'ZM', 'MA', 'CME', 'UPS', 'TMUS', 'CHTR', 'SNOW', 'IBM', 'TXN', 'QCOM', 'COST', 'ABBV', 'CRM', 'ACN', 'T', 'NKE', 'NEE', 'DHR', 'ORCL', 'UNH', 'FIS', 'BMY', 'LLY', 'CVX', 'LIN', 'SBUX', 'HD', 'AMGN', 'MDT', 'HON', 'MO', 'NVO', 'MMM', 'VRTX', 'REGN', 'TMO', 'LMT', 'PYPL', 'SBUX', 'NOW'];
  
  // Subscribe to each symbol
  symbols.forEach(symbol => {
    socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
    console.info(`Subscribed to ${symbol}`);
  });

  console.info('2. Subscribed to symbols.');
}

// Connection opened -> Check market status and subscribe to symbols if market is open
socket.addEventListener('open', function (event) {
  console.info('Socket connection opened');
  checkMarketStatus();
});

// Listen for messages from the websocket stream...
socket.addEventListener('message', function (event) {
  console.clear();
  console.info('1. New websocket created.');
  console.info('2. Subscribed to symbols.');
  console.info('3. Websocket streaming.');

  // stream response...
  let response = JSON.parse(event.data);

  // Determine response type.
  switch(response.type) {
    // Just a Websocket server ping.
    case 'ping':
      // ping.
      console.warn('Occasional server', response.type + '.');
      break;
    case 'trade':
      // type = trade. Obtain nodes.
      const symbol = response.data[0].s;
      const tradePrice = parseFloat(response.data[0].p);
      const tradeInfo = '' + ' $' + tradePrice.toFixed(2);

      // Update trade information if timestamp is newer
      if (!tradeInfoMap.hasOwnProperty(symbol) || response.data[0].t > tradeInfoMap[symbol].timestamp) {
        const prevTradePrice = tradeInfoMap[symbol] ? tradeInfoMap[symbol].price : null;
        tradeInfoMap[symbol] = {
          timestamp: response.data[0].t,
          price: tradePrice,
          info: tradeInfo
        };
        updateTradeInfoDisplay(symbol, prevTradePrice);
      }
      break;
    default:
      // anything else we haven't caught yet.
      console.log(response);
  }
});

// Function to update the trade info display for all symbols
function updateTradeInfoDisplay(symbol, prevPrice) {
  const tradeInfoGrid = document.getElementById('tradeInfoGrid');

  // Find or create the trade info element for the symbol
  let tradeInfoElement = document.getElementById(`tradeInfo_${symbol}`);
  if (!tradeInfoElement) {
    tradeInfoElement = document.createElement('div');
    tradeInfoElement.classList.add('col');
    tradeInfoElement.classList.add('mb-5'); // Add margin between cards
    tradeInfoElement.id = `tradeInfo_${symbol}`;
    tradeInfoGrid.appendChild(tradeInfoElement);
  }

  // Create the card
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('h-100'); // Make the card fill the height

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Create combined symbol and market status element
  const combinedInfo = document.createElement('h5');
  combinedInfo.classList.add('cardFont');
  combinedInfo.innerText = `${symbol} `;

  const tradeContent = document.createElement('div');
  tradeContent.classList.add('trade-content');
  tradeContent.classList.add('mb-3');
  tradeContent.classList.add('p-3');
  tradeContent.classList.add('rounded');
  tradeContent.innerText = tradeInfoMap[symbol].info;

  // Append elements to card body
  cardBody.appendChild(combinedInfo);
  cardBody.appendChild(tradeContent);
  card.appendChild(cardBody);

  // Update trade info element
  tradeInfoElement.innerHTML = ''; // Clear existing content
  tradeInfoElement.appendChild(card);

  // Update the background color of the trade info card
  updateTradeColor(card, prevPrice, tradeInfoMap[symbol].price);
}
// Function to update the background color of the trade info card based on price movement
function updateTradeColor(card, prevPrice, currentPrice) {
  if (prevPrice !== null && currentPrice !== null) {
    if (currentPrice > prevPrice) {
      card.style.backgroundColor = 'green'; // Price is up
    } else if (currentPrice < prevPrice) {
      card.style.backgroundColor = 'red'; // Price is down
    }
  }
}