//server.js
require('dotenv').config();  // Load environment variables
const express = require('express');
const { callCerebrasAPI } = require('./cerebras');  // Import Cerebras function

const app = express();
const { getChatBotToken } = require('./token'); // Import getChatBotToken
const { sendChatToZoom } = require('./sendMessage'); // Import sendChatToZoom

app.use(express.json());

// Create an HTTP server
app.post('/', async (req, res) => {
    // Log incoming request for debugging
    console.log('Received webhook payload:');
    console.log(req.body.payload);
    
    try {
        // Check if this is a chat message
        // bot_notification is the event type for chat messages
        if (req.body.event === 'bot_notification' && req.body.payload.cmd) {
            console.log('Processing chat message:', req.body.payload.cmd);
            
            // Send message to Cerebras and handle response
            await callCerebrasAPI(req.body.payload);
        } else {
            console.log('Ignoring non-chat event:', req.body.event);
        }
        
        // Always return OK to acknowledge receipt
        res.send('OK');
    } catch (error) {
        // Log any errors and return 500 status
        console.error('Error processing webhook:', error);
        res.status(500).send('Error processing webhook');
    }
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});