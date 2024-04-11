
// ++++++++++++++++++++++++++++



// FOR XXS 


// +++++++++++++++++++++++++++



document.addEventListener('DOMContentLoaded', () => {
    const inputFields = document.querySelectorAll('input');

    inputFields.forEach(input => {
        input.addEventListener('keypress', (event) => {
            // List of characters to block
            const blockedChars = '<>;()@';

            if (blockedChars.includes(event.key)) {
                // Prevent the character from being input
                event.preventDefault();

                // Show an alert message
                alert("My XXS skills are strong...");
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