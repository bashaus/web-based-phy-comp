(function($) {
    var socket = io.connect();

    $('.turn-on').click(function() {
        socket.emit('turnOn');
    });

    $('.turn-off').click(function() {
        socket.emit('turnOff');
    });
})(jQuery);

