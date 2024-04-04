  // Get references to the currency input field and suggestions div
  const currencyInput = document.getElementById('currencyInput');
  const currencySuggestions = document.getElementById('currencySuggestions');
  
  // Event listener for input changes in the currency input field
  currencyInput.addEventListener('input', function() {
      // Trim and convert the input value to uppercase
      const inputValue = this.value.trim().toUpperCase();
      // Check if input value length is at least 2 characters
      if (inputValue.length >= 2) {
          // Fetch currency data from Coinbase API based on the input value
          fetch(`https://api.coinbase.com/v2/currencies`)
              .then(response => response.json())
              .then(data => {
                  // Filter currencies based on the input value (name or id)
                  const currencies = data.data.filter(currency => currency.name.toUpperCase().includes(inputValue) || currency.id.toUpperCase().includes(inputValue));
                  // Display filtered currency suggestions
                  displayCurrencySuggestions(currencies);
              })
              .catch(error => console.error('Error fetching currency data:', error));
      } else {
          // Clear currency suggestions if input value is less than 2 characters
          currencySuggestions.innerHTML = '';
      }
  });
  
  // Function to display currency suggestions in the suggestions div
  function displayCurrencySuggestions(currencies) {
      currencySuggestions.innerHTML = '';
      // Loop through each currency and create a div element for suggestions
      currencies.forEach(currency => {
          const div = document.createElement('div');
          // Set div content to display currency name and id
          div.textContent = `${currency.name} (${currency.id})`;
          // Add click event listener to select a currency code from suggestions
          div.addEventListener('click', () => selectCurrencyCode(currency.id));
          // Append the div to currency suggestions div
          currencySuggestions.appendChild(div);
      });
  }
  
  // Function to select a currency code from suggestions and update the input field
  function selectCurrencyCode(code) {
      currencyInput.value = code;
      currencySuggestions.innerHTML = ''; // Clear suggestions after selection
  }
  
  // Function to fetch and display exchange rate for the selected currency
  function getExchangeRate() {
      // Get the trimmed and uppercase currency code from the input field
      const currencyCode = currencyInput.value.trim().toUpperCase();
      // Check if currency code is provided
      if (!currencyCode) {
          alert('Please enter a currency.');
          return;
      }
  
      // Construct API URL with the selected currency code
      const apiUrl = `https://api.coinbase.com/v2/exchange-rates?currency=${currencyCode}`;
      // Fetch exchange rate data from Coinbase API
      fetch(apiUrl)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              // Extract the exchange rate for USD from the response data
              const exchangeRate = data.data.rates.USD;
              // Display the exchange rate information on the webpage
              document.getElementById('exchangeRateResult').innerHTML = `<p>1 ${currencyCode} = ${exchangeRate} USD</p>`;
          })
          .catch(error => {
              // Log and handle errors when fetching exchange rate data
              console.error('Error fetching exchange rate:', error);
              // Display error message on the webpage
              document.getElementById('exchangeRateResult').innerHTML = '<p>Error fetching exchange rate. Please try again later.</p>';
          });
  }