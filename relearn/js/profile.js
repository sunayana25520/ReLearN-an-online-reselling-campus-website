document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const itemsGrid = document.getElementById('my-items-grid');
    const itemsListedCount = document.getElementById('items-listed-count');
    const profileName = document.getElementById('profile-name');
    const profileBranch = document.getElementById('profile-branch'); // Assuming you add this ID
    const profileMainPic = document.getElementById('profile-main-pic');

    // Get the current logged-in user from localStorage.
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // If no user is logged in, redirect to the login page.
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    let allItems = [];

    /**
     * Renders the items listed by the current user onto their profile page.
     */
    const renderMyItems = () => {
        if (!itemsGrid || !itemsListedCount) {
            console.error("Profile page elements not found.");
            return;
        }

        // Filter the full item list to get only the items listed by the current user.
        const myItems = allItems.filter(item => item.seller === currentUser.name);

        // Clear the grid before rendering.
        itemsGrid.innerHTML = '';

        // Update the "Items Listed" stat.
        itemsListedCount.textContent = myItems.length;

        if (myItems.length === 0) {
            itemsGrid.innerHTML = '<p class="text-gray-500 col-span-full">You have not listed any items yet.</p>';
            return;
        }

        myItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'my-item-card';
            const listingTypeClass = item.listingType.toLowerCase().replace(' ', '-');

            card.innerHTML = `
                <img src="${item.image || 'https://placehold.co/600x400/E2E8F0/4A5568?text=No+Image'}" alt="${item.title}" class="my-item-card-image">
                <div class="my-item-card-body">
                    <h4 class="my-item-card-title">${item.title}</h4>
                    <div class="my-item-card-details">
                        <p><strong>Price:</strong> ${item.listingType === 'Giveaway' ? 'Free' : (item.listingType === 'Exchange' ? 'Swap/Trade' : `₹${item.price}`)}</p>
                        <p><strong>Condition:</strong> ${item.condition}</p>
                    </div>
                    <div class="my-item-card-footer">
                        <span class="item-listing-type-profile ${listingTypeClass}">${item.listingType}</span>
                        <button class="delete-button" data-item-id="${item.id}">Delete</button>
                    </div>
                </div>
            `;
            itemsGrid.appendChild(card);
        });
        
        addDeleteButtonListeners();
    };

    /**
     * Adds click event listeners to all delete buttons on the page.
     */
    const addDeleteButtonListeners = () => {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemIdToDelete = parseInt(e.target.dataset.itemId, 10);
                deleteItem(itemIdToDelete);
            });
        });
    };

    /**
     * Deletes an item from the main list and updates the UI.
     * @param {number} itemId - The ID of the item to delete.
     */
    const deleteItem = (itemId) => {
        if (confirm('Are you sure you want to delete this listing?')) {
            const itemIndex = allItems.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                allItems.splice(itemIndex, 1);
                localStorage.setItem('itemsForSale', JSON.stringify(allItems));
                renderMyItems();
            }
        }
    };

    /**
     * Initializes the profile page.
     */
    const initializeProfile = () => {
        // Set the user's name and branch in the profile header.
        if (profileName) profileName.textContent = currentUser.name;
        if (profileBranch) profileBranch.textContent = currentUser.branch;

        // Generate and set the main profile picture.
        if (profileMainPic) {
            const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?';
            profileMainPic.src = `https://placehold.co/128x128/E2E8F0/4A5568?text=${userInitial}`;
        }
        
        try {
            allItems = JSON.parse(localStorage.getItem('itemsForSale')) || [];
        } catch (error) {
            console.error("Failed to load items from localStorage.", error);
            allItems = [];
        }

        renderMyItems();
    };

    initializeProfile();
});

