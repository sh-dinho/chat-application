var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
// creating server
http.listen(port, function () {
    console.log('listening on port', port, new Date());
});

var numUser = 0;
var username = [];
app.use(express.static('public'));

//listen to chat
io.on('connection', function (socket) {
    username = socket.id;
    numUser += 1;

    console.log('unique user id is ', socket.id);
    console.log('user connected', numUser);

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log('message....', msg);
    });

    //disconnection
    socket.on('disconnect', function () {
        console.log(username, ' User disconnected');
        numUser--;
        if(username){
            io.emit('chat', {
                time: new Date(),
                username: username,
                message: 'leaving chat..'
            })
        }
    });
});
