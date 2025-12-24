$(function () {
    const socket = io();
    const $messageInput = $('#m');
    const $nicknameInput = $('#nickname');
    const $messages = $('#messages');

    $('form').submit(function(e) {
        e.preventDefault();
        
        const msg = $messageInput.val();
        const nick = $nicknameInput.val() || 'Anonymous';

        if (msg.trim() !== "") {
            // Send object with nickname and message
            socket.emit('chat message', {
                nickname: nick,
                message: msg
            });
            $messageInput.val('');
        }
        return false;
    });

    socket.on('chat message', function(data) {
        // Create the message element
        const $msgElement = $('<p>').append(
            $('<strong>').text(data.nickname + ": "),
            $('<span>').text(data.message),
            $('<small>').text(" " + data.time).css('color', '#ccc', 'margin-left', '10px')
        );

        $messages.append($msgElement);
        
        // Auto-scroll to bottom
        const chatWindow = document.getElementById('chat-window');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });
});