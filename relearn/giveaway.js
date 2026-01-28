document.addEventListener('DOMContentLoaded', () => {
    // Get references to the interactive elements on the page.
    const itemsGrid = document.getElementById('items-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    let allItems = []; // This will hold all items fetched from storage.

    // A predefined list of default items to show if localStorage is empty.
    const defaultGiveawayItems = [
        { id: 102, title: 'Texas Instruments BA II Plus', category: 'Calculator', condition: 'New', price: null, description: 'Financial calculator, looking to swap for a good drafter.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759556163/71xloBRen6L._AC_UF1000_1000_QL80_-removebg-preview_x7o7y0.png', seller: 'Rakesh', branch: 'ECE', listingType: 'Exchange' },
        { id: 103, title: 'Complete Engineering Drawing Kit', category: 'Drawing Kit', condition: 'Fair', price: 0, description: 'Full set of drawing instruments including drafter. Free for anyone who needs it.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759491645/619a6358-5460-4660-a1c8-109051829370-removebg-preview_d5eifp.png', seller: 'Harika', branch: 'ME', listingType: 'Giveaway' },
        { id: 105, title: 'White Lab Apron (Medium)', category: 'Lab Apron', condition: 'New', price: null, description: 'Brand new, unused white lab coat. Will trade for a textbook.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759492651/images-removebg-preview_jovq5y.png', seller: 'Teja', branch: 'Chemical', listingType: 'Exchange' },
        { id: 108, title: 'Organic Chemistry by Morrison & Boyd', category: 'Textbooks', condition: 'Fair', price: 0, description: 'Classic textbook for organic chemistry. Has some highlighted pages.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759556160/414i-OCiH-L._AC_UF1000_1000_QL80_-removebg-preview_e7v1y9.png', seller: 'Teja', branch: 'Chemical', listingType: 'Giveaway' },
        { id: 110, title: 'Omega Mini Drafter', category: 'Drafter', condition: 'Fair', price: null, description: 'A used Omega brand mini drafter, fully functional. Willing to trade.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759564073/71vKa5D-L6L._AC_UF1000_1000_QL80_-removebg-preview_thkkfg.png', seller: 'Harika', branch: 'ME', listingType: 'Exchange' },
        { id: 111, title: 'Workshop Safety Goggles', category: 'Lab Materials', condition: 'New', price: 0, description: 'Unused, scratch-resistant safety goggles for workshop and lab use.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759560411/51o2m2g248L._AC_UF1000_1000_QL80_-removebg-preview_j8hwqg.png', seller: 'Rakesh', branch: 'ECE', listingType: 'Giveaway' },
        { id: 114, title: 'College Backpack', category: 'Other', condition: 'Good', price: null, description: 'Sturdy backpack with multiple compartments. Want to exchange for a calculator.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759564079/61a-T6tK-SL._AC_UY1100_-removebg-preview_n5hfgq.png', seller: 'Venu', branch: 'Civil', listingType: 'Exchange' }
    ];

    /**
     * Renders a filtered list of items to the page.
     * @param {Array} itemsToDisplay - The array of item objects to be displayed.
     */
    const renderItems = (itemsToDisplay) => {
        if (!itemsGrid) return;
        itemsGrid.innerHTML = '';

        if (itemsToDisplay.length === 0) {
            itemsGrid.innerHTML = `<p class="text-gray-500 col-span-full text-center">No giveaway or exchange items found.</p>`;
            return;
        }

        itemsToDisplay.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';

            const imageContainer = document.createElement('div');
            imageContainer.className = 'item-card-image-container';
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.title;
                imageContainer.appendChild(img);
            }
            if(item.listingType) {
                const typeTag = document.createElement('div');
                typeTag.className = 'item-listing-type';
                typeTag.textContent = item.listingType;
                imageContainer.appendChild(typeTag);
            }

            const cardBody = document.createElement('div');
            cardBody.className = 'item-card-body';
            
            const sellerInitial = item.seller ? item.seller.charAt(0).toUpperCase() : '?';
            const profilePicUrl = `https://placehold.co/40x40/E2E8F0/4A5568?text=${sellerInitial}`;
            
            let sellerHTML = '';
            if (item.seller) {
                const sellerName = `${item.seller} ${item.branch ? `(${item.branch})` : ''}`;
                sellerHTML = `
                    <div class="seller-info">
                        <img src="${profilePicUrl}" alt="${item.seller}" class="seller-profile-pic">
                        <span class="seller-name">${sellerName}</span>
                    </div>`;
            }

            let priceHTML = '';
            if (item.listingType === 'Giveaway') {
                priceHTML = `<p class="item-card-price">Free</p>`;
            } else if (item.listingType === 'Exchange') {
                priceHTML = `<p class="item-card-price">Swap / Trade</p>`;
            }

            let innerHTML = `
                <h4 class="item-card-title">${item.title || 'No Title'}</h4>
                <p class="item-card-description">${item.description || ''}</p>
                <p class="item-card-condition">Condition: ${item.condition || 'N/A'}</p>
                ${priceHTML}
                <div class="item-card-footer">
                    ${sellerHTML}
                    <a href="message.html" class="contact-button">Message</a>
                </div>
            `;
            
            cardBody.innerHTML = innerHTML;
            card.appendChild(imageContainer);
            card.appendChild(cardBody);
            itemsGrid.appendChild(card);
        });
    };

    /**
     * Fetches items, applies filters, and triggers rendering.
     */
    const filterAndRender = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const filteredItems = allItems.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = (item.title && item.title.toLowerCase().includes(searchTerm)) || 
                                  (item.description && item.description.toLowerCase().includes(searchTerm));
            return matchesCategory && matchesSearch;
        });
        renderItems(filteredItems);
    };

    /**
     * Initializes the page by fetching data and setting up event listeners.
     */
    const initializePage = () => {
        try {
            const storedItems = JSON.parse(localStorage.getItem('itemsForSale')) || defaultGiveawayItems;
            // Filter all items to only show 'Giveaway' or 'Exchange'
            allItems = storedItems.filter(item => item.listingType === 'Giveaway' || item.listingType === 'Exchange');

            // If after filtering localStorage is empty, use the default giveaway/exchange items
            if (allItems.length === 0) {
                 allItems = defaultGiveawayItems;
            }

        } catch (error) {
            console.error("Could not parse items from localStorage, using default items.", error);
            allItems = defaultGiveawayItems;
        }

        if (searchBar) searchBar.addEventListener('input', filterAndRender);
        if (categoryFilter) categoryFilter.addEventListener('change', filterAndRender);

        renderItems(allItems);
    };

    initializePage();
});

