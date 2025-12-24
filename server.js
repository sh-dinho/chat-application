const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public'));

let numUsers = 0;

io.on('connection', (socket) => {
    numUsers++;
    console.log(`User connected. Total: ${numUsers}`);

    // Listen for messages
    socket.on('chat message', (data) => {
        // Broadcast the message along with the nickname
        io.emit('chat message', {
            nickname: data.nickname,
            message: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        numUsers--;
        console.log(`User disconnected. Total: ${numUsers}`);
    });
});

http.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});