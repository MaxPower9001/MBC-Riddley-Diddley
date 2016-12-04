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

app.get('/smartphone', function (req, res) {
    console.log("smartphone.html served");
    res.sendFile(__dirname + '/public/smartphone/smartphone.html');
});

app.get('/fernseher', function (req, res) {
    console.log("fernseher.html served");
    res.sendFile(__dirname + '/public/fernseher/fernseher.html');
});


io.on('connection', function (socket) {
    socket.emit('irgendwasVomServer', { nachricht: 'Servus vom Server' });
    socket.on('irgendwasVonDenClients', function (data) {
        console.log(data);
    });
});