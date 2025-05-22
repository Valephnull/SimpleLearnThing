document.addEventListener('DOMContentLoaded', () => {
    const chatDisplay = document.getElementById('chat-display');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Simple Knowledge Base
    const knowledgeBase = {
        greetings: ["Hello!", "Hi there!", "Hey!", "Good to chat with you!"],
        farewells: ["Goodbye!", "See you later!", "Bye!"],
        identity: ["I am a simple chat assistant.", "I'm a basic LLM, here to learn.", "You can call me a chat bot."],
        nameLearning: {
            confirmation: ["Nice to meet you, {name}!", "Got it, I'll remember your name is {name}.", "Thanks for telling me your name, {name}!"],
            recallKnown: ["Your name is {name}, if I remember correctly!", "I believe your name is {name}.", "You told me your name is {name}."],
            recallUnknown: ["I don't think I know your name yet.", "You haven't told me your name.", "I'm sorry, I don't recall your name."]
        },
        unknown: [
            "I'm sorry, I don't understand that yet.",
            "I'm still learning. Can you try rephrasing?",
            "That's new to me. What does that mean?",
            "I'm not sure how to respond to that."
        ]
    };

    // Function to get a random item from an array
    function getRandomResponse(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Function to save user's name to localStorage
    function learnUserName(name) {
        localStorage.setItem('userName', name);
    }

    // Function to get user's name from localStorage
    function getUserName() {
        return localStorage.getItem('userName');
    }

    // Function to generate LLM's response
    function getLlmResponse(messageText) {
        const lowerCaseMessage = messageText.toLowerCase();
        let userName = getUserName(); // Get stored name

        // Pattern: "my name is ..."
        const namePattern = /my name is (\w+)/i; // Case-insensitive, captures the first word after "is"
        const nameMatch = messageText.match(namePattern); // Use messageText for proper case capture

        if (nameMatch && nameMatch[1]) {
            const newName = nameMatch[1];
            learnUserName(newName);
            return getRandomResponse(knowledgeBase.nameLearning.confirmation).replace('{name}', newName);
        }

        // Pattern: "what is my name"
        if (lowerCaseMessage.includes('what is my name')) {
            if (userName) {
                return getRandomResponse(knowledgeBase.nameLearning.recallKnown).replace('{name}', userName);
            } else {
                return getRandomResponse(knowledgeBase.nameLearning.recallUnknown);
            }
        }
        
        // Check for greetings - personalized if name is known
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
            if (userName) {
                return getRandomResponse(knowledgeBase.greetings) + ` It's good to see you again, ${userName}!`;
            }
            return getRandomResponse(knowledgeBase.greetings);
        }

        // Check for questions about identity
        if (lowerCaseMessage.includes('who are you') || lowerCaseMessage.includes('what are you')) {
            return getRandomResponse(knowledgeBase.identity);
        }

        // Check for farewells
        if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye') || lowerCaseMessage.includes('see you')) {
            return getRandomResponse(knowledgeBase.farewells);
        }

        // Default response if no pattern is matched
        return getRandomResponse(knowledgeBase.unknown);
    }

    // Function to add a message to the chat display
    function addMessageToDisplay(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        if (sender === 'user') {
            messageElement.classList.add('user-message');
            messageElement.textContent = message;
        } else if (sender === 'llm') {
            messageElement.classList.add('llm-message');
            messageElement.textContent = message;
        }

        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Function to handle sending a message
    function sendMessage() {
        const messageText = userInput.value.trim();

        if (messageText !== '') {
            addMessageToDisplay(messageText, 'user');
            userInput.value = ''; 

            const llmResponse = getLlmResponse(messageText);
            
            setTimeout(() => {
                addMessageToDisplay(llmResponse, 'llm'); 
            }, 500 + Math.random() * 500);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial greeting - personalized if name is known from previous session
    let initialGreeting = getRandomResponse(knowledgeBase.greetings);
    const storedName = getUserName();
    if (storedName) {
        initialGreeting += ` Welcome back, ${storedName}!`;
    } else {
        initialGreeting += " Feel free to tell me your name!";
    }
    addMessageToDisplay(initialGreeting, 'llm');
});
