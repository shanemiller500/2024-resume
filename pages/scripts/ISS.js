window.onload = function(){
// Initialize Leaflet map
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

// Function to fetch and update the ISS location, altitude, velocity, and visibility on the map
function getISSLocation() {
    fetch('https://api.wheretheiss.at/v1/satellites/25544') // Fetch ISS data
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            const { latitude, longitude, altitude, velocity, visibility } = data; // Extract data from the API response
            // Update the ISS data in the HTML
            document.getElementById('latitude').textContent = `Latitude: ${latitude}`;
            document.getElementById('longitude').textContent = `Longitude: ${longitude}`;
            document.getElementById('altitude').textContent = `Altitude: ${altitude.toFixed(2)} km above the earth's surface`;
            document.getElementById('velocity').textContent = `Velocity: ${velocity.toFixed(2)} km/h`;
            document.getElementById('visibility').textContent = `Visibility: ${visibility}`;
            // Add a marker with the custom satellite icon at the ISS location on the map
            const marker = L.marker([latitude, longitude], { icon: satelliteIcon }).addTo(mapISS);
            // Set the popup content with ISS location, altitude, velocity, and visibility information in km
            marker.bindPopup(`<p>ISS Location</p>`).openPopup();
            mapISS.setView([latitude, longitude], 2); // Set the map view to the ISS location
            mapISS.invalidateSize(); // Force Leaflet to re-layout the map
        })
        .catch(error => console.error('Error fetching ISS data:', error)); // Log any errors
}

setTimeout(getISSLocation, 50);
// Set an interval to update the ISS location and data every 5 seconds after the initial fetch
setInterval(getISSLocation, 10000);


};

