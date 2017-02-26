// Ein Hoch auf Ecmascript 6 !!!!!!
import { Spieler } from './spieler';
import { Spiel } from './spiel';
import {Spielzug} from './spielzug';
import {spielmodi, schwierig, standard} from './spielmodus';
import {SpielGestartet, SpielBeendet, Spielinfo, Aktion} from './nachrichtentypen';
import {hostname} from 'os';
import Socket = SocketIO.Socket;
import * as sio from 'socket.io';
import Server = SocketIO.Server;

export class Gameserver{

    spiel : Spiel;
    websocketServer : Server;

    constructor(httpserver) {
        this.websocketServer = sio(httpserver);
        this.spiel = new Spiel();
        this.init();
    }

    spielBeenden() : void {
        this.websocketServer.emit('spiel_beendet', new SpielBeendet("tolle statistik"));
        console.log("Game Over");
    }

    init() : void {
        // var express = require('express');
        // var app = express();
        // var httpserver = require('http').Server(server);
        // httpserver.listen(8080);
        console.log("We are great and our name is: " + hostname());

        let gs = this;

        this.websocketServer.on('connection', function (socket : Socket) {
            console.log("Ein neuer Spieler ist im Haus");
            // Ein neuer Spieler möchte dem Spiel beitreten
            let spieler : Spieler = new Spieler();
            spieler.name = "Spatzl_" + gs.spiel.spieleranzahl();
            gs.spiel.addSpieler(spieler);

            // Sende Spieler seinen Spielernamen und alle möglichen Spielmodi
            socket.emit('spielinfo', new Spielinfo(spielmodi, spieler.name));

            socket.on('spielinfo', function (spielinfo) {
                // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
                // Spiel kann erstellt werden und der Spielmodus dort gesetzt werden
                gs.spiel.spielmodus = spielinfo.spielmodi[0];
                // TODO setup game, start timer etc...
                gs.spiel.starteSpiel();
                gs.spiel.spielTimer.timer.on('spiel_timeout', () => gs.spielBeenden());
                gs.websocketServer.emit('spiel_gestartet', new SpielGestartet(gs.spiel.spieleranzahl()));

                // TODO Nicht nur an einen Socket emiten sondern entsprechend dem Spielmodus
                gs.websocketServer.emit('aktion', new Aktion(gs.spiel.spieler[Math.floor(Math.random() * gs.spiel.spieler.length)].name,Aktion.getZufallsAktion(),0));

                console.log("Interval started at: " + (new Date()).getTime());

            });

            socket.on('spiel_beenden', gs.spielBeenden);

            socket.on('aktion', function (aktionNachricht) {
                console.log("Aktion erhalten" + aktionNachricht);
                // Spielzug erstellen und Spieler zuordnen
                // var spielzug = new _Spielzug.constructor(aktionNachricht.typ,this.spiel.aktuelleAktion,);
                // Jemand hat eine Aktion gesendet
                // Es muss geprüft werden ob es der richtige Absender war und die richtige Aktion
            });


        });
    }
}
