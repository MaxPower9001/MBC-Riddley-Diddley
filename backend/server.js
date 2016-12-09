// Ein Hoch auf Ecmascript 6 !!!!!!
//import { Spieler } from './models/Spieler.js';
//import { Spiel } from './models/Spiel.js';
var os = require("os");
var _Spieler = require('./models/Spieler.js');
var _Spiel = require('./models/Spiel.js');
var _Spielzug = require('./models/Spielzug.js');
var _Spielmodus = require('./models/Spielmodus.js');
var _Spielinfo = require('./models/nachrichtenTypen/Spielinfo.js');
var _SpielGestartet = require('./models/nachrichtenTypen/SpielGestartet.js');
var _SpielBeendet = require('./models/nachrichtenTypen/SpielBeendet.js');
var spielTimer = require('./models/SpielTimer.js').spielTimer;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const PORT=13337;
var spiel = new _Spiel.Spiel();

console.log("We are great and our name is: " + os.hostname());


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

spielTimer.on('spiel_timeout', function() {
    spielBeenden();
});

function spielBeenden(){
    io.emit('spiel_beendet', new _SpielBeendet.SpielBeendet("tolle statistik"));
    console.log('zu spät, das spiel ist aus');
    spiel = new _Spiel.Spiel();
    // io.sockets.disconnect();
    // var clients = io.sockets.sockets;
    // for(var c in clients)
    // {
    //     c.disconnect(true);
    // }
}

io.on('connection', function (socket) {
    // Ein neuer Spieler möchte dem Spiel beitreten
    var spieler = new _Spieler.Spieler();
    spieler.name = "Spatzl_"+spiel.spieler.length;
    spiel.spieler = spieler;
    // Sende Spieler seinen Spielernamen und alle möglichen Spielmodi
    var spielinfo = new _Spielinfo.Spielinfo(spieler.name, [_Spielmodus.standard, _Spielmodus.schwierig]);
    socket.emit('spielinfo', new _Spielinfo.Spielinfo(spieler.name, _Spielmodus.spielmodi));

    socket.on('spielinfo', function(spielinfo) {
        //console.log("irgendwas ist passiert: " + spielinfo.spielmodi[0].schwierigkeit);
        // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
        // Spiel kann erstellt werden und der Spielmodus dort gesetzt werden
        spiel.spielmodus = spielinfo.spielmodi[0];
        // TODO setup game, start timer etc...
        spiel.starteSpiel();
        io.emit('spiel_gestartet', new _SpielGestartet.SpielGestartet(spiel.spieler.length));
    });

    socket.on('spiel_beenden', spielBeenden);

    socket.on('aktion', function(aktionNachricht) {
        // Jemand hat eine Aktion gesendet
        // Es muss geprüft werden ob es der richtige Absender war und die richtige Aktion
    });


});