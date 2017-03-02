// Ein Hoch auf Ecmascript 6 !!!!!!
import { Spieler } from './spieler';
import { Spiel } from './spiel';
import {SpielGestartet, SpielBeendet, Aktion, SpielerInfo, Spielmodus, SpielVerloren} from './nachrichtentypen';
import {hostname} from 'os';
import Socket = SocketIO.Socket;
import * as sio from 'socket.io';
import Server = SocketIO.Server;
import {
    AktionsTyp, ISpielmodus, IAktion, ISpielGestartet, ISpielBeendet,
    ISpielerInfo, ISpielVerloren, IUngueltigeAktionOderTimeout
} from "../api/nachrichtentypen.interface";
import {FrontendConnectionServiceInterface} from "./frontend-connection.service.interface";

export class GameserverWebsocketFacade implements FrontendConnectionServiceInterface {

    private websocketServer : Server;
    private httpServer: any;
    private fernseherSocket: Socket;
    // Map für Spielername <=> Socket in Vor- und Rückrichtung
    // { SpielerName1 => Socket1, SpielerName2 => Socket2, Socket1 => SpielerName1, Socket2 => SpielerName2 }
    private spielerSockets;
    private spiel : Spiel;


    constructor(httpserver) {
        this.httpServer = httpserver;
        this.websocketServer = sio(this.httpServer);
        this.spiel = new Spiel();
        this.spielerSockets = {};
        this.websocketServer.on('connection', (socket : Socket) => this.onConnection(socket));
        this.spiel.spielrundeAusgelaufen$.subscribe((spieler : Spieler) => this.onSpielrundeAusgelaufen(spieler));
        console.log("GameserverRestFacade started, We are: " + hostname());
    }

    private getSocketBySpieler(spieler : Spieler) : Socket{
        return this.spielerSockets[spieler.name];
    }

    private getSocketBySpielername(spielername : string) : Socket{
        return this.spielerSockets[spielername];
    }

    private getSpielername(socket : Socket) : string {
        return this.spielerSockets[socket.conn.id];
    }

    private addSpieler(socket : Socket) : ISpielerInfo {
        let neuerSpieler : Spieler = this.spiel.addSpieler();
        this.spielerSockets[neuerSpieler.name] = socket;
        this.spielerSockets[socket.conn.id] = neuerSpieler.name;
        return new SpielerInfo(neuerSpieler.name);
    }

    private setFernseher(socket : Socket) : void {
        this.fernseherSocket = socket;
    }

    private setupSpielerSocket(socket : Socket) {
        socket.on('spielmodus', (spielmodus : Spielmodus) => this.onSpielmodus(spielmodus));
        socket.on('spiel_beendet', (spielBeendet : SpielBeendet) => this.onSpielBeendet(spielBeendet));
        socket.on('aktion', (aktion : Aktion) => {
            this.onAktion(new Aktion(this.getSpielername(socket),aktion.typ));
        });
        socket.on('disconnect',() => console.log("Player disconnected"));
        socket.on('reconnect', () => console.log("Player reconnected"));
    }

    private starteNeueSpielrunde() : void {
        console.log("starte neue Spielrunde");
        let nextAktion : IAktion = this.spiel.erstelleSpielrunde();
        if(nextAktion) {
            this.sendAktion(nextAktion);
            this.spiel.starteSpielrunde();
        } else {
            let spielBeendet : ISpielBeendet = this.spiel.beendeSpiel();
            this.sendSpielBeendet(spielBeendet);
        }
    }

    /*
     * Wird aufgerufen wenn die Spielrunde ausgelaufen ist und währenddessen keine gültige Aktion vom Spieler gesendet wurde
     * @property {Spieler} spieler
     *           Spieler der in der vergangenen Spielrunde eine Aktion hätte durchführen sollen
     */
    onSpielrundeAusgelaufen(spieler : Spieler ) {
        console.log("Die aktuelle Spielrunde ist ausgelaufen, keine gültige Aktion erhalten, Spieler " + spieler.name + "hat es verbockt");
        let darfWeiterspielen : boolean = this.spiel.verringereLeben(spieler.name);
        if(darfWeiterspielen) {
            this.starteNeueSpielrunde();
        } else {
            this.spiel.removeSpieler(spieler);
            this.sendSpielVerloren(new SpielVerloren(spieler.name));
        }

    }

    onConnection(socket : Socket) {
        // GameserverRestFacade und Fernseher View werden auf dem gleichen Host betrieben, daher haben diese die gleiche IP Adresse
        // Der erste Client der von localhost der einen Socket öffnet wird daher als Fernseher angesehen
        if(this.spiel.spieleranzahl() == 0
            && (socket.conn.remoteAddress === "127.0.0.1" || socket.conn.remoteAddress === "localhost")
            && !this.fernseherSocket) {
            // Der Fernseher hat sich verbunden
            console.log("Hallo Fernseher! ip: " + socket.conn.remoteAddress);
            this.setFernseher(socket);
        } else {
            // Ein neuer Spieler möchte dem Spiel beitreten
            let spielerInfo : ISpielerInfo = this.addSpieler(socket);
            console.log("Hallo Spieler! ip: " + socket.conn.remoteAddress + " von nun an bist du bekannt unter dem Namen " + spielerInfo.username);

            // Sende Spieler seinen Spielernamen
            this.sendSpielerInfo(spielerInfo);

            // Setup socket event handler
            this.setupSpielerSocket(socket);
        }
    }

    onSpielBeendet(spielBeendet : ISpielBeendet) : void {
        spielBeendet = this.spiel.beendeSpiel();
        this.sendSpielBeendet(spielBeendet);
    }

    onAktion(aktion: IAktion): void {
        console.log("Aktion erhalten: " + aktion);
        if(!this.spiel.istAktionImAktuellenSpielstatusVerwertbar(aktion)) {
            console.log("Aktion wird verworfen");
            return;
        }
        let istGueltig =  this.spiel.pruefeErhalteneAktion(aktion);
        if(istGueltig) {
            this.starteNeueSpielrunde();
        } else {
            let darfWeiterspielen : boolean = this.spiel.verringereLeben(aktion.spieler);
            if(!darfWeiterspielen) {
                this.sendSpielVerloren(new SpielVerloren(aktion.spieler));
            }
        }
    }

    onSpielmodus(spielmodus : Spielmodus) : void {
        // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
        // Spiel kann erstellt und der Spielmodus entsprechend gesetzt werden
        let spielGestartet : ISpielGestartet = this.spiel.erstelleSpiel(spielmodus);
        this.sendSpielGestartet(spielGestartet);

        // Sende erste Aktion des Spiels, nachfolgende Aktionen werden durch onAktion ausgelöst
        let nextAktion : IAktion = this.spiel.erstelleSpielrunde();
        this.sendAktion(nextAktion);
        this.spiel.starteSpielrunde();
    }

    sendAktion(aktion: IAktion): void {
        console.log("Aktionstyp" + aktion.typ + " geht raus an Spieler " + aktion.spieler);
        this.fernseherSocket.emit('aktion', aktion);
    }

    sendSpielGestartet(spielGestartet: ISpielGestartet): void {
        this.websocketServer.emit('spiel_gestartet', spielGestartet);
    }

    sendSpielBeendet(spielBeendet: ISpielBeendet): void {
        this.websocketServer.emit('spiel_beendet', spielBeendet);
    }

    sendSpielerInfo(spielerInfo: ISpielerInfo): void {
        let socket : Socket = this.getSocketBySpielername(spielerInfo.username);
        socket.emit('spielerinfo', spielerInfo);
    }

    sendSpielVerloren(spielVerloren: ISpielVerloren): void {
        let socket : Socket = this.getSocketBySpielername(spielVerloren.spieler);
        this.fernseherSocket.emit('spiel_verloren', spielVerloren);
        socket.emit('spiel_verloren', spielVerloren);
    }

    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
        this.fernseherSocket.emit('ungueltige_aktion_oder_timeout', ungueltigeAktionOderTimeout);
    }


}
