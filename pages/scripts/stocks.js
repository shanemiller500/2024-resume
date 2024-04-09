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

            $('#stockSearchBtn').on('click', function () {
                var selectedSymbol = $('#stockInput').val();

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
                                var description = profileData.name;
                                var stockSymbol = profileData.ticker;
                                var logo = profileData.logo;
                                var priceColor = quoteData.c > quoteData.o ? 'green' : 'red';
                                var iconClass = parseFloat(quoteData.c > quoteData.o ? 1 : -1) >= 0 ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down';
                                var fiftyTwoWeekHigh = metricData.metric['52WeekHigh'];
                                var fiftyTwoWeekHighDate = metricData.metric['52WeekHighDate'];
                                var fiftyTwoWeekLow = metricData.metric['52WeekLow'];
                                var fiftyTwoWeekLowDate = metricData.metric['52WeekLowDate'];
                                var marketCapitalization = metricData.metric['marketCapitalization'];
                                var epsTTM = metricData.metric['epsTTM'];

                                var stockInfo = `
                                <div class="row">
                                <div class="col-xs-6">
                                <h2 style="color: ${priceColor}">${description} - (${stockSymbol}) </h2>
                                <h2 style="color: ${priceColor}">$${quoteData.l} <i class="${iconClass}"></i> &nbsp;&nbsp;&nbsp;&nbsp; <img src="${logo}" alt="Stock Logo" style="max-width: 90px; max-height: 200px;"></h2>
                                  
                                </div>
                                
                              </div>
                             
                              
                                    <table class="table table-striped">
                                        <tr>
                                            <td style="color: ${priceColor}">Current Price: </td>
                                            <td style="color: ${priceColor}">$${quoteData.c} <i class="${iconClass}"></i></span></td>
                                            <td>Open Price</td>
                                            <td>$${quoteData.o}</td>
                                        </tr>
                                        <tr>
                                            <td>High Price</td>
                                            <td>$${quoteData.h}</td>
                                            <td>Low Price</td>
                                            <td>$${quoteData.l}</td>
                                        </tr>
                                        <tr>
                                            <td>52 Week High</td>
                                            <td>$${fiftyTwoWeekHigh}</td>
                                            <td>Date</td>
                                            <td>${fiftyTwoWeekHighDate}</td>
                                        </tr>
                                        <tr>
                                            <td>52 Week Low</td>
                                            <td>$${fiftyTwoWeekLow}</td>
                                            <td>Date</td>
                                            <td>${fiftyTwoWeekLowDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Market Capitalization</td>
                                            <td>$${marketCapitalization}</td>
                                            <td> EPS TTM:</td>
                                            <td>$${epsTTM}</td>
                                        </tr>
                                    </table>
                                `;
                                $('#stockData').html(stockInfo);

                                // Fetch news for the selected symbol
                                $.get('https://finnhub.io/api/v1/company-news', {
                                    symbol: selectedSymbol,
                                    from: new Date().toISOString().slice(0, 10),
                                    to: new Date().toISOString().slice(0, 10),
                                    token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
                                }, function (newsData) {
                                    var newsHtml = '';
                                    if (newsData && newsData.length > 0) {
                                        var startIndex = (currentPage - 1) * pageSize;
                                        var endIndex = startIndex + pageSize;
                                        var paginatedData = newsData.slice(startIndex, endIndex);

                                        paginatedData.forEach(function (newsItem) {
                                            newsHtml += `
                                                <h3>Latest News</h3>
                                                    <div class="card mb-3">
                                                        <div class="card-body">
                                                            <h5 class="card-title">${newsItem.headline}</h5>
                                                            <p class="card-text" id="newsSummaryColor">${newsItem.summary}</p>
                                                            <br>
                                                            <button class="white" href="${newsItem.url}" target="_blank">Read More</button>
                                                        </div>
                                                    </div>`;
                                        });

                                        var totalPages = Math.ceil(newsData.length / pageSize);
                                        var paginationHtml = '';
                                        for (var i = 1; i <= totalPages; i++) {
                                            paginationHtml += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                                                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                                            </li>`;
                                        }

                                        $('#stockPagination').html(paginationHtml);
                                    } else {
                                        newsHtml = '<p>No news found for today.</p>';
                                        $('#stockPagination').html('');
                                    }

                                    $('#stockNewsResults').html(newsHtml);
                                    $('#randomSpinner').hide(); // Hide spinner after data is loaded
                                });
                            });
                        });
                    });
                }
            });

            function changePage(page) {
                currentPage = page;
                $('#stockSearchBtn').trigger('click');
            }
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
              row.innerHTML = `
                  <td>${item.symbol}</td>
                  <td>${item.date}</td>
                  <td>${item.epsEstimate}</td>
                  <td>${item.revenueActual}</td>
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
    // Initialize typeahead on the stockInput field
    $('#searchNewsTabStockInput').typeahead({
      source: function(query, process) {
        $.get('https://finnhub.io/api/v1/news', {
          category: 'general',
          token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
        }, function(data) {
          var symbols = data.map(function(item) {
            return item.related;
          });
          return process(symbols);
        });
      }
    });

    $('#searchNewsTabBtn').on('click', function() {
      var selectedSymbol = $('#searchNewsTabStockInput').val();
      $.get('https://finnhub.io/api/v1/company-news', {
        symbol: selectedSymbol,
        from: new Date().toISOString().slice(0, 10),
        to: new Date().toISOString().slice(0, 10),
        token: 'co9msqpr01qgj7bna0ngco9msqpr01qgj7bna0o0'
      }, function(data) {
        displayNews(data);
      });
    });

    function displayNews(newsData) {
      var newsResults = $('#searchNewsTabNewsResults');
      newsResults.empty();
      if (newsData && newsData.length > 0) {
        newsData.forEach(function(news) {
          var newsItem = $('<div class="col-md-6 mb-6"></div>');
          var newsCard = $('<div class="card"></div>');
          var cardBody = $('<div class="card-body"></div>');

          var category = $('<h5 class="card-title">' + news.category + '</h5>');
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

    // Function to format Unix timestamp to a date string
    function formatDate(timestamp) {
      var date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
      var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  });