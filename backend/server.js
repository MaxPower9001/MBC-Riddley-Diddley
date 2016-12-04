// Ein Hoch auf Ecmascript 6 !!!!!!
//import { Spieler } from './models/Spieler.js';
//import { Spiel } from './models/Spiel.js';
var _Spieler = require('./models/Spieler.js');
var _Spiel = require('./models/Spiel.js');
var _Spielmodus = require('./models/Spielmodus.js');
var _Spielinfo = require('./models/nachrichtenTypen/Spielinfo.js');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const PORT=13337;
var spiel = new _Spiel.Spiel();

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
    // Ein neuer Spieler möchte dem Spiel beitreten
    var spieler = new _Spieler.Spieler();
    spieler.name = "Spatzl_"+spiel.spieler.length;
    spiel.spieler = spieler;
    // Sende Spieler seinen Spielernamen und alle möglichen Spielmodi
    socket.emit('spielinfo', new _Spielinfo.Spielinfo(spieler.name, _Spielmodus.standard));

    socket.on('spielinfo', function(spielinfo) {

    });

    socket.on('spiel_beenden', function(data) {
        //TODO
    });

    socket.on('aktion', function(data) {
        //TODO
    });


});