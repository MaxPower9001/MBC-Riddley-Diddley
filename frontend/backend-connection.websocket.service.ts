import {Injectable} from '@angular/core';
var io = require('./lib/socket.io.js');
import {Spielmodus, SpielGestartet, SpielBeendet, Aktion, SpielerInfo} from './nachrichtentypen';
import {MissionControlService} from "./mission-control.service";
import {BackendConnectionServiceInterface} from './backend-connection.service.interface';
import {AktionsTyp} from "../api/nachrichtentypen.interface";

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

        this.socket.on('spielmodus', function (spielmodus : Spielmodus) {
            that.missionControlService.announceSpielmodus(spielmodus);
        });

        this.socket.on('reconnect', () => console.log("muthafuca tryin to reconnect"));

        this.socket.on('spiel_beendet', function (spielbeendet: SpielBeendet) {
            console.log("Spiel beendet erhalten");
            that.missionControlService.announceSpielBeendet(spielbeendet);
        });

        this.socket.on('aktion', function (aktion : Aktion) {
            console.log("aktion bekommen");
            that.missionControlService.announceAktion(aktion);
        });

        this.socket.on('spiel_gestartet', function (spielGestartet : SpielGestartet) {
            that.missionControlService.announceSpielGestarted(spielGestartet);
        });

        this.socket.on('spielerinfo', function (spielerinfo : SpielerInfo) {
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

