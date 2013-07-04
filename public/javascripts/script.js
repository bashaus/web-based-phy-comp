(function($) {
    var socket = io.connect();

    $('.turn-on').click(function() {
        socket.emit('turnOn');
    });

    $('.turn-off').click(function() {
        socket.emit('turnOff');
    });

    socket.on('click', function(data) {
        alert(data);
    });
})(jQuery);