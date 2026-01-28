// This file handles the form validation for the signup page.

console.log("ReLearN Signup Page Loaded!");

document.getElementById('signup-form').addEventListener('submit', function(event) {
    // Prevent the form from submitting by default to allow for custom validation
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Regex to validate the email format, must end in @mictech.edu.in
    const emailPattern = /[a-zA-Z0-9._%+-]+@mictech\.edu\.in$/;

    // First, check if the email format is incorrect.
    if (!emailPattern.test(email)) {
        alert("Please enter a valid college email address ending in @mictech.edu.in.");
        return; // Stop the function here if the email is invalid
    }

    // Next, check if the passwords do not match.
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return; // Stop the function here if passwords don't match
    }

    // If all checks pass, proceed with the simulated form submission.
    console.log("Form submitted successfully (simulation).");
    alert("Account created successfully! Please log in.");
    
    // Redirect to the login page after successful signup.
    window.location.href = 'login.html';
});

