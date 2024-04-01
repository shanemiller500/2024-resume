document.addEventListener('DOMContentLoaded', function() {
    // Add click event listener to the close button
    document.querySelector('.close').addEventListener('click', function() {
        // Close the current window
        alert('You should have chosen the blue pill... The window will close now.');
        window.close();
    });
});