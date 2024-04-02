
    // Initialize Google Places Autocomplete for origin and destination inputs
    // var originInput = document.getElementById('origin');
    // var destinationInput = document.getElementById('destination');
    // new google.maps.places.Autocomplete(originInput);
    // new google.maps.places.Autocomplete(destinationInput);

    $('#flightSearchForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        var origin = $('#origin').val();
        var destination = $('#destination').val();
        var departDate = $('#departDate').val();
        var returnDate = $('#returnDate').val();
        var adults = $('#adults').val();

        // Construct the Google Flights URL with the form data
        var googleFlightsUrl = 'https://www.google.com/flights?'
            + 'q=' + origin + '+to+' + destination
            + '&d=' + departDate
            + '&r=' + returnDate
            + '&a=' + adults;

        // Open the Google Flights URL in a new tab
        window.open(googleFlightsUrl, '_blank');
    });

    // Function to search for nearby places based on location, keyword, and target element
    function searchNearby(location, keyword, targetElement, title, adults) {
        var placesService = new google.maps.places.PlacesService(map);

        // Perform a nearby search using Google Places API
        placesService.nearbySearch({
            location: location,
            radius: 5000, // Search radius in meters
            keyword: keyword // Specify the keyword for the type of place to search for
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                $(targetElement).append('<h3>' + title + '</h3>'); // Add a heading for the category
                results.slice(0, 10).forEach(function(place) {
                    // Iterate through the results and display place details like name, rating, address, and photos
                    var photosHtml = place.photos ? '<img src="' + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '" alt="Photo">' : '<p>No photo available</p>';
                    var address = place.vicinity ? '<p>Address: ' + place.vicinity + '</p>' : '';
                    var rating = place.rating ? '<p>Rating: ' + place.rating + '</p>' : '';
                    $(targetElement).append('<div><p>' + place.name + ' - Rating: ' + place.rating + '</p>' 
                        + address + photosHtml + '</div>');
                });
            } else {
                $(targetElement).append('<p>No ' + keyword + ' found nearby.</p>');
            }
        });
    }


    // for XXS prevention 
    function processInputs() {
        const inputFields = document.querySelectorAll('input[type="text"]');
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = ''; // Clear previous output

        inputFields.forEach(input => {
            const sanitizedValue = sanitizeInput(input.value);
            const outputText = document.createElement('p');
            outputText.innerText = `Sanitized value: ${sanitizedValue}`;
            outputDiv.appendChild(outputText);
        });
    }

    function sanitizeInput(input) {
        // Replace HTML special characters with blank spaces
        return input.replace(/</g, ' ').replace(/>/g, ' ');
    }
    
