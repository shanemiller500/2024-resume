function refreshJoke() {
    document.getElementById('jokeContainer').style.display = 'none';
    // Show spinner
    document.getElementById('roundhouseSpinner').style.display = 'block';

    // Fetch a random quote after 2 seconds
    setTimeout(() => {
        getJoke();
    }, 2000);
}


function getJoke() {
    // Make a fetch call to the Chuck Norris Jokes API
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(data => {
            // Create HTML elements to display all the joke info
            const jokeContainer = document.getElementById('jokeContainer');
            jokeContainer.innerHTML = `<p><b>Quote:</b><em> "${data.value}"</em> </p>`;
                    }).catch(error => console.error('Error fetching joke:', error));

            document.getElementById('roundhouseSpinner').style.display = 'none'; 
            document.getElementById('jokeContainer').style.display = 'block';
}


// Initial call to get a joke when the page loads
getJoke();

// Add event listener to the button to get a new joke
document.getElementById('getJokeButton').addEventListener('click', refreshJoke);