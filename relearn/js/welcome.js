// This file can be used for any interactive elements on the welcome page.

console.log("ReLearN Welcome Page Loaded!");

// --- Responsive Navbar Logic ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    // Toggles the 'hidden' class on the mobile menu
    mobileMenu.classList.toggle('hidden');
});

