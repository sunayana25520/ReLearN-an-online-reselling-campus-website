document.addEventListener('DOMContentLoaded', () => {
    const sellForm = document.getElementById('sell-form');
    const priceContainer = document.getElementById('price-container');
    const listingTypeRadios = document.querySelectorAll('input[name="listingType"]');

    // This function shows or hides the price input field based on the selected listing type.
    const togglePriceField = () => {
        const selectedType = document.querySelector('input[name="listingType"]:checked').value;
        const priceInput = document.getElementById('price');
        
        // Only show the price field if "For Sale" is selected.
        if (selectedType === 'For Sale') {
            priceContainer.style.display = 'block';
            priceInput.required = true; // Make price mandatory for sale items.
        } else {
            priceContainer.style.display = 'none';
            priceInput.required = false; // Price is not needed for other types.
        }
    };

    // Add event listeners to the radio buttons to trigger the toggle function on change.
    listingTypeRadios.forEach(radio => {
        radio.addEventListener('change', togglePriceField);
    });

    // Handle the form submission when the "Add Item" button is clicked.
    sellForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Check if a user is logged in before allowing them to list an item.
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('You must be logged in to list an item.');
            window.location.href = 'login.html'; // Redirect to login if not logged in.
            return;
        }
        
        // Get all the values from the form fields.
        const title = document.getElementById('item-title').value;
        const category = document.getElementById('category').value;
        const condition = document.getElementById('condition').value;
        const description = document.getElementById('description').value;
        const listingType = document.querySelector('input[name="listingType"]:checked').value;
        const imageFile = document.getElementById('item-image').files[0];
        let price = document.getElementById('price').value;

        // Set the price value based on the listing type.
        if (listingType === 'Giveaway') {
            price = 0;
        } else if (listingType === 'Exchange') {
            price = null; // Use null to indicate it's not for a priced sale.
        }

        if (!imageFile) {
            alert('Please upload an image for the item.');
            return;
        }

        // Use FileReader to convert the image file to a Base64 string for storage.
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = function() {
            // Create a new item object with all the collected data.
            const newItem = {
                id: Date.now(), // Use a timestamp for a simple unique ID.
                title,
                category,
                condition,
                price: price ? parseFloat(price) : null,
                description,
                listingType,
                image: reader.result,
                seller: currentUser.name, // Get seller info from the logged-in user.
                branch: currentUser.branch
            };

            // Add the new item to the existing list in localStorage.
            const existingItems = JSON.parse(localStorage.getItem('itemsForSale')) || [];
            existingItems.push(newItem);
            localStorage.setItem('itemsForSale', JSON.stringify(existingItems));
            
            alert('Your item has been successfully listed!');
            
            // Redirect the user to the appropriate page based on what they listed.
            if (listingType === 'Giveaway') {
                window.location.href = 'giveaway.html';
            } else if (listingType === 'Exchange') {
                window.location.href = 'exchange.html';
            } else { // 'For Sale'
                window.location.href = 'buy.html';
            }
        };

        reader.onerror = () => {
            alert('There was an error uploading the image. Please try again.');
        };
    });

    // Run the function once on page load to set the initial state of the price field.
    togglePriceField();
});

