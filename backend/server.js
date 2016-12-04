var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(13337);

app.get('/riddley', function (req, res) {
    res.sendfile(__dirname + '/public/riddley/client.html');
});

app.get('/diddley', function (req, res) {
    res.sendfile(__dirname + '/public/diddley/server.html');
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});