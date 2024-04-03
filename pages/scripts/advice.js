function fetchAdvice() {
    fetch('https://api.adviceslip.com/advice')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const adviceContainer = document.getElementById('adviceContainer');
        adviceContainer.innerHTML = ''; // Clear previous advice

        const adviceElement = document.createElement('p');
        adviceElement.classList.add('advice-text'); // Add class for styling
        adviceElement.innerHTML = `<q>${data.slip.advice}</q>`;
        adviceContainer.appendChild(adviceElement);
      })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      });
  }