$(function () {
    const socket = io();
    const $form = $('form');
    const $button = $('button');
    const $messageInput = $('#m');

    $form.submit(function(e) {
        e.preventDefault();
        
        const msg = $messageInput.val();
        const nick = $('#nickname').val() || 'Anonymous';

        if (msg.trim() !== "") {
            socket.emit('chat message', { nickname: nick, message: msg });
            $messageInput.val('');

            // Disable button for 500ms to prevent double-clicks
            $button.prop('disabled', true);
            setTimeout(() => { $button.prop('disabled', false); }, 500);
        }
        return false;
    });

    socket.on('chat message', function(data) {
        const $msgElement = $('<p>').append(
            $('<strong>').text(data.nickname + ": "),
            $('<span>').text(data.message)
        );
        $('#messages').append($msgElement);
        const chatWindow = document.getElementById('chat-window');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });
});