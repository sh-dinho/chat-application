$(function () {
    var socket = io();
    var message = document.getElementById('m');

    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg){
        $('#messages').append($('<p><strong>').text(msg)) + '</strong>' + '</p>';
    });
});
