import {Injectable} from '@angular/core';
var io = require('./lib/socket.io.js');
import {Spielmodus, SpielGestartet, SpielBeendet, Aktion, SpielerInfo, SpielVerloren} from './nachrichtentypen';
import {MissionControlService} from "./mission-control.service";
import {BackendConnectionServiceInterface} from './backend-connection.service.interface';
import {AktionsTyp} from "../api/nachrichtentypen.interface";
import {UngueltigeAktionOderTimeout} from "../frontend/nachrichtentypen";

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
            console.log("Verbindung zum Backend hergestellt");
        });

        this.socket.on('disconnect', function () {
            console.log("Verbindung unterbrochen")
        });

        this.socket.on('reconnect', function () {
            console.log("Jemand versucht zu reconnecten");
        });

        this.socket.on('spiel_beendet', function (spielbeendet: SpielBeendet) {
            that.missionControlService.announceSpielBeendet(new SpielBeendet());
            console.log("Spiel Beendet");
        });

        this.socket.on('ungueltige_aktion_oder_timeout', function (ungueltigeAktionOderTimeout : UngueltigeAktionOderTimeout) {
            that.missionControlService.annouceUngueltigeAktionOderTimeout(new UngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout.spieler));
            console.log("Ungültige Aktion oder Timeout");
        });

        this.socket.on('spiel_verloren', function (spielVerloren : SpielVerloren) {
            that.missionControlService.announceSpielVerloren(new SpielVerloren(spielVerloren.spieler));
            console.log("Spiel Verloren");
        });

        this.socket.on('aktion', function (aktion : Aktion) {
            that.missionControlService.announceAktion(new Aktion(aktion.spieler, aktion.typ));
            console.log("Aktion");
        });

        this.socket.on('spiel_gestartet', function (spielGestartet : SpielGestartet) {
            that.missionControlService.announceSpielGestarted(new SpielGestartet(spielGestartet.spielmodus, spielGestartet.beteiligteSpieler));
            console.log("Spiel gestartet");
        });

        this.socket.on('spielerinfo', function (spielerinfo : SpielerInfo) {
            that.missionControlService.announceSpielerinfo(new SpielerInfo(spielerinfo));
            console.log("Spieler Info");
        });
    }

    starteSpiel(spielmodus : Spielmodus) : void {
        this.socket.emit('spielmodus', spielmodus);
    }

    aktionDone(aktion: AktionsTyp) : void {
        this.socket.emit('aktion', new Aktion(this.username, aktion)); //TODO AKtionszeit
    }

}

