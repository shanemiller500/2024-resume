$(window).on('load', function() {
    const apiUrl = 'https://api.artic.edu/api/v1/artworks';

    $.getJSON(apiUrl, function(data) {
        const artworks = data.data;
        const categorizedArtworks = {};

        artworks.forEach(artwork => {
            const placeOfOrigin = artwork.place_of_origin;

            if (!categorizedArtworks.hasOwnProperty(placeOfOrigin)) {
                categorizedArtworks[placeOfOrigin] = [];
            }

            categorizedArtworks[placeOfOrigin].push(artwork);
        });

        displayArtworksAndDetails(categorizedArtworks);
    });

    function displayArtworksAndDetails(categorizedArtworks) {
        const artworksCarouselIndicators = $('#artworksCarousel .carousel-indicators');
        const artworksCarouselInner = $('#artworksCarousel .carousel-inner');
        // const detailsCarouselIndicators = $('#detailsCarousel .carousel-indicators');
        // const detailsCarouselInner = $('#detailsCarousel .carousel-inner');

        let artworksSlideIndex = 0;
        // let detailsSlideIndex = 0;

        for (const place in categorizedArtworks) {
            const artworksInPlace = categorizedArtworks[place];

            artworksInPlace.forEach((artwork, index) => {
                const isActiveArtworks = artworksSlideIndex === 0 && index === 0 ? 'active' : '';
                artworksCarouselIndicators.append(`<button type="button" data-bs-target="#artworksCarousel" data-bs-slide-to="${artworksSlideIndex}" class="${isActiveArtworks}" aria-current="true" aria-label="Slide ${artworksSlideIndex + 1}"></button>`);
                artworksCarouselInner.append(`
                    <div class="carousel-item ${isActiveArtworks}">
                        <img src="https://www.artic.edu/iiif/2/${artwork.image_id}/full/800,/0/default.jpg" class="d-block w-100" alt="Artwork Image">
                        <div class="carousel-caption d-none d-md-block">
                            <h5 class="displayArt">${artwork.title}</h5>
                            <p class="displayArt">${artwork.artist_display}</p>
                            <p class="displayArt">Place of Origin: ${artwork.place_of_origin}</p>
                        </div>
                    </div>
                `);

                // const isActiveDetails = detailsSlideIndex === 0 && index === 0 ? 'active' : '';
                // detailsCarouselIndicators.append(`<button type="button" data-bs-target="#detailsCarousel" data-bs-slide-to="${detailsSlideIndex}" class="${isActiveDetails}" aria-current="true" aria-label="Slide ${detailsSlideIndex + 1}"></button>`);
                // detailsCarouselInner.append(`
                //     <div class="carousel-item ${isActiveDetails}">
                //         <div class="card">
                //             <div class="card-body">
                //                 <h5 class="card-title">${artwork.title}</h5>
                //                 <p class="card-text">${artwork.artist_display}</p>
                //                 <p class="card-text"><strong>Date:</strong> ${artwork.date_display}</p>
                //                 <p class="card-text"><strong>Medium:</strong> ${artwork.medium_display}</p>
                //                 <p class="card-text"><strong>Place of Origin:</strong> ${artwork.place_of_origin}</p>
                //             </div>
                //         </div>
                //     </div>
                // `);

                artworksSlideIndex++;
                // detailsSlideIndex++;
            });
        }

        // Initialize the Bootstrap Carousel for artworks
        const artworksCarousel = new bootstrap.Carousel(document.getElementById('artworksCarousel'));
        // const detailsCarousel = new bootstrap.Carousel(document.getElementById('detailsCarousel'));
    }
});