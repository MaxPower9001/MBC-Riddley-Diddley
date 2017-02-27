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
    websocketFernseher: Socket;
    httpServer: any;

    constructor(httpserver) {
        this.httpServer = httpserver;
        this.websocketServer = sio(this.httpServer);
        this.spiel = new Spiel();
        this.init();
    }

    spielBeenden() : void {
        console.log("Game Over");
        this.websocketServer.emit('spiel_beendet', new SpielBeendet());

        // while(Object.keys(this.websocketServer.sockets.connected).length > 0)
        // {
        //     console.log("Waiting for players to disconnect...");
        //     console.log(Object.keys(this.websocketServer.sockets.connected).length);
        // }

        this.websocketFernseher = null;
        this.websocketServer = sio(this.httpServer);
        this.spiel = new Spiel();
        this.init();
    }

    init() : void {
        // var express = require('express');
        // var app = express();
        // var httpserver = require('http').Server(server);
        // httpserver.listen(8080);
        console.log("We are great and our name is: " + hostname());

        let gs = this;

        this.websocketServer.on('connection', function (socket : Socket) {
            // Gameserver und Fernseher View werden auf dem gleichen Host betrieben, daher haben diese die gleiche IP Adresse
            // Der erste Client der von localhost der einen Socket öffnet wird daher als Fernseher angesehen
            if(gs.spiel.spieleranzahl() == 0
                && (socket.conn.remoteAddress === "127.0.0.1" || socket.conn.remoteAddress === "localhost")
                && !gs.websocketFernseher) {
                console.log("Hallo Fernseher! ip: " + socket.conn.remoteAddress);
                gs.websocketFernseher = socket;

            } else {
                console.log("Hallo Spieler! ip: " + socket.conn.remoteAddress);
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

                    let nextAktion : Aktion = new Aktion(gs.spiel.getNextSpieler().name,Aktion.getZufallsAktion());
                    gs.websocketServer.emit('aktion', nextAktion);
                    gs.websocketFernseher.emit('aktion', nextAktion);

                });

                socket.on('disconnect',() => console.log("Player disconnected"));

                socket.on('reconnect', () => console.log("muthafuca tryin to reconnect"));

                socket.on('spiel_beenden', gs.spielBeenden);

                socket.on('aktion', function (aktion : Aktion) {
                    console.log("Aktion erhalten" + aktion);
                    // Spielzug erstellen und Spieler zuordnen
                    // var spielzug = new _Spielzug.constructor(aktionNachricht.typ,this.spiel.aktuelleAktion,);
                    // Jemand hat eine Aktion gesendet
                    // Es muss geprüft werden ob es der richtige Absender war und die richtige Aktion
                });

            }

        });
    }
}
