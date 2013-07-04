// Include all dependencies
var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    gpio = require('pi-gpio'),
    crypto = require('crypto'),
    async = require('async'),
    app = module.exports = express.createServer(),
    io = sio.listen(app);

// Constants
var LIGHT_PIN = 11;

// Configuration
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

// Routes
app.get('/', routes.index);

// Start the server
app.listen(3000);
console.log('Listening on port %d', app.address().port);

var light = {};
light.init = function() {
    async.parallel([
        gpio.open(LIGHT_PIN)
    ]);
};

light.turnOn = function() {
    console.log("Turn on");
    async.parallel([
        gpio.write(LIGHT_PIN, 1)
    ]);
};

light.turnOff = function() {
    console.log("Turn off");
    async.parallel([
        gpio.write(LIGHT_PIN, 0)
    ]);
};

// Sockets
io.sockets.on('connection', function(socket) {
    socket.on('turnOn', light.turnOn);
    socket.on('turnOff', light.turnOff);
});

light.init();

