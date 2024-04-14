// ++++++++++++++++++++++++++++

// FOR XXS 

// +++++++++++++++++++++++++++


document.addEventListener('DOMContentLoaded', () => {
    const inputFields = document.querySelectorAll('input');
    let userIp = '';
    let deviceInfo = '';

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

    // Function to get device information
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        deviceInfo = `User-Agent: ${ua}, Platform: ${platform}`;
    }

    // Call the functions when the page loads
    fetchIpAddress();
    getDeviceInfo();

    const blockedChars = '<>;()@:?/@{}[]#';

    // Function to check for blocked characters
    function containsBlockedChars(inputValue) {
        return [...blockedChars].some(char => inputValue.includes(char));
    }

    // Function to sanitize input value
    function sanitizeInputValue(inputValue) {
        return inputValue.split('').filter(char => !blockedChars.includes(char)).join('');
    }

    inputFields.forEach(input => {
        input.addEventListener('input', (event) => {
            const sanitizedValue = sanitizeInputValue(event.target.value);
            if (sanitizedValue !== event.target.value) {
                event.target.value = sanitizedValue;
                alert(`Nice try with the cyber mischief! Here's the IP address and device info you left behind: ${userIp}  |  Device Info:  ${deviceInfo}`);
            }
        });

        // Handle paste events
        input.addEventListener('paste', (event) => {
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');
            if (containsBlockedChars(pastedText)) {
                event.preventDefault();
                input.value = sanitizeInputValue(pastedText);
                alert(`Pasting blocked characters is not allowed. Your attempt has been logged. IP: ${userIp}, Device Info: ${deviceInfo}`);
            }
        });
    });
});




// ==============================================

// FOR TABS 


// ++++++++++++++++++++++++++++++++++++++++++++++

// Stock tabs

function openTab(tabName) {
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
  }


//Crypto tabs

function openTab1(tabName) {
    var tabs = document.getElementsByClassName("tab1");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active1");
    }
    document.getElementById(tabName).classList.add("active1");
}

//Marvel Tabs

function openTabMarvel(tabName) {
    var tabs = document.getElementsByClassName("MarvelTab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("characterActive");
    }
    document.getElementById(tabName).classList.add("characterActive");
}