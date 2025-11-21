// Get case study from URL parameter
function getCaseStudyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('study') || 'template1';
}

// Case study titles
const caseStudyTitles = {
    template1: 'Dr. Jennifer Walker',
    template2: 'Case Study Template 2',
    template3: 'Case Study Template 3'
};

// API Configuration
const API_URL = 'http://localhost:8080';
const SESSION_ID = `session_${Date.now()}`;

// Audio recording variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recordingStartTime = 0;

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    // Only run on simulation page
    if (!document.getElementById('chatMessages')) return;
    
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const messageCountEl = document.getElementById('messageCount');
    const caseStudyNameEl = document.getElementById('caseStudyName');
    
    // Voice mode elements
    const textModeBtn = document.getElementById('textModeBtn');
    const voiceModeBtn = document.getElementById('voiceModeBtn');
    const textInputSection = document.getElementById('textInputSection');
    const voiceInputSection = document.getElementById('voiceInputSection');
    const recordButton = document.getElementById('recordButton');
    const recordIcon = document.getElementById('recordIcon');
    const recordText = document.getElementById('recordText');
    const recordingStatus = document.getElementById('recordingStatus');
    
    let messageCount = 0;
    let currentMode = 'text';
    const studyKey = getCaseStudyFromURL();
    
    // Update case study name
    if (caseStudyNameEl) {
        caseStudyNameEl.textContent = caseStudyTitles[studyKey] || 'SaaS Startup';
    }
    
    // Update simulation title
    const simulationTitle = document.getElementById('simulationTitle');
    if (simulationTitle) {
        simulationTitle.textContent = `${caseStudyTitles[studyKey]} Pitch`;
    }
    
    // Mode toggle handlers
    textModeBtn.addEventListener('click', () => {
        currentMode = 'text';
        textModeBtn.classList.add('active');
        voiceModeBtn.classList.remove('active');
        textInputSection.style.display = 'flex';
        voiceInputSection.style.display = 'none';
    });
    
    voiceModeBtn.addEventListener('click', () => {
        currentMode = 'voice';
        voiceModeBtn.classList.add('active');
        textModeBtn.classList.remove('active');
        textInputSection.style.display = 'none';
        voiceInputSection.style.display = 'block';
    });
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? '👤' : '👩🏾‍🔬';
        
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
    
    // Function to add audio message with player
    function addAudioMessage(audioUrl) {
        console.log('[Audio] Adding audio player with URL:', audioUrl);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '👩🏾‍🔬';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        audioPlayer.autoplay = true;
        audioPlayer.src = audioUrl;
        audioPlayer.className = 'audio-player';
        
        // Add error handling
        audioPlayer.onerror = (e) => {
            console.error('[Audio] Error loading audio:', e);
            console.error('[Audio] Error details:', audioPlayer.error);
            const errorMsg = document.createElement('p');
            errorMsg.textContent = '⚠️ Audio failed to load';
            errorMsg.style.color = '#e53e3e';
            messageContent.appendChild(errorMsg);
        };
        
        audioPlayer.onloadeddata = () => {
            console.log('[Audio] Audio loaded successfully');
        };
        
        audioPlayer.onplay = () => {
            console.log('[Audio] Audio started playing');
        };
        
        messageContent.appendChild(audioPlayer);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        messageCount++;
        if (messageCountEl) {
            messageCountEl.textContent = messageCount;
        }
    }
    
    // Function to show loading indicator
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message loading-message';
        loadingDiv.id = 'loadingMessage';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '👩🏾‍🔬';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = '<p>Thinking...</p>';
        
        loadingDiv.appendChild(avatar);
        loadingDiv.appendChild(messageContent);
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeLoading() {
        const loadingMsg = document.getElementById('loadingMessage');
        if (loadingMsg) loadingMsg.remove();
    }
    
    // Function to send text message
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        userInput.value = '';
        
        // Show loading
        showLoading();
        
        // Simulate AI response for now (replace with actual API call later)
        setTimeout(() => {
            removeLoading();
            addMessage("cool!", false);
        }, 1000);
    }
    
    // Function to send voice message to API
    async function sendVoiceMessage(audioBlob) {
        try {
            console.log('[Voice] Sending audio to API...');
            console.log('[Voice] Audio blob size:', audioBlob.size, 'bytes');
            console.log('[Voice] Audio blob type:', audioBlob.type);
            
            showLoading();
            
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('session_id', SESSION_ID);
            formData.append('case_study', studyKey);
            
            console.log('[Voice] Making API request to:', `${API_URL}/api/chat`);
            console.log('[Voice] FormData contents:', {
                audio_size: audioBlob.size,
                session_id: SESSION_ID,
                case_study: studyKey
            });
            
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                body: formData
            });
            
            console.log('[Voice] Response status:', response.status);
            console.log('[Voice] Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Voice] API error response:', errorText);
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { error: errorText };
                }
                throw new Error(errorData.error || 'API request failed');
            }
            
            const data = await response.json();
            console.log('[Voice] API response:', data);
            
            removeLoading();
            
            // Add user's transcribed message
            addMessage(data.transcript, true);
            
            // Add AI's text response
            addMessage(data.reply, false);
            
            // Add and play audio response
            const audioUrl = `${API_URL}${data.audio_url}`;
            console.log('[Voice] Audio URL:', audioUrl);
            addAudioMessage(audioUrl);
            
        } catch (error) {
            removeLoading();
            console.error('[Voice] Error:', error);
            console.error('[Voice] Error stack:', error.stack);
            addMessage(`Error: ${error.message}. Check console for details.`, false);
        }
    }
    
    // Audio recording setup
    async function setupAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });
            
            // Try different MIME types in order of preference
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.log('[Voice] audio/webm;codecs=opus not supported');
                mimeType = 'audio/webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    console.log('[Voice] audio/webm not supported');
                    mimeType = 'audio/mp4';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        console.log('[Voice] audio/mp4 not supported, using default');
                        mimeType = '';
                    }
                }
            }
            
            console.log('[Voice] Using MIME type:', mimeType || 'default');
            
            const options = mimeType ? { mimeType } : {};
            mediaRecorder = new MediaRecorder(stream, options);
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                console.log('[Voice] Created blob with type:', audioBlob.type, 'size:', audioBlob.size);
                audioChunks = [];
                
                recordingStatus.textContent = 'Processing...';
                await sendVoiceMessage(audioBlob);
                recordingStatus.textContent = '';
            };
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    }
    
    // Record button handlers
    recordButton.addEventListener('mousedown', async () => {
        if (!mediaRecorder) {
            await setupAudioRecording();
        }
        
        if (mediaRecorder && !isRecording) {
            audioChunks = [];
            recordingStartTime = Date.now();
            console.log('[Voice] Starting recording...');
            mediaRecorder.start();
            isRecording = true;
            
            recordButton.classList.add('recording');
            recordIcon.textContent = '⏺️';
            recordText.textContent = 'Recording...';
            recordingStatus.textContent = 'Recording... Release to send';
        }
    });
    
    recordButton.addEventListener('mouseup', () => {
        if (mediaRecorder && isRecording) {
            const recordingDuration = Date.now() - recordingStartTime;
            console.log('[Voice] Stopping recording... Duration:', recordingDuration, 'ms');
            
            if (recordingDuration < 500) {
                console.log('[Voice] Recording too short, ignoring');
                mediaRecorder.stop();
                isRecording = false;
                audioChunks = [];
                
                recordButton.classList.remove('recording');
                recordIcon.textContent = '🎤';
                recordText.textContent = 'Hold to Record';
                recordingStatus.textContent = 'Recording too short! Hold longer.';
                setTimeout(() => {
                    recordingStatus.textContent = '';
                }, 2000);
                return;
            }
            
            mediaRecorder.stop();
            isRecording = false;
            
            recordButton.classList.remove('recording');
            recordIcon.textContent = '🎤';
            recordText.textContent = 'Hold to Record';
        }
    });
    
    recordButton.addEventListener('mouseleave', () => {
        if (isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            
            recordButton.classList.remove('recording');
            recordIcon.textContent = '🎤';
            recordText.textContent = 'Hold to Record';
        }
    });
    
    // Text input event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
