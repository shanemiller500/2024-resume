// Function to fetch random advice from the API
function refreshAdvice () {
    document.getElementById('adviceContainer').style.display = 'none';
    document.getElementById('adviceText').style.display = 'none';

    document.getElementById('AdviceSpinner').style.display ='block';

    setTimeout(() => {
        fetchAdvice();
    }, 2000);
}

function fetchAdvice() {

    fetch('https://api.adviceslip.com/advice') // Fetch advice from API
        .then(response => {
            if (!response.ok) { // Check if response is not ok (e.g., 404 error)
                throw new Error('Network response was not ok'); // Throw an error
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => {
            const adviceContainer = document.getElementById('adviceContainer'); // Get advice container element
            adviceContainer.innerHTML = ''; // Clear previous advice

            const adviceElement = document.createElement('p'); // Create paragraph element
            adviceElement.classList.add('advice-text'); // Add class for styling
            adviceElement.innerHTML = `<q>${data.slip.advice}</q>`; // Set advice text
            adviceContainer.appendChild(adviceElement); // Append advice to container

            // Hide spinner and show advice
            document.getElementById('AdviceSpinner').style.display ='none';
            document.getElementById('adviceContainer').style.display = 'block';
            document.getElementById('adviceText').style.display = 'block';
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error); // Log error if fetch fails
        });
}

// Call the fetchAdvice function to fetch and display advice
fetchAdvice();

document.getElementById('getAdviceButton').addEventListener('click', refreshAdvice);