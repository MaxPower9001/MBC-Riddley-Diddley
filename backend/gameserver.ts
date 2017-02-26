// Ein Hoch auf Ecmascript 6 !!!!!!
import { Spieler } from './spieler';
import { Spiel } from './spiel';
import {Spielzug} from './spielzug';
import {spielmodi, schwierig, standard} from './spielmodus';
import {SpielGestartet, SpielBeendet, Aktion, SpielerInfo, Spielmodus} from './nachrichtentypen';
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
        this.websocketServer.emit('spiel_beendet', new SpielBeendet());
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
            console.log("ip " + socket.conn.remoteAddress);

            // Ein neuer Spieler möchte dem Spiel beitreten
            let neuerSpieler : Spieler = gs.spiel.addSpieler();

            // Sende Spieler seinen Spielernamen
            socket.emit('spielerinfo', new SpielerInfo(neuerSpieler.name));

            socket.on('spielmodus', function (spielmodus: Spielmodus) {
                // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
                // Spiel kann erstellt und der Spielmodus entsprechend gesetzt werden
                gs.spiel.spielmodus = spielmodus;
                gs.spiel.starteSpiel();
                gs.spiel.spielTimer.timer.on('spiel_timeout', () => gs.spielBeenden());
                gs.websocketServer.emit('spiel_gestartet', new SpielGestartet(gs.spiel.spielmodus, gs.spiel.getSpielernamen()));

                // TODO Nicht nur an einen Socket emiten sondern entsprechend dem Spielmodus
                gs.websocketServer.emit('aktion', new Aktion(gs.spiel.spieler[Math.floor(Math.random() * gs.spiel.spieler.length)].name,Aktion.getZufallsAktion()));

                console.log("Interval started at: " + (new Date()).getTime());

            });

            socket.on('spiel_beenden', gs.spielBeenden);

            socket.on('aktion', function (aktion : Aktion) {
                console.log("Aktion erhalten" + aktion);
                // Spielzug erstellen und Spieler zuordnen
                // var spielzug = new _Spielzug.constructor(aktionNachricht.typ,this.spiel.aktuelleAktion,);
                // Jemand hat eine Aktion gesendet
                // Es muss geprüft werden ob es der richtige Absender war und die richtige Aktion
            });


        });
    }
}
