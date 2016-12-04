import Spieler from 'models/Spieler.js';
import Spiel from 'models/Spiel.js';
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// var Spieler = require('models/Spieler.js');
// var Spiel = require('models/Spiel.js');

const PORT=13337;
spiel = new Spiel();

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
    console.log(Spielmodus);
    // socket.emit('irgendwasVomServer', { nachricht: 'Servus vom Server', timestamp: new Date().getTime() });
    //
    //
    // socket.on('irgendwasVonDenClients', function (data) {
    //     console.log("Nachricht eingetroffen, Von: " + data.quelle + " Uhrzeit: " + data.timestamp)
    // });
    // socket.on('syncTimeRequest', function() {
    //     socket.emit('syncTimeResponse');
    // });

    // Ein neuer Spieler möchte dem Spiel beitreten
    spieler = new Spieler();
    spieler.name("Spatzl_"+spiel.spieler.length());
    spiel.spieler(spieler);
    // Sende Spieler seinen Spielernamen und alle möglichen Spielmodi
    socket.emit('spielinfo', new Spielmodus(spieler.name, Spielmodus));

    socket.on('spielinfo', function(spielinfo) {

    });

    socket.on('spiel_beenden', function(data) {
        //TODO
    });

    socket.on('aktion', function(data) {
        //TODO
    });


});