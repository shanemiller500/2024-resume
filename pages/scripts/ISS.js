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
              mapISS.invalidateSize(); // Force Leaflet to re-layout the map
          })
          .catch(error => console.error('Error fetching ISS location:', error)); // Log any errors
  }

  // Initial call to fetch and display the ISS location
  setTimeout(getISSLocation, 50);
        
        // Set an interval to update the ISS location every 10 seconds after the initial fetch
setInterval(getISSLocation, 10000);