function getJoke() {
    // Make a fetch call to the Chuck Norris Jokes API
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(data => {
            // Create HTML elements to display all the joke info
            const jokeContainer = document.getElementById('jokeContainer');
            jokeContainer.innerHTML = `
              
                <p><b>Quote:</b><em> " ${data.value} "</em> </p>
            `;
        })
        .catch(error => console.error('Error fetching joke:', error));
}

// Initial call to get a joke when the page loads
getJoke();

// Add event listener to the button to get a new joke
document.getElementById('getJokeButton').addEventListener('click', getJoke);