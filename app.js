var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    app = module.exports = express.createServer(),
    io = sio.listen(app),
    Gpio = require('onoff').Gpio;

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.get('/', routes.index);
app.listen(3000);

var light = { PIN : 22, GPIO : null };
var button = { PIN : 23, GPIO : null };

light.init = function() {
    light.GPIO = new Gpio(light.PIN, 'out');
};

light.turnOn = function() {
    light.GPIO.write(1);
};

light.turnOff = function() {
    light.GPIO.write(0);
};

io.sockets.on('connection', function(socket) {
    socket.on('turnOn', light.turnOn);
    socket.on('turnOff', light.turnOff);

    button.GPIO = new Gpio(button.PIN, 'in', 'both');
    button.GPIO.watch(function(err, val) {
        if (err) throw err;
        socket.emit('click', val);
    });
});

light.init();