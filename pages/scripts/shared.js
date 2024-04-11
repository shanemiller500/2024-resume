
// ++++++++++++++++++++++++++++



// FOR XXS 


// +++++++++++++++++++++++++++


document.addEventListener('DOMContentLoaded', () => {
    const inputFields = document.querySelectorAll('input');
    let userIp = ''; // Variable to store the user's IP address

    // Function to fetch the user's IP address
    async function fetchIpAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            userIp = data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            userIp = 'unknown'; // Fallback value in case of an error
        }
    }

    // Call the function to fetch the IP address when the page loads
    fetchIpAddress();

    inputFields.forEach(input => {
        input.addEventListener('keypress', (event) => {
            const blockedChars = '<>;()@:?/@{}[]#';

            if (blockedChars.includes(event.key)) {
                event.preventDefault();
                alert(`Nice try with the cyber mischief, but my XXS skills are like a digital fortress! Better luck next time. Oh, and here's the IP address you left behind: ${userIp}`);
            }
        });
    });
});




// ==============================================

// FOR TABS 


// ++++++++++++++++++++++++++++++++++++++++++++++


function openTab(tabName) {
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
  }

document.addEventListener('DOMContentLoaded', function () {
    fetchIPOCalendar();
    document.getElementById('searchInput').addEventListener('input', function () {
        filterIPOCalendar(this.value.trim().toLowerCase());
    });
});

function openTab1(tabName) {
    var tabs = document.getElementsByClassName("tab1");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active1");
    }
    document.getElementById(tabName).classList.add("active1");
}