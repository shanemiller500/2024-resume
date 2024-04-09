let clickCount = 0;

function refreshQuote() {
    clickCount++; // Increment click count on each button click
    if (clickCount === 3) {
        alert("You must have a black belt in clicking by now..."); // Alert on 3 clicks
    } else if (clickCount === 4) {
        alert('At this rate, you might break the internet with your clicking prowess!'); // Alert on 4 clicks
    } else if (clickCount === 5) {
        alert('Seriously, maybe take a break? Do you have click habit abuse syndrome?'); // Alert on 5 clicks
    } else if (clickCount === 6) {
        alert("Go ride a bike, climb a mountain, you are so bored you keep clicking, I'm going to do us all a favor & shut down your computer for you!");
        
            window.open('', '_self', '');
            window.close();
        
    }



    document.getElementById('activity').style.display = 'none';
    document.getElementById('type').style.display = 'none';
    document.getElementById('participants').style.display = 'none';
    document.getElementById('link').style.display = 'none';
    document.getElementById('smlTxt').style.display = 'none';
    // Show spinner
    document.getElementById('randomSpinner').style.display = 'block';
    document.getElementById('warned').style.display = 'block';

    // Fetch a random quote after 2 seconds
    setTimeout(() => {
        getActivity();
    }, 2000);
}

function getActivity() {
    // Make a fetch call to the API
    fetch('https://www.boredapi.com/api/activity')
        .then(response => response.json())
        .then(data => {
            // Update HTML elements with data from API
            document.getElementById('activity').innerText = `Activity: ${data.activity}`;
            document.getElementById('type').innerText = `Type: ${data.type}`;
            document.getElementById('participants').innerText = `Minimum Participants: ${data.participants}`;

            // Check if link data is not null and not an empty string
            if (data.link !== null && data.link.trim() !== '') {
                document.getElementById('link').innerHTML = `Link: <a href="${data.link}" target="_blank">${data.link}</a>`;
                document.getElementById('link').style.display = 'block'; // Show the link element
            } else {
                document.getElementById('link').style.display = 'none'; // Hide the link element if there's no link data
            }

            // Hide spinner after data is fetched
            document.getElementById('randomSpinner').style.display = 'none';
            document.getElementById('warned').style.display = 'none';
            // Show fetched data elements
            document.getElementById('activity').style.display = 'block';
            document.getElementById('type').style.display = 'block';
            document.getElementById('participants').style.display = 'block';
            document.getElementById('smlTxt').style.display = 'block';
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Initial call to get activity when page loads
getActivity();

// Add event listener to the button
document.getElementById('getActivityButton').addEventListener('click', refreshQuote);