//server.js
const express =require('express');
const app = express();

app.use(express.json());

// Create an HTTP server
app.post('/', (req, res) => {
    
// Print the entire request body
    console.log(req.body.payload);
    res.send('OK');
});

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});