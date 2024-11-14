// cerebras.js
// This file handles communication with the Cerebras API

const axios = require('axios');
const { getChatbotToken } = require('./token');
const { sendChatToZoom } = require('./sendMessage');

// Simple function to call Cerebras API
async function callCerebrasAPI(payload) {
    try {
        // Step 1: Prepare the data for Cerebras API
        // We're using a simple message structure without maintaining conversation history
        const requestData = {
            model: 'llama3.1-8b',  // Specify which model to use
            messages: [
                // Set the AI's role
                { role: 'system', content: 'You are a helpful assistant.' },
                // Add the user's message
                { role: 'user', content: payload.cmd }
            ],
            max_tokens: 500  // Limit the response length
        };

        console.log('Preparing to call Cerebras API with message:', payload.cmd);

        // Step 2: Set up the API request headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`
        };

        // Step 3: Make the API call to Cerebras
        console.log('Calling Cerebras API...');
        const response = await axios.post(
            'https://api.cerebras.ai/v1/chat/completions',
            requestData,
            { headers }
        );

        // Step 4: Extract the response message
        const message = response.data.choices[0].message.content;
        console.log('Received response from Cerebras:', message);

        // Step 5: Send the response back to Zoom
        console.log('Getting Zoom token to send response...');
        const chatbotToken = await getChatbotToken();
        
        console.log('Sending response to Zoom...');
        await sendChatToZoom(chatbotToken, message, payload);

    } catch (error) {
        // Handle any errors that occur
        console.error('Error in Cerebras API call:', error.message);
        
        // Send an error message back to the user
        try {
            const chatbotToken = await getChatbotToken();
            await sendChatToZoom(
                chatbotToken,
                "Sorry, I encountered an error processing your request.",
                payload
            );
        } catch (sendError) {
            console.error('Error sending error message:', sendError);
        }
    }
}

module.exports = { callCerebrasAPI };