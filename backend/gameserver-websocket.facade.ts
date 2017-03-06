import {Spieler} from "./spieler";
import {SpielBeendet, Aktion, SpielerInfo, Spielmodus} from "./nachrichtentypen";
import {hostname} from "os";
import * as sio from "socket.io";
import {createServer} from "http";
import {
    IAktion,
    ISpielGestartet,
    ISpielBeendet,
    ISpielerInfo,
    ISpielVerloren,
    IUngueltigeAktionOderTimeout
} from "../api/nachrichtentypen.interface";
import {FrontendConnectionServiceInterface} from "./frontend-connection.service.interface";
import {Gameserver} from "./gameserver";
import Socket = SocketIO.Socket;
import Server = SocketIO.Server;

export class GameserverWebsocketFacade implements FrontendConnectionServiceInterface{

    private gameserver : Gameserver;
    private websocketServer : Server;
    private httpServer: any;
    private fernseherSocket: Socket;
    // Map für Spieler <=> Socket in Vor- und Rückrichtung
    // { Spieler1.name => Socket1, Spieler2.name => Socket2, Socket1 => Spieler1, Socket2 => Spieler2 }
    private spielerSockets;

    constructor(expressApp, config, gameserver) {
        this.gameserver = gameserver;
        let httpserver = createServer(expressApp);
        httpserver.listen(config.server.port, config.server.ip);
        console.log(`Server is listening on ${config.server.ip}:${config.server.port}`);
        this.httpServer = httpserver;
        this.websocketServer = sio(this.httpServer);
        this.spielerSockets = {};
        this.websocketServer.on('connection', (socket : Socket) => this.onConnection(socket));
        console.log("GameserverWebsocketFacade started, We are: " + hostname());
    }

    private getSocketBySpieler(spieler : Spieler) : Socket{
        return this.spielerSockets[spieler.name];
    }

    private getSocketBySpielername(spielername : string) : Socket{
        return this.spielerSockets[spielername];
    }

    private getSpielername(socket : Socket) : string {
        return this.spielerSockets[socket.conn.id].name;
    }

    private addSpieler(socket : Socket) : ISpielerInfo {
        let neuerSpieler : Spieler = this.gameserver.spiel.addSpieler();
        this.spielerSockets[neuerSpieler.name] = socket;
        this.spielerSockets[socket.conn.id] = neuerSpieler;
        return new SpielerInfo(neuerSpieler.name);
    }

    private removeSpieler( socket : Socket ) {
        console.log("Player disconnected");
        let player = this.spielerSockets[socket.conn.id];
        this.gameserver.spiel.removeSpieler(player);
        this.spielerSockets[socket.conn.id] = null;
        this.spielerSockets[player.name] = null;
    }

    private setFernseher(socket : Socket) : void {
        this.fernseherSocket = socket;

        socket.on('disconnect', () => {
            console.log("TV disconnected");
            this.fernseherSocket = null;
        });
    }

    private setupSpielerSocket(socket : Socket) : void {
        socket.on('spielmodus', (spielmodus : Spielmodus) => this.gameserver.onSpielmodus(spielmodus));
        socket.on('spiel_beendet', (spielBeendet : SpielBeendet) => this.gameserver.onSpielBeendet(spielBeendet));
        socket.on('aktion', (aktion : Aktion) => this.gameserver.onAktion(new Aktion(this.getSpielername(socket),aktion.typ)));
        socket.on('disconnect',() => this.removeSpieler(socket));
        socket.on('reconnect', () => console.log("Player reconnected"));
    }

    /*
     * Wird nach dem Verbindungsaufbau eines Clients aufgerufen und liefert eine ISpielerInfo zurück falls diese Funktion
     * bereits einmal aufgerufen wurde. Das bedeutet, dass beim ersten Aufruf davon ausgegangen wird, dass sich der Fernseher
     * (passiver Beobachter) verbunden hat und kein Smartphone (aktiver Spieler). In diesem Fall wird null zurückgegeben
     * Intern sollte eine eine Spielerliste und der eine Referenz auf den Fernseher gespeichert werden
     *  @return  {ISpielerInfo}
     *           neu erstelle ISpielerInfo oder null wenn sich der Fernseher verbunden hat
     */
    private onConnection(socket : Socket) {
        // GameserverRestFacade und Fernseher View werden auf dem gleichen Host betrieben, daher haben diese die gleiche IP Adresse
        // Der erste Client der von localhost der einen Socket öffnet wird daher als Fernseher angesehen
        if(this.gameserver.spiel.spieleranzahl() == 0
            && (socket.conn.remoteAddress === "127.0.0.1" || socket.conn.remoteAddress === "localhost" || socket.conn.remoteAddress === "192.168.43.26")
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


    sendAktion(aktion: IAktion): void {
        console.log(`WEBSOCKET: Aktion geht raus für Spieler ${aktion.spieler}, Aktionstyp: ${aktion.typ}`);
        this.fernseherSocket.emit('aktion', aktion);
    }

    sendSpielGestartet(spielGestartet: ISpielGestartet): void {
        console.log("WEBSOCKET: SpielGestartet geht raus");
        this.websocketServer.emit('spiel_gestartet', spielGestartet);
    }

    sendSpielBeendet(spielBeendet: ISpielBeendet): void {
        console.log("WEBSOCKET: SpielBeendet geht raus");
        this.websocketServer.emit('spiel_beendet', spielBeendet);
    }

    sendSpielerInfo(spielerInfo: ISpielerInfo): void {
        console.log("WEBSOCKET: SpielerInfo geht raus für " + spielerInfo.username);
        let socket : Socket = this.getSocketBySpielername(spielerInfo.username);
        socket.emit('spielerinfo', spielerInfo);
    }

    sendSpielVerloren(spielVerloren: ISpielVerloren): void {
        console.log("WEBSOCKET: SpielVerloren geht raus für " + spielVerloren.spieler);
        let socket : Socket = this.getSocketBySpielername(spielVerloren.spieler);
        this.fernseherSocket.emit('spiel_verloren', spielVerloren);
        socket.emit('spiel_verloren', spielVerloren);
    }

    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
        console.log("WEBSOCKET: UngueltigeAktionOderTimeout geht raus für" + ungueltigeAktionOderTimeout.spieler);
        this.fernseherSocket.emit('ungueltige_aktion_oder_timeout', ungueltigeAktionOderTimeout);
    }


}
