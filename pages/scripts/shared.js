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



// +++++++++++++++++++++++

// XXS for dev tools 

// +++++++++++++++++++++++


let rightClickCount = 0;  
let f12Count = 0;        

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();  // Prevent the default context menu
    rightClickCount++;       // Increment the right-click counter
    if (rightClickCount === 5) {  
        alert('Enhanced security measures are implemented here for non-intrusive monitoring. To see how this was done, visit my GitHub link at shanemiller.ninja!');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === 'I') || (event.metaKey && event.altKey && event.key === 'I')) {
        event.preventDefault();  // Prevent the default action for F12 or Cmd+Option+I
        f12Count++;             // Increment the F12 key press counter
        if (f12Count === 1000) {  
            alert('Enhanced security measures are implemented here for non-intrusive monitoring. To see how this was done, visit my GitHub link at shanemiller.ninja!');
        }

    }
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

// MIX API tabs

function openRandomTab(tabName) {
    var tabs = document.getElementsByClassName("randomTab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("activeRandom");
    }
    document.getElementById(tabName).classList.add("activeRandom");
}


//NASA tabs

function openTabNasa(tabName) {
    var tabs = document.getElementsByClassName("nasaTab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("nasaActive");
    }
    document.getElementById(tabName).classList.add("nasaActive");
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++

//Alert for smaller screens

// +++++++++++++++++++++++++++++++++++++++++++++++++++++


function showAlertOnSmallScreen() {
    var screenWidth = window.innerWidth;
    var alertElement = document.getElementById('alertSmallscreen');
  
    if (screenWidth < 980) { 
      alertElement.style.display = 'block';
    } else {
      alertElement.style.display = 'none';
    }
  }
  
  // Run the function on initial load
  showAlertOnSmallScreen();
  
  // Add a listener to re-check when the window is resized
  window.addEventListener('resize', showAlertOnSmallScreen);



  document.getElementById('umail-link').addEventListener('click', function(event) {
    event.preventDefault(); 

    if (confirm("You are leaving my portfolio to view U-Mail, an application I'm working on that's almost complete and will be released to the public soon." )) {
        // If the user confirms, proceed to open the link in a new tab
        window.open(this.href, '_blank');
    }
});