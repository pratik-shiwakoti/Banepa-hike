// Function to open the popup
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

// Function to close the popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Function to close the popup when clicked outside the modal content (for specific popups like learnMorePopup and registerPopup)
window.onclick = function(event) {
    // Check if the target element is a popup background
    if (event.target.classList.contains('popup')) {
        // Close the popup if clicked outside the content area
        event.target.style.display = "none";
    }
};

document.getElementById("registerForm").onsubmit = function(event) {
    var age = parseInt(document.getElementById("age").value);
    var phone = document.getElementById("phoneNo").value;

    // Validate age
    if (age < 18) {
        event.preventDefault();
        alert("You must be at least 18 years old to register.");
        return;
    }

    // Validate phone number
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        event.preventDefault();
        alert("Phone number must be exactly 10 digits and contain only numbers.");
        return;
    }

    // Save data in local storage
    let userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: age,
        phone: phone,
        address: document.getElementById("address").value,
        medicalInfo: document.getElementById("medicalInfo").value
    };

    localStorage.setItem("registrationData", JSON.stringify(userData));
    alert("Data saved successfully!");
};
// Function to clear form fields
function clearForm() {
    document.getElementById("registerForm").reset();
    document.getElementById("medicalInfo").disabled = true;
}
window.onload = function () {
    const feedbackForm = document.getElementById("feedback-form");
    const feedbackResponse = document.getElementById("feedback-response");

    // Handle feedback form submission
    feedbackForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent form from reloading the page

        const feedbackText = document.getElementById("feedback").value;

        if (feedbackText) {
            // Get the existing feedback from localStorage, or initialize an empty array
            let feedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || [];

            // Add the new feedback to the array
            feedbacks.push({ feedback: feedbackText, timestamp: new Date().toISOString() });

            // Save the updated feedback array to localStorage
            localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));

            feedbackResponse.style.display = "block";
            feedbackResponse.innerHTML = "Thank you for your feedback! 😊";

            // Clear the form
            feedbackForm.reset();
        } else {
            feedbackResponse.style.display = "block";
            feedbackResponse.innerHTML = "Please enter your feedback before submitting.";
        }
    });
};
// Set the event date 
const eventDate = new Date("April 14, 2025 01:00:00").getTime();

// Function to update the countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    // Get countdown element, event title, and register button
    const countdownElement = document.getElementById("countdown");
    const eventTitle = document.querySelector(".event-title");
    const registerButton = document.querySelector(".register-button");

    if (distance > 0) {
        // Time calculations for days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update countdown display
        countdownElement.textContent = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;

        // Store event status as "upcoming" in localStorage
        localStorage.setItem("eventStatus", "upcoming");

        // Enable the register button before the event starts
        if (registerButton) {
            registerButton.disabled = false;
            registerButton.textContent = "Register Here";
            registerButton.style.backgroundColor = "#28a745"; // Green for active state
            registerButton.style.cursor = "pointer";
            registerButton.style.pointerEvents = "auto";
        }
    } else {
        // Event has started
        clearInterval(countdownInterval);

        // Change countdown to "00d: 00h: 00m: 00s" and add hover text
        countdownElement.textContent = "Time up !!!";
        countdownElement.style.cursor = "pointer";
        countdownElement.setAttribute("title", "New Event Coming Soon😊");

        // Change event title to "Event has started!"
        eventTitle.textContent = "Event has started!";
        eventTitle.style.color = "red";

        // Store event status as "started" in localStorage
        localStorage.setItem("eventStatus", "started");

        // Disable the register button after event starts
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = "Registration Closed";
            registerButton.style.backgroundColor = "#555"; // Darker color to indicate disabled
            registerButton.style.cursor = "not-allowed";
            registerButton.style.pointerEvents = "none";
        }
    }
}

// Function to check event status on page load
function checkEventStatus() {
    const eventStatus = localStorage.getItem("eventStatus");
    const countdownElement = document.getElementById("countdown");
    const eventTitle = document.querySelector(".event-title");
    const registerButton = document.querySelector(".register-button");

    if (eventStatus === "started") {
        // If the event has already started, show "00d: 00h: 00m: 00s"
        countdownElement.textContent = "00d: 00h: 00m: 00s";
        countdownElement.style.cursor = "pointer";
        countdownElement.setAttribute("title", "Better Luck Next Time");

        // Change event title to "Event has started!"
        eventTitle.textContent = "Event has started!";
        eventTitle.style.color = "red";

        // Disable the register button
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = "Registration Closed";
            registerButton.style.backgroundColor = "#555";
            registerButton.style.cursor = "not-allowed";
            registerButton.style.pointerEvents = "none";
        }
    } else {
        // Otherwise, start the countdown and enable registration
        updateCountdown();
    }
}

// Run checkEventStatus immediately on page load
checkEventStatus();

// Update countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

function openFullscreen() {
    document.getElementById("fullscreenContainer").style.display = "flex";
}
function closeFullscreen() {
    document.getElementById("fullscreenContainer").style.display = "none";
}

function toggleMap() {
    const mapSection = document.getElementById('mapSection');
  
    if (mapSection.style.display === 'none' || mapSection.style.display === '') {
      mapSection.style.display = 'block';
    } else {
      mapSection.style.display = 'none';
    }
  }
  
