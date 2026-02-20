// ============================================
// FILE: js/chatbot.js
// LOCATION: /js/chatbot.js
// ============================================

const chatResponses = {
    'hello': 'Hi there! How can I help you with your maintenance needs today?',
    'hi': 'Hello! Welcome to AMM. What service are you looking for?',
    'price': 'Our prices vary by service. Electrical work starts at R450/hour, painting at R120/m². Would you like an instant quote?',
    'quote': 'I can help you get a quote! Please visit our calculator section or fill out the contact form. Would you like me to take you there?',
    'booking': 'You can book online through our booking calendar. We have slots available this week. Shall I open the booking section?',
    'emergency': 'For emergencies, please call 012 345 6789 immediately. We have 24/7 emergency services available.',
    'hours': 'Our business hours are Mon-Fri 7AM-6PM, Saturday 8AM-2PM. Emergency services available 24/7.',
    'services': 'We offer electrical work, construction, road paving, home repairs, painting, and emergency services. Which one interests you?',
    'payment': 'We accept EFT, cash, credit/debit cards, and offer payment plans for large projects.',
    'warranty': 'All work comes with warranty: 3 months for repairs, 12 months for renovations, 5 years for new construction.',
    'area': 'We service Johannesburg, Pretoria, and surrounding areas within 50km. Check our service area section to confirm your location.',
    'contact': 'You can reach us at 012 345 6789, WhatsApp 072 123 4567, or email info@allmaintenancematters.co.za',
    'bye': 'Thank you for chatting! Feel free to reach out if you have any other questions. Have a great day!'
};

function toggleChatbot() {
    const window = document.getElementById('chatbotWindow');
    if (window) window.classList.toggle('active');
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesDiv = document.getElementById('chatMessages');
    
    if (!input || !messagesDiv) return;
    
    const message = input.value.trim();
    if (!message) return;

    // User message
    messagesDiv.innerHTML += `<div class="chat-message user">${message}</div>`;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Bot response
    setTimeout(() => {
        const lowerMsg = message.toLowerCase();
        let response = 'I\'m not sure about that. For specific questions, please call 012 345 6789 or fill out our contact form. Is there anything else I can help with?';
        
        for (const [key, val] of Object.entries(chatResponses)) {
            if (lowerMsg.includes(key)) {
                response = val;
                break;
            }
        }

        messagesDiv.innerHTML += `<div class="chat-message bot">${response}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Auto-navigate
        if (lowerMsg.includes('quote') || lowerMsg.includes('price')) {
            setTimeout(() => smoothScroll('calculator'), 1000);
        } else if (lowerMsg.includes('book')) {
            setTimeout(() => smoothScroll('booking'), 1000);
        }
    }, 500);
}