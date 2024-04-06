function getNASAData(apiKey) {
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Display today's image separately
        displayTodayImage(data);

        // Fetch last 7 days' images
        fetchLastSevenDays(apiKey);
      })
      .catch(error => {
        console.error('Error fetching NASA data:', error);
      });
  }

  function displayTodayImage(data) {
    const imageUrl = data.hdurl;
    const imageTitle = data.title;
    const imageExplanation = data.explanation;

    const card = createCard(imageUrl, imageTitle, imageExplanation, 'card-lg', true,false);

    const todayImageContainer = document.getElementById('todayImageContainer');
    todayImageContainer.appendChild(card);
  }

  function fetchLastSevenDays(apiKey) {
    const today = new Date();
    for (let i = 1; i <= 16; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatDate(date);

      const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${formattedDate}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const imageUrl = data.hdurl;
          const imageTitle = data.title;
          const imageExplanation = data.explanation;

          const card = createCard(imageUrl, imageTitle, imageExplanation, 'flex-sm-item', false,true);

          const lastSevenDaysContainer = document.getElementById('lastSevenDaysContainer');
          lastSevenDaysContainer.appendChild(card);
        })
        .catch(error => {
          console.error('Error fetching NASA data:', error);
        });
    }
  }

  function createCard(imageUrl, imageTitle, imageExplanation, cardClass, stretchScreen, setWidth) {
    const card = document.createElement('div');
    card.className = `card m-2 ${cardClass}`;

    // Check if setWidth is true before setting the width
    if (setWidth) {
        card.style.width = '18rem';
    }

    const imageElement = document.createElement('img');
    imageElement.className = 'card-img-top'; // Add the card-img-top class
    imageElement.src = imageUrl;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleElement = document.createElement('h5');
    titleElement.className = 'card-title';
    titleElement.textContent = imageTitle;

    cardBody.appendChild(titleElement);
    card.appendChild(imageElement);
    card.appendChild(cardBody);

    return card;
}

  function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
  }

  // Call the function with your API key
  const apiKey = 'mud9spxbq6i1MTj1Q52GKEzdL3wPgyeAeNo20dzB';
  getNASAData(apiKey);




   // ==================================================================

  // For Mars rover photos 

  // ==================================================================


  document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('marsSearchBtn');
    const loadingSpinner = document.getElementById('marsLoadingSpinner');
    const photoContainer = document.getElementById('marsPhotoContainer');

    searchBtn.addEventListener('click', function () {
        const solDay = document.getElementById('marsSolInput').value.trim();

        if (solDay === '' || isNaN(solDay)) {
            alert('Please enter a valid sol day (numeric value).');
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'block';

        photoContainer.innerHTML = ''; // Clear previous content
        photoContainer.style.display = 'none'; // Hide photo container

        const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDay}&api_key=mud9spxbq6i1MTj1Q52GKEzdL3wPgyeAeNo20dzB`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const photos = data.photos;
                const photoCounts = {}; // Object to store photo counts per camera

                if (photos.length > 0) {
                    photos.forEach(photo => {
                        const cameraName = photo.camera.full_name;
                        if (!photoCounts[cameraName]) {
                            photoCounts[cameraName] = 1;
                        } else if (photoCounts[cameraName] >= 20) {
                            return; // Skip adding more than 10 photos per camera
                        } else {
                            photoCounts[cameraName]++;
                        }

                        const imgContainer = document.createElement('div');
                        imgContainer.classList.add('col-lg-5');

                        const imgElement = document.createElement('img');
                        imgElement.src = photo.img_src;
                        imgElement.alt = 'Mars Photo';
                        imgElement.classList.add('mars-img-fluid');

                        const cameraNameElement = document.createElement('p');
                        cameraNameElement.textContent = `Camera: ${cameraName}`;

                        const earthDateElement = document.createElement('p');
                        earthDateElement.textContent = `Earth Date: ${photo.earth_date}`;

                        imgContainer.appendChild(imgElement);
                        imgContainer.appendChild(cameraNameElement);
                        imgContainer.appendChild(earthDateElement);

                        photoContainer.appendChild(imgContainer);
                    });
                } else {
                    alert('No photos found for this sol day.');
                }

                // Hide loading spinner and show photo container after 2 seconds (fake loading time)
                setTimeout(() => {
                    loadingSpinner.style.display = 'none';
                    photoContainer.style.display = 'flex'; // Show photo container
                }, 2000);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data from API.');

                // Hide loading spinner on error
                loadingSpinner.style.display = 'none';
            });
    });
});