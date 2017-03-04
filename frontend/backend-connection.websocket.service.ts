import {Injectable} from '@angular/core';
var io = require('./lib/socket.io.js');
import {Spielmodus, SpielGestartet, SpielBeendet, Aktion, SpielerInfo} from './nachrichtentypen';
import {MissionControlService} from "./mission-control.service";
import {BackendConnectionServiceInterface} from './backend-connection.service.interface';
import {AktionsTyp} from "../api/nachrichtentypen.interface";
import {UngueltigeAktionOderTimeout, SpielVerloren} from "../frontend/nachrichtentypen";

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
            console.log("Spiel Beendet");
            that.missionControlService.announceSpielBeendet(new SpielBeendet());
        });

        this.socket.on('ungueltige_aktion_oder_timeout', function (ungueltigeAktionOderTimeout : UngueltigeAktionOderTimeout) {
            console.log("Ungültige Aktion oder Timeout");
            that.missionControlService.annouceUngueltigeAktionOderTimeout(new UngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout.spieler));
        });

        this.socket.on('spiel_verloren', function (spielVerloren : SpielVerloren) {
            console.log("Spiel Verloren");
            that.missionControlService.announceSpielVerloren(new SpielVerloren(spielVerloren.spieler));
        });

        this.socket.on('aktion', function (aktion : Aktion) {
            console.log("Aktion");
            that.missionControlService.announceAktion(new Aktion(aktion.spieler, aktion.typ));
        });

        this.socket.on('spiel_gestartet', function (spielGestartet : SpielGestartet) {
            console.log("Spiel gestartet");
            that.missionControlService.announceSpielGestarted(new SpielGestartet(spielGestartet.spielmodus, spielGestartet.beteiligteSpieler));
        });

        this.socket.on('spielerinfo', function (spielerinfo : SpielerInfo) {
            console.log("Spieler Info");
            that.missionControlService.announceSpielerinfo(new SpielerInfo(spielerinfo));
        });
    }

    starteSpiel(spielmodus : Spielmodus) : void {
        this.socket.emit('spielmodus', spielmodus);
    }

    aktionDone(aktion: AktionsTyp) : void {
        this.socket.emit('aktion', new Aktion(this.username, aktion)); //TODO AKtionszeit
    }

}

