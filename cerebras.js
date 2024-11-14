// cerebras.js
const axios = require('axios');
const { getChatBotToken } = require('./token');
const { sendChatToZoom } = require('./sendMessage');

// Store conversation memory
let messages = [
    { role: 'system', content: 'You are a helpful assistant.' }
];

async function callCerebrasAPI(payload) {
    try {
        // Add user message to history
        messages.push({ role: 'user', content: payload.cmd });

        const requestData = {
            model: 'llama3.1-8b',
            messages: messages,  // Send all messages for context
            max_tokens: 500
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`
        };

        const response = await axios.post(
            'https://api.cerebras.ai/v1/chat/completions',
            requestData,
            { headers }
        );

        const message = response.data.choices[0].message.content;
        
        // Add bot response to history
        messages.push({ role: 'assistant', content: message });

        // Keep memory size manageable
        if (messages.length > 10) {
            messages = [
                messages[0],  // Keep system message
                ...messages.slice(-9)  // Keep last 9 messages
            ];
        }

        const chatbotToken = await getChatBotToken();
        await sendChatToZoom(chatbotToken, message, payload);

    } catch (error) {
        console.error('Error:', error.message);
        const chatbotToken = await getChatBotToken();
        await sendChatToZoom(
            chatbotToken,
            "Sorry, I encountered an error.",
            payload
        );
    }
}

module.exports = { callCerebrasAPI };