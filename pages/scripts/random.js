function getActivity() {
    // Make a fetch call to the API
    fetch('https://www.boredapi.com/api/activity')
        .then(response => response.json())
        .then(data => {
            // Update HTML elements with data from API
            document.getElementById('activity').innerText = `Activity: ${data.activity}`;
            document.getElementById('type').innerText = `Type: ${data.type}`;
            document.getElementById('participants').innerText = `Minium Participants: ${data.participants}`;
            document.getElementById('link').innerHTML = `Link: <a href="${data.link}" target="_blank">${data.link}</a>`;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Initial call to get activity when page loads
getActivity();

// Add event listener to the button
document.getElementById('getActivityButton').addEventListener('click', getActivity);