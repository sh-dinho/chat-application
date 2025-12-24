const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); // New dependency
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// 1. HTTP Rate Limiting (Prevents flooding the website itself)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// 2. Security Headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "https://code.jquery.com"],
                "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
                "font-src": ["'self'", "https://fonts.gstatic.com"],
            },
        },
    })
);

app.use(express.static('public'));

// 3. Socket.io logic with Message Rate Limiting
const messageCooldowns = new Map();

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        const now = Date.now();
        const lastMessageTime = messageCooldowns.get(socket.id) || 0;

        // Prevent sending messages faster than once every 500ms
        if (now - lastMessageTime < 500) {
            return socket.emit('chat message', {
                nickname: 'System',
                message: 'You are sending messages too fast! Please wait.',
                time: new Date().toLocaleTimeString()
            });
        }

        messageCooldowns.set(socket.id, now);

        io.emit('chat message', {
            nickname: data.nickname,
            message: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });

    socket.on('disconnect', () => {
        messageCooldowns.delete(socket.id);
    });
});

http.listen(port, () => {
    console.log(`Secured & Rate-Limited Server running on port ${port}`);
});