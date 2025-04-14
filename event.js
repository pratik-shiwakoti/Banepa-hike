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

// Load existing data (phone numbers and emails) from localStorage (if any)
function loadExistingData() {
    let storedData = JSON.parse(localStorage.getItem("submittedData"));
    if (!storedData) {
        storedData = { phones: [], emails: [] };
        localStorage.setItem("submittedData", JSON.stringify(storedData));
    }
    return storedData;
}

// Save the new phone number and email in localStorage
function saveData(phone, email) {
    let storedData = loadExistingData();
    storedData.phones.push(phone);
    storedData.emails.push(email);
    localStorage.setItem("submittedData", JSON.stringify(storedData));
}

// Form submission handler
document.getElementById("registerForm").onsubmit = function(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const phone = document.getElementById("phoneNo").value;
    const email = document.getElementById("email").value;

    // Load existing data and check for duplicate phone number or email
    const existingData = loadExistingData();

    if (existingData.phones.includes(phone)) {
        const editPhone = confirm("This phone number is already registered. Do you want to edit it?");
        if (editPhone) {
            document.getElementById("phoneNo").focus();
            return; // Allow user to edit the phone number
        } else {
            alert("Please enter a different phone number.");
            return; // Stop form submission if duplicate phone number found
        }
    }

    if (existingData.emails.includes(email)) {
        const editEmail = confirm("This email address is already registered. Do you want to edit it?");
        if (editEmail) {
            document.getElementById("email").focus();
            return; // Allow user to edit the email address
        } else {
            alert("Please enter a different email address.");
            return; // Stop form submission if duplicate email found
        }
    }

    // If no duplicates, save the phone number and email, and submit the form data to the server
    saveData(phone, email);

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Age", age);
    formData.append("Gender", document.getElementById("gender").value);
    formData.append("Address", document.getElementById("address").value);
    formData.append("Phone", phone);
    formData.append("Email", email);
    formData.append("MedicalInfo", document.getElementById("medicalInfo").value);

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwKhynfddjImlra3N9hr4TX5L3afflkn9qMvoVD47JD6bw-5td_DLF38XRLGIp5i3Npzw/exec';

    // Submit data to Google Apps Script Web App
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Expect JSON response from server
    .then(result => {
        if (result.status === 'success') {
            alert("Registration successful!");
            clearForm();
        } else {
            alert("Error: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error!", error);
        alert("There was an error submitting the form.");
    });
};

// Function to clear the form
function clearForm() {
    document.getElementById("registerForm").reset();
}

// Google Apps Script doPost function
function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registrations");

    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ status: "error", message: "Sheet not found" })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
        e.parameter.Name,
        e.parameter.Age,
        e.parameter.Gender,
        e.parameter.Address,
        e.parameter.Phone,
        e.parameter.Email,
        e.parameter.MedicalInfo,
        new Date()
    ]);

    return ContentService.createTextOutput(
        JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
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
const eventDate = new Date("April 19, 2025 00:00:00").getTime();

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
  
