import {Injectable} from '@angular/core';
var io = require('../js/socket.io.js');
import {Spielinfo, SpielGestartet, SpielBeendet, Aktion, AktionsTyp, Spielmodus} from './dtos';
import {MissionControlService} from "./mission-control.service";
import {BackendConnectionServiceInterface} from './backend-connection.service.interface';

@Injectable()
export class BackendConnectionWebsocketService implements BackendConnectionServiceInterface {

    private missionControlService : MissionControlService;

    private url = 'http://localhost:13337';
    private socket;

    private username: string = '';

    constructor() {
        this.connectToGameserver();
    }

    setMissionControlService(missionControlService : MissionControlService) : void {
        this.missionControlService = missionControlService;
    }

    connectToGameserver() : void {
        var that = this;

        this.socket = io(this.url);

        this.socket.on('connect', function () {
            console.log("wir sind verbunden");
        });

        this.socket.on('disconnect', function () {
            console.log("Verbindung unterbrochen")
        });

        this.socket.on('spielinfo', function (spielinfo) {
            let spielinfo_ : Spielinfo = new Spielinfo(spielinfo.spielmodi, spielinfo.username);
            that.username = spielinfo.username;
            that.missionControlService.announceSpielinfo(spielinfo_);
        });

        this.socket.on('spiel_beendet', function (spielbeendet: SpielBeendet) {
            that.missionControlService.announceSpielBeendet(spielbeendet);
            if(this.socket != null)
            // wird vermutlich nicht benötigt, Server schließt den Socket
                this.socket.disconnect();
        });

        this.socket.on('aktion', function (aktion) {
            console.log("aktion bekommen");
            let aktion_ : Aktion = new Aktion(aktion.spieler, aktion.typ, Date.now() / 1000);
            that.missionControlService.announceAktion(aktion_);
        });

        this.socket.on('spiel_gestartet', function (spielGestartet) {
            let spielGestartet_ : SpielGestartet = new SpielGestartet(spielGestartet.anzahlSpieler);
            that.missionControlService.announceSpielGestarted(spielGestartet_);
        });
    }

    starteSpiel(spielmodus : Spielmodus) : void {
        this.socket.emit('spielinfo', new Spielinfo([spielmodus], ""));
    }

    aktionDone(aktion: AktionsTyp) : void {
        this.socket.emit('aktion', new Aktion(this.username, aktion, 1)); //TODO AKtionszeit
    }

}

