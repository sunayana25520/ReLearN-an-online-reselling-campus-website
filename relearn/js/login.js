document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // --- Retrieve User Data ---
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // --- Find Matching User (with case-insensitive email check) ---
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (user) {
            // --- Successful Login ---
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful!');
            window.location.href = 'welcome.html';
        } else {
            // --- Failed Login with Enhanced Debugging ---
            const storedUsersData = localStorage.getItem('users');
            let debugMessage = 'Invalid email or password. Please check for typos.\n\n';

            // Check if any users are stored at all.
            if (!storedUsersData || storedUsersData === '[]') {
                debugMessage += 'No users have been signed up yet. Please create an account first.';
            } else {
                // Show the stored data to help diagnose the issue.
                debugMessage += 'For debugging, here is the currently stored user data:\n' + storedUsersData;
            }
            
            alert(debugMessage);
        }
    });
});

