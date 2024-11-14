//server.js
const express = require('express');
const app = express();
const { getChatBotToken } = require('./token'); // Import getChatbotToken
const { sendChatToZoom } = require('./sendMessage'); // Import sendChatToZoom

app.use(express.json());

// Create an HTTP server
app.post('/', async (req, res) => {
    // Print the incoming webhook
    console.log("Received webhook payload:");
    console.log(req.body.payload);
    
    try {
        // Get token from Zoom
        const token = await getChatBotToken();
        // Prepare the message payload
        const payload = {
            toJid: req.body.payload.toJid,
            userJid: req.body.payload.userJid
        };

        // Send a message back to Zoom
        await sendChatToZoom(token, payload);
        res.send('OK');
    } 
    catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Error processing webhook.');
    }
});

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});