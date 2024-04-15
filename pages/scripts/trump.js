function refreshQuote() {
    // Hide quote container and tweet frame
    document.getElementById('quote-text').style.display = 'none';
    document.getElementById('quote-container').style.display = 'none';
    document.getElementById('tweet-frame').style.display = 'none';
    // Show spinner
    document.getElementById('spinner').style.display = 'block';
  
    // Fetch a random quote after 2 seconds
    setTimeout(() => {
      fetchRandomQuote();
    }, 2000);
  }
  
  async function fetchRandomQuote() {
    try {
      const response = await fetch('https://api.tronalddump.io/random/quote');
      const data = await response.json();
      displayQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  }
  
  function displayQuote(quoteData) {
    const quoteContainer = document.getElementById('quote-container');
    const tweetFrame = document.getElementById('tweet-frame');
    const { value, _embedded } = quoteData;
    const createdAtString = _embedded.source[0].created_at;
    const datePart = createdAtString.split("T")[0];
  
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `
      <p><b><em>"${value}"</em><b></p>
      <br>
      <p>Wordsmith: The ${_embedded.author[0].name} </p>
      <p>Created: <em> ${datePart} </em></p>
      <p>Source: <a href="${_embedded.source[0].url}" target="_blank"> X</a></p>
    `;
    quoteContainer.innerHTML = ''; // Clear previous quote
    quoteContainer.appendChild(quoteElement);
  
    // Set the iframe source to the tweet link
    tweetFrame.src = `https://twitframe.com/show?url=${_embedded.source[0].url}`;
  
    // Hide spinner
    document.getElementById('spinner').style.display = 'none';
  
    // Show quote container and tweet frame
    document.getElementById('quote-text').style.display = 'block';
    document.getElementById('quote-container').style.display = 'block';
    document.getElementById('tweet-frame').style.display = 'block';
  }
  
  // Fetch a random quote when the page loads
  fetchRandomQuote();