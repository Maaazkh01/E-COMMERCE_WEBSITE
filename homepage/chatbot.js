document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    
    // Edge Function URL 
    const edgeFunctionUrl = 'https://aghqftkufpybciyadqil.supabase.co/functions/v1/gemini-chat';
    
    // Toggle chat window
    chatBubble.addEventListener('click', function() {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });
    
    // Close chat window
    closeChat.addEventListener('click', function() {
        chatWindow.classList.add('hidden');
    });
    
    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Disable input while waiting for response
        chatInput.disabled = true;
        sendButton.disabled = true;
        
        try {
            // Send message to Edge Function
            const response = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Add AI response to chat
                addMessage(data.response, 'ai');
            } else {
                // Add error message to chat
                addMessage("Sorry, I'm having trouble responding right now.", 'ai');
            }
        } catch (error) {
            // Add error message to chat
            addMessage("Sorry, I'm having trouble responding right now.", 'ai');
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start gap-2';
        
        if (sender === 'user') {
            messageDiv.classList.add('justify-end');
            messageDiv.innerHTML = `
                <div class="bg-[#1173d4] text-white rounded-lg p-3 max-w-[80%]">
                    <p class="text-sm">${escapeHtml(text)}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-[#1173d4] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-[#1173d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p class="text-sm text-gray-800">${escapeHtml(text)}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});