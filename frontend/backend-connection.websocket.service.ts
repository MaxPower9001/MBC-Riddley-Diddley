import {Injectable} from "@angular/core";
import {SpielGestartet, SpielBeendet, Aktion, SpielerInfo} from "./nachrichtentypen";
import {MissionControlService} from "./mission-control.service";
import {BackendConnectionServiceInterface} from "./backend-connection.service.interface";
import {
    AktionsTyp,
    ISpielBeendet,
    ISpielVerloren,
    IUngueltigeAktionOderTimeout,
    ISpielGestartet,
    IAktion,
    ISpielmodus,
    ISpielerInfo
} from "../api/nachrichtentypen.interface";
import {UngueltigeAktionOderTimeout, SpielVerloren} from "../frontend/nachrichtentypen";
let io = require('./lib/socket.io.js');

@Injectable()
export class BackendConnectionWebsocketService implements BackendConnectionServiceInterface {

    private missionControlService : MissionControlService;

    private url = 'http://localhost:13337';
    private socket;

    private username: string = '';

    constructor() {
        this.setupSocket();
    }

    setMissionControlService(missionControlService : MissionControlService) : void {
        this.missionControlService = missionControlService;
    }

    private setupSocket() : void {
        this.socket = io(this.url);
        this.socket.on('spiel_gestartet', (spielGestartet : ISpielGestartet) => this.onSpielGestartet(spielGestartet));
        this.socket.on('spiel_beendet', (spielBeendet : ISpielBeendet) => this.onSpielBeendet(spielBeendet));
        this.socket.on('spielerinfo', (spielerinfo : ISpielerInfo) => this.onSpielerinfo(spielerinfo));
        this.socket.on('aktion', (aktion : IAktion) => this.onAktion(aktion));
        this.socket.on('ungueltige_aktion_oder_timeout', (ungueltigeAktionOderTimeout : IUngueltigeAktionOderTimeout) => this.onUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout));
        this.socket.on('spiel_verloren', (spielVerloren : ISpielVerloren) => this.onSpielVerloren(spielVerloren));
        this.socket.on('connect',() => console.log("Verbindung zum Backend hergestellt"));
        this.socket.on('disconnect',() => console.log("Verbindung unterbrochen"));
        this.socket.on('reconnect', () => console.log("Jemand versucht zu reconnecten"));
    }

    onSpielBeendet(spielbeendet : ISpielBeendet) : void {
        console.log("Spiel Beendet");
        this.missionControlService.announceSpielBeendet(new SpielBeendet());
    }

    onAktion(aktion : IAktion) : void {
        console.log("Aktion");
        this.missionControlService.announceAktion(new Aktion(aktion.spieler, aktion.typ));
    }

    onSpielVerloren(spielVerloren : ISpielVerloren) : void {
        console.log("Spiel Verloren");
        this.missionControlService.announceSpielVerloren(new SpielVerloren(spielVerloren.spieler));
    }

    onSpielGestartet(spielGestartet : ISpielGestartet) : void {
        console.log("Spiel gestartet");
        this.missionControlService.announceSpielGestarted(new SpielGestartet(spielGestartet.spielmodus, spielGestartet.beteiligteSpieler));
    }

    onUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout : IUngueltigeAktionOderTimeout) : void {
        console.log("Ungültige Aktion oder Timeout");
        this.missionControlService.annouceUngueltigeAktionOderTimeout(new UngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout.spieler));
    }

    onSpielerinfo(spielerinfo : ISpielerInfo) : void {
        console.log("Spieler Info");
        this.username = spielerinfo.username;
        this.missionControlService.announceSpielerinfo(new SpielerInfo(spielerinfo));
    }

    sendSpielmodus(spielmodus : ISpielmodus) : void {
        this.socket.emit('spielmodus', spielmodus);
    }

    sendAktion(aktion: AktionsTyp) : void {
        this.socket.emit('aktion', new Aktion(this.username, aktion));
    }

}

