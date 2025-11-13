// Get case study from URL parameter
function getCaseStudyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('study') || 'saas';
}

// Case study titles
const caseStudyTitles = {
    saas: 'SaaS Startup',
    healthtech: 'HealthTech Innovation',
    climatetech: 'Climate Tech'
};

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    // Only run on simulation page
    if (!document.getElementById('chatMessages')) return;
    
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const messageCountEl = document.getElementById('messageCount');
    const caseStudyNameEl = document.getElementById('caseStudyName');
    
    let messageCount = 0;
    const studyKey = getCaseStudyFromURL();
    
    // Update case study name
    if (caseStudyNameEl) {
        caseStudyNameEl.textContent = caseStudyTitles[studyKey] || 'SaaS Startup';
    }
    
    // Update simulation title
    const simulationTitle = document.getElementById('simulationTitle');
    const simulationSubtitle = document.getElementById('simulationSubtitle');
    if (simulationTitle) {
        simulationTitle.textContent = `${caseStudyTitles[studyKey]} Pitch`;
    }
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messagePara = document.createElement('p');
        messagePara.textContent = content;
        messageContent.appendChild(messagePara);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        messageCount++;
        if (messageCountEl) {
            messageCountEl.textContent = messageCount;
        }
    }
    
    // Function to send a message
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, true);
        userInput.value = '';
        
        // Simulate AI response (you can replace this with actual API call)
        setTimeout(() => {
            addMessage("cool!", false);
        }, 1000);
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
