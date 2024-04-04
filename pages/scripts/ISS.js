// Initialize Leaflet map with a default view
const mapISS = L.map('mapISS').setView([0, 0], 2);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(mapISS);

// Define a custom satellite icon using Leaflet's L.icon method
const satelliteIcon = L.icon({
    iconUrl: 'images/satellite-solid.svg', // URL of the satellite icon image
    iconSize: [20, 20], // Size of the icon (width, height) in pixels
    iconAnchor: [10, 10], // Anchor point of the icon (positioning point) relative to its top left corner
});

// Function to fetch and update the ISS location on the map
function getISSLocation() {
    fetch('https://api.wheretheiss.at/v1/satellites/25544') // Fetch ISS location data
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            const { latitude, longitude } = data; // Extract latitude and longitude from the data
            // Add a marker with the custom satellite icon at the ISS location on the map
            L.marker([latitude, longitude], { icon: satelliteIcon }).addTo(mapISS)
                .bindPopup('Current ISS Location') // Add a popup with location information
                .openPopup(); // Open the popup
            mapISS.setView([latitude, longitude], 2); // Set the map view to the ISS location
        })
        .catch(error => console.error('Error fetching ISS location:', error)); // Log any errors
}

// // Function to fetch and display information about astronauts on the ISS
// function getAstronauts() {
//     fetch('http://api.open-notify.org/astros.json') // Fetch astronaut data
//         .then(response => response.json()) // Parse response as JSON
//         .then(data => {
//             const astronautsContainer = document.getElementById('astronautsContainer'); // Get the astronauts container element
//             astronautsContainer.innerHTML = ''; // Clear previous data from the container

//             // Loop through each astronaut and create a card with their name and craft
//             data.people.forEach(person => {
//                 const astronautCard = document.createElement('div'); // Create a new div element
//                 astronautCard.classList.add('astronaut-card'); // Add a CSS class to the div
//                 astronautCard.innerHTML = `
//                     <h3>${person.name}</h3>
//                     <p>Craft: ${person.craft}</p>
//                 `; // Set the HTML content of the div
//                 astronautsContainer.appendChild(astronautCard); // Append the div to the astronauts container
//             });
//         })
//         .catch(error => console.error('Error fetching astronauts:', error)); // Log any errors
// }

// Initial call to fetch and display the ISS location and astronauts
getISSLocation();
// getAstronauts();

// Set intervals to update the ISS location every 10 seconds and astronauts every 30 seconds
setInterval(getISSLocation, 10000);
// setInterval(getAstronauts, 30000);