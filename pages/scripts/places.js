
    // Initialize variables for map and markers
    var map;
    var markers = [];
    var API_KEY = config.API_KEY;

    // var originInput = document.getElementById('origin');
    // var destinationInput = document.getElementById('destination');
    // new google.maps.places.Autocomplete(originInput);
    // new google.maps.places.Autocomplete(destinationInput);

    // Event handler for search button click
    $('#searchBtn').click(function () {
        var userInput = $('#searchInput').val(); // Get user input from the search input field

        // Make an AJAX request to Google Geocoding API to get location details
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            method: 'GET',
            data: {
                address: userInput,
                key: API_KEY
            },
            success: function (response) {
                if (response.results && response.results.length > 0) {
                    var location = response.results[0].geometry.location; // Get location coordinates

                    // Display location details on the page
                    displayLocation(location);

                    // Search for nearby places using Google Places API for various categories
                    searchNearby(location, 'bar', '#bar', 'Top Bars:');
                    searchNearby(location, 'golf course', '#golfResults', 'Top Golf Courses:');
                    searchNearby(location, 'kids activities', '#Kid', 'Top Kids :');
                    searchNearby(location, 'free activities', '#freeNearby', 'Top Activities:');
                } else {
                    $('#address').html('<p>No address found for the input.</p>');
                }
            },
            error: function () {
                $('#address').html('<p>Error fetching data from Google Maps API.</p>');
            }
        });
    });


    // Function to display location details on the page
    function displayLocation(location) {
        $('#address').html('<p>Address: ' + location.lat + ', ' + location.lng + '</p>');

        // Initialize Google Map centered at the location
        map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 15
        });

        // Clear existing markers and add a new marker at the location
        clearMarkers();
        addMarker(location);
    }

    // Function to add a marker at a specified location on the map
    function addMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push(marker); // Add the marker to the markers array
    }

    // Function to add a marker at a specified location on the map with details and photo
    function addMarkerWithDetails(place) {
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP // Animate the marker drop
        });

        // Create an info window to display details and photo
        var infoWindow = new google.maps.InfoWindow({
            content: '<div><h4>' + place.name + '</h4>' +
                (place.rating ? '<p>Rating: ' + place.rating + '</p>' : '') +
                (place.vicinity ? '<p>Address: ' + place.vicinity + '</p>' : '') +
                (place.photos && place.photos.length > 0 ? '<img src="' + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '" alt="Photo">' : '') +
                '</div>'
        });

        // Add a click event listener to the marker to open the info window
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

        // Add the marker to the markers array
        markers.push(marker);
    }

    // Modify the existing addMarker function to use addMarkerWithDetails
    function addMarker(location) {
        // Placeholder code for existing marker creation
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push(marker); // Add the marker to the markers array
    }

    // Function to search for nearby places based on location, keyword, and target element
    function searchNearby(location, keyword, targetElement, title) {
        var placesService = new google.maps.places.PlacesService(map);

        // Perform a nearby search using Google Places API
        placesService.nearbySearch({
            location: location,
            radius: 5000, // Search radius in meters
            keyword: keyword // Specify the keyword for the type of place to search for
        }, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                $(targetElement).append('<h3>' + title + '</h3>'); // Add a heading for the category
                results.slice(0, 5).forEach(function (place) {
                    // Iterate through the results and display place details like name, rating, address, and photos
                    var photosHtml = place.photos ? '<img src="' + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '" alt="Photo">' : '<p>No photo available</p>';
                    var address = place.vicinity ? '<p>Address: ' + place.vicinity + '</p>' : '';
                    var rating = place.rating ? '<p>Rating: ' + place.rating + '</p>' : '';

                    // Add a marker with details for each place result
                    addMarkerWithDetails(place);

                    // Append place details to the target element
                    $(targetElement).append('<div><p>' + place.name + ' - Rating: ' + place.rating + '</p>' + address + photosHtml + '</div>');
                });
            } else {
                $(targetElement).append('<p>No ' + keyword + ' found nearby.</p>');
            }
        });
    }

    // Function to clear all markers from the map
    function clearMarkers() {
        markers.forEach(function (marker) {
            marker.setMap(null); // Remove each marker from the map
        });
        markers = []; // Clear the markers array
    }

    // Function to search for nearby places based on location, keyword, and target element
    function searchNearby(location, keyword, targetElement, title) {
        var placesService = new google.maps.places.PlacesService(map);

        // Perform a nearby search using Google Places API
        placesService.nearbySearch({
            location: location,
            radius: 5000, // Search radius in meters
            keyword: keyword // Specify the keyword for the type of place to search for
        }, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                $(targetElement).append('<h3>' + title + '</h3>'); // Add a heading for the category
                results.slice(0, 5).forEach(function (place) {
                    // Iterate through the results and display place details like name, rating, address, and photos
                    var photosHtml = place.photos ? '<img src="' + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '" alt="Photo">' : '<p>No photo available</p>';
                    var address = place.vicinity ? '<p>Address: ' + place.vicinity + '</p>' : '';
                    var rating = place.rating ? '<p>Rating: ' + place.rating + '</p>' : '';
                    $(targetElement).append('<div><p>' + place.name + ' - Rating: ' + place.rating + '</p>' + address + photosHtml + '</div>');
                });
            } else {
                $(targetElement).append('<p>No ' + keyword + ' found nearby.</p>');
            }
        });
    }
