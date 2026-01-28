document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const conversationsList = document.getElementById('conversations-list');
    const chatWindow = document.getElementById('chat-window');
    const chatHeaderImg = document.getElementById('chat-header-img');
    const chatHeaderName = document.getElementById('chat-header-name');
    const chatHeaderItem = document.getElementById('chat-header-item');
    const messageArea = document.getElementById('message-area');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let allConversations = {}; // Stores all chat histories
    let activeConversationId = null; // Tracks the currently viewed chat

    // --- Mock Data ---
    // In a real app, this would come from a server or more persistent storage.
    const mockConversations = {
        '101': {
            participants: { seller: 'Priya', buyer: 'You' },
            item: { id: 101, name: 'Casio FX-991MS Calculator' },
            profilePic: 'https://placehold.co/40x40/E2E8F0/4A5568?text=P',
            messages: [
                { sender: 'Priya', text: 'Hi! Is the calculator still available?' },
                { sender: 'You', text: 'Yes, it is. Are you interested?' }
            ]
        },
        '103': {
            participants: { seller: 'Harika', buyer: 'You' },
            item: { id: 103, name: 'Complete Engineering Drawing Kit' },
            profilePic: 'https://placehold.co/40x40/E2E8F0/4A5568?text=H',
            messages: [
                { sender: 'You', text: 'Hello, I saw your giveaway for the drawing kit. Can I pick it up tomorrow?' }
            ]
        }
    };

    /**
     * Renders the list of conversations in the sidebar.
     */
    const renderConversationsList = () => {
        if (!conversationsList) return;
        conversationsList.innerHTML = ''; // Clear existing list

        if (Object.keys(allConversations).length === 0) {
            conversationsList.innerHTML = '<p class="p-4 text-center text-gray-500">No conversations yet.</p>';
            return;
        }

        for (const convoId in allConversations) {
            const convo = allConversations[convoId];
            const listItem = document.createElement('div');
            listItem.className = 'conversation-item p-4 border-b flex items-center space-x-3';
            if (convoId === activeConversationId) {
                listItem.classList.add('active');
            }
            listItem.dataset.convoId = convoId; // Store convo ID for click handling

            const lastMessage = convo.messages[convo.messages.length - 1];

            listItem.innerHTML = `
                <img src="${convo.profilePic}" alt="${convo.participants.seller}" class="w-12 h-12 rounded-full">
                <div class="flex-grow overflow-hidden">
                    <p class="font-bold text-gray-800 truncate">${convo.participants.seller}</p>
                    <p class="text-sm text-gray-500 truncate"><strong>${lastMessage.sender}:</strong> ${lastMessage.text}</p>
                </div>
            `;

            listItem.addEventListener('click', () => {
                activeConversationId = convoId;
                renderActiveConversation();
                renderConversationsList(); // Re-render to show active state
            });
            conversationsList.appendChild(listItem);
        }
    };

    /**
     * Renders the currently active conversation in the main chat window.
     */
    const renderActiveConversation = () => {
        if (!activeConversationId || !allConversations[activeConversationId]) {
            // Display a placeholder if no chat is active
            chatHeaderName.textContent = 'Select a Conversation';
            chatHeaderItem.textContent = 'Item details will appear here';
            chatHeaderImg.src = 'https://placehold.co/40x40/E2E8F0/4A5568?text=S';
            messageArea.innerHTML = '<p class="text-center text-gray-400">Select a conversation to see messages.</p>';
            messageInput.disabled = true;
            sendButton.disabled = true;
            return;
        }

        const convo = allConversations[activeConversationId];
        
        // Update header
        chatHeaderName.textContent = convo.participants.seller;
        chatHeaderItem.textContent = `Regarding: ${convo.item.name}`;
        chatHeaderImg.src = convo.profilePic;

        // Enable chat input
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();

        // Render messages
        messageArea.innerHTML = '';
        convo.messages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble mb-2';
            bubble.classList.add(msg.sender === 'You' ? 'sent' : 'received');
            bubble.textContent = msg.text;
            messageArea.appendChild(bubble);
        });

        // Scroll to the latest message
        messageArea.scrollTop = messageArea.scrollHeight;
    };

    /**
     * Handles the submission of the message form.
     */
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (text && activeConversationId) {
            const newMessage = { sender: 'You', text: text };
            allConversations[activeConversationId].messages.push(newMessage);
            
            // Save to localStorage
            localStorage.setItem('chatConversations', JSON.stringify(allConversations));

            messageInput.value = ''; // Clear input
            renderActiveConversation(); // Re-render chat
            renderConversationsList(); // Re-render sidebar to update last message
        }
    });

    /**
     * Initializes the chat application.
     */
    const initializeChat = () => {
        // 1. Load conversations from localStorage or use mock data
        try {
            const storedConversations = JSON.parse(localStorage.getItem('chatConversations'));
            if (storedConversations && Object.keys(storedConversations).length > 0) {
                allConversations = storedConversations;
            } else {
                allConversations = mockConversations;
            }
        } catch (error) {
            console.error("Failed to load chats, using mock data.", error);
            allConversations = mockConversations;
        }

        // 2. Check URL for parameters to start a new conversation
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('itemId');

        if (itemId && !allConversations[itemId]) {
            // If a chat for this item doesn't exist, create it
            allConversations[itemId] = {
                participants: { seller: urlParams.get('seller') || 'Seller', buyer: 'You' },
                item: { id: itemId, name: urlParams.get('itemName') || 'Item' },
                profilePic: urlParams.get('profilePic') || 'https://placehold.co/40x40/E2E8F0/4A5568?text=S',
                messages: [] // Start with no messages
            };
        }
        
        // If an item ID is present, make it the active chat
        if (itemId) {
            activeConversationId = itemId;
        }

        // 3. Render the UI
        renderConversationsList();
        renderActiveConversation();
    };

    // --- Start the application ---
    initializeChat();
});
