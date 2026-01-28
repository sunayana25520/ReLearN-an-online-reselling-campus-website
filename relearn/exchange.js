document.addEventListener('DOMContentLoaded', () => {
    const itemsGrid = document.getElementById('items-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    let allItems = [];

    // Default items specific to the Exchange category
    const defaultExchangeItems = [
        { id: 102, title: 'Texas Instruments BA II Plus', category: 'Calculator', condition: 'New', price: null, description: 'Financial calculator, looking to swap for a good drafter.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759556163/71xloBRen6L._AC_UF1000_1000_QL80_-removebg-preview_x7o7y0.png', seller: 'Rakesh', branch: 'ECE', listingType: 'Exchange' },
        { id: 105, title: 'White Lab Apron (Medium)', category: 'Lab Apron', condition: 'New', price: null, description: 'Brand new, unused white lab coat. Will trade for a textbook.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759492651/images-removebg-preview_jovq5y.png', seller: 'Teja', branch: 'Chemical', listingType: 'Exchange' },
        { id: 110, title: 'Omega Mini Drafter', category: 'Drafter', condition: 'Fair', price: null, description: 'A used Omega brand mini drafter, fully functional. Willing to trade.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759564073/71vKa5D-L6L._AC_UF1000_1000_QL80_-removebg-preview_thkkfg.png', seller: 'Harika', branch: 'ME', listingType: 'Exchange' },
        { id: 114, title: 'College Backpack', category: 'Other', condition: 'Good', price: null, description: 'Sturdy backpack with multiple compartments. Want to exchange for a calculator.', image: 'https://res.cloudinary.com/diy6nhly9/image/upload/v1759564079/61a-T6tK-SL._AC_UY1100_-removebg-preview_n5hfgq.png', seller: 'Venu', branch: 'Civil', listingType: 'Exchange' }
    ];

    const renderItems = (itemsToDisplay) => {
        if (!itemsGrid) return;
        itemsGrid.innerHTML = '';

        if (itemsToDisplay.length === 0) {
            itemsGrid.innerHTML = `<p class="text-gray-500 col-span-full text-center">No exchange items found.</p>`;
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

            let priceHTML = `<p class="item-card-price">Swap / Trade</p>`;

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

    const initializePage = () => {
        try {
            const storedItems = JSON.parse(localStorage.getItem('itemsForSale')) || [];
            // IMPORTANT: Filter for only Exchange items for this page
            const exchangeItems = storedItems.filter(item => item.listingType === 'Exchange');
            
            if (exchangeItems.length > 0) {
                allItems = exchangeItems;
            } else {
                allItems = defaultExchangeItems;
            }
        } catch (error) {
            console.error("Could not parse items from localStorage, using default items.", error);
            allItems = defaultExchangeItems;
        }

        if (searchBar) searchBar.addEventListener('input', filterAndRender);
        if (categoryFilter) categoryFilter.addEventListener('change', filterAndRender);

        renderItems(allItems);
    };

    initializePage();
});
