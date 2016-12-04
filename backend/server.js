var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const PORT=13337;

server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

app.use(express.static('public'));

app.get('/riddley', function (req, res) {
    console.log("client.html served");
    res.sendFile(__dirname + '/public/riddley/client.html');
});

app.get('/diddley', function (req, res) {
    console.log("server.html served");
    res.sendFile(__dirname + '/public/diddley/server.html');
});



io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});