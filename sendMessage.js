//sendMessage.js
const axios = require('axios');

async function sendChatToZoom(chatbotToken, message, payload) {
    const data = {
        'robot_jid': process.env.ZOOM_BOT_JID,
        'to_jid': payload.toJid,
        'user_jid': payload.userJid,
        'content': {
            'head': {
                'text': 'Cerebras-Very-Fast-Chatbot',
            },
            'body': [{
                'type': 'message',
                'text': message,
            }],
        },
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + chatbotToken,
    };
    try {
        const response = await axios.post('https://api.zoom.us/v2/im/chat/messages', data, { headers });
        console.log('Successfully sent chat to Zoom.', response.data);
    } catch (error) {
        console.error('Error sending chat to Zoom.', error.response ? error.response.data : error);
    }
}

module.exports = { sendChatToZoom };