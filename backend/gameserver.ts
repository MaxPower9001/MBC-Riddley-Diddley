// Ein Hoch auf Ecmascript 6 !!!!!!
import { Spieler } from './spieler';
import { Spiel } from './spiel';
import {SpielGestartet, SpielBeendet, Aktion, SpielerInfo, Spielmodus} from './nachrichtentypen';
import {hostname} from 'os';
import Socket = SocketIO.Socket;
import * as sio from 'socket.io';
import Server = SocketIO.Server;
import {AktionsTyp} from "../api/nachrichtentypen.interface";

export class Gameserver {

    private websocketServer : Server;
    private httpServer: any;
    private websocketFernseher: Socket;
    // { SpielerName1 => Socket1, SpielerName2 => Socket2, Socket1 => SpielerName1, Socket2 => SpielerName2 }
    private spielerToSocketMap;
    private spiel : Spiel;


    constructor(httpserver) {
        this.httpServer = httpserver;
        this.websocketServer = sio(this.httpServer);
        this.spiel = new Spiel();
        this.spielerToSocketMap = {};
        this.websocketServer.on('connection', (socket : Socket) => this.onConnection(socket));
        this.spiel.spielBeendet$.subscribe(() => this.spielBeenden());
        this.spiel.neueSpielrunde$.subscribe(() => this.sendeNeueAktion());
        console.log("Gameserver started, We are: " + hostname());
    }

    private getSocket(spieler : Spieler) {
        return this.spielerToSocketMap[spieler.name];
    }

    private getSpieler(socket : Socket) {
        return this.spielerToSocketMap[socket.conn.id];
    }

    private addSpieler(socket : Socket) : Spieler {
        let neuerSpieler : Spieler = this.spiel.addSpieler();
        this.spielerToSocketMap[neuerSpieler.name] = socket;
        this.spielerToSocketMap[socket.conn.id] = neuerSpieler;
        return neuerSpieler;
    }

    private addFernseher(socket : Socket) : void {
        this.websocketFernseher = socket;
    }

    spielBeenden() : void {
        this.websocketServer.emit('spiel_beendet', new SpielBeendet());
        console.log("Game Over");
    }

    onConnection(socket : Socket) {
        // Gameserver und Fernseher View werden auf dem gleichen Host betrieben, daher haben diese die gleiche IP Adresse
        // Der erste Client der von localhost der einen Socket öffnet wird daher als Fernseher angesehen
        if(this.spiel.spieleranzahl() == 0
            && (socket.conn.remoteAddress === "127.0.0.1" || socket.conn.remoteAddress === "localhost")
            && !this.websocketFernseher) {
            // Der Fernseher hat sich verbunden
            console.log("Hallo Fernseher! ip: " + socket.conn.remoteAddress);
            this.addFernseher(socket);
        } else {
            // Ein neuer Spieler möchte dem Spiel beitreten
            console.log("Hallo Spieler! ip: " + socket.conn.remoteAddress);
            let neuerSpieler = this.addSpieler(socket);

            // Sende Spieler seinen Spielernamen
            socket.emit('spielerinfo', new SpielerInfo(neuerSpieler.name));

            // Setup socket event handler
            socket.on('spielmodus', (spielmodus : Spielmodus) => this.onSpielmodus(spielmodus));
            socket.on('spiel_beendet', (spielBeendet : SpielBeendet) => this.onSpielBeendet(spielBeendet));
            socket.on('aktion', (aktion : Aktion) => this.onAktion(aktion, this.getSpieler(socket)));
            socket.on('disconnect',() => console.log("Player disconnected"));
            socket.on('reconnect', () => console.log("Player reconnected"));
        }
    }

    onSpielBeendet(spielBeendet : SpielBeendet) : void {
        this.spiel.beendeSpiel();
    }

    onAktion(aktion : Aktion, spieler : Spieler) : void {
        console.log("Aktion erhalten" + aktion);
        // Jemand hat eine Aktion gesendet
        // Es muss geprüft werden ob es der richtige Absender war und die richtige Aktion
        this.spiel.pruefeErhalteneAktion(aktion.typ,spieler);
    }

    onSpielmodus(spielmodus : Spielmodus) : void {
        // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
        // Spiel kann erstellt und der Spielmodus entsprechend gesetzt werden
        this.spiel.starteSpiel(spielmodus);
        this.websocketServer.emit('spiel_gestartet', new SpielGestartet(this.spiel.spielmodus, this.spiel.getSpielernamen()));

        // Sende erste Aktion des Spiels, nachfolgende Aktionen werden durch onAktion ausgelöst
        this.sendeNeueAktion();
    }

    sendeNeueAktion() : void {
        let nextSpieler : Spieler = this.spiel.getNextSpieler();
        let nextAktionsTyp : AktionsTyp = this.spiel.getNextAktionsTyp();
        console.log("als nächstes ist an der Reihe: "+ nextSpieler + " mit der Aktion " + nextAktionsTyp);
        let nextAktion : Aktion = new Aktion(nextSpieler.name,nextAktionsTyp);
        // Sende Aktion an den Spieler der an der Reihe ist
        this.getSocket(nextSpieler).emit('aktion', nextAktion);
        // Sende Aktion zusätzlich an den Fernseher
        this.websocketFernseher.emit('aktion', nextAktion);
    }




}
