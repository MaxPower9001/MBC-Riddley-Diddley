// Ein Hoch auf Ecmascript 6 !!!!!!
//import { Spieler } from './models/Spieler.js';
//import { Spiel } from './models/Spiel.js';
module.exports = {
    init: function(server) {
        var os = require("os");
        var _Spieler = require('./models/Spieler.js');
        var _Spiel = require('./models/Spiel.js');
        var _Spielzug = require('./models/Spielzug.js');
        var _Spielmodus = require('./models/Spielmodus.js');
        var _Spielinfo = require('./models/nachrichtenTypen/Spielinfo.js');
        var _SpielGestartet = require('./models/nachrichtenTypen/SpielGestartet.js');
        var _SpielBeendet = require('./models/nachrichtenTypen/SpielBeendet.js');
        var _Aktion = require('./models/nachrichtenTypen/Aktion.js');
        var spielTimer = require('./models/SpielTimer.js').spielTimer;

        // var express = require('express');
        // var app = express();
        //var server = require('http').Server(app);
        var io = require('socket.io')(require('http').Server(server));

        var d = new Date();
        var time;

        var spiel = new _Spiel.Spiel();

        console.log("We are great and our name is: " + os.hostname());

        spielTimer.on('spiel_timeout', function () {
            spielBeenden();
        });

        function spielBeenden() {
            io.emit('spiel_beendet', new _SpielBeendet.SpielBeendet("tolle statistik"));
            console.log("Game Over");
            spiel = new _Spiel.Spiel();
        }

        io.on('connection', function (socket) {
            console.log("Ein neuer Spieler ist im Haus");
            // Ein neuer Spieler möchte dem Spiel beitreten
            var spieler = new _Spieler.Spieler();
            spieler.name = "Spatzl_" + spiel.spieler.length;
            spiel.spieler = spieler;
            // Sende Spieler seinen Spielernamen und alle möglichen Spielmodi
            var spielinfo = new _Spielinfo.Spielinfo(spieler.name, [_Spielmodus.standard, _Spielmodus.schwierig]);
            socket.emit('spielinfo', new _Spielinfo.Spielinfo(spieler.name, _Spielmodus.spielmodi));

            socket.on('spielinfo', function (spielinfo) {
                //console.log("irgendwas ist passiert: " + spielinfo.spielmodi[0].schwierigkeit);
                // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
                // Spiel kann erstellt werden und der Spielmodus dort gesetzt werden
                spiel.spielmodus = spielinfo.spielmodi[0];
                // TODO setup game, start timer etc...
                spiel.starteSpiel();
                io.emit('spiel_gestartet', new _SpielGestartet.SpielGestartet(spiel.spieler.length))

                // TODO Nicht nur an einen Socket emiten sondern entsprechend dem Spielmodus
                //socket.emit('aktion', new _Aktion.Aktion(spiel.spieler[spiel.spieler.length],))

                time = d.getTime();
                console.log("Interval started at: " + time);
                ;
            });

            socket.on('spiel_beenden', function () {
                spielBeenden();
            });

            socket.on('aktion', function (aktionNachricht) {
                // Spielzug erstellen und Spieler zuordnen
                // var spielzug = new _Spielzug.constructor(aktionNachricht.typ,this.spiel.aktuelleAktion,);
                // Jemand hat eine Aktion gesendet
                // Es muss geprüft werden ob es der richtige Absender war und die richtige Aktion
            });


        });
    }
};