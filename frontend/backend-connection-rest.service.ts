import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {BackendConnectionServiceInterface} from "./backend-connection.service.interface";
import {MissionControlService} from "./mission-control.service";
import {
    AktionsTyp,
    ISpielmodus,
    ISpielBeendet,
    IAktion,
    ISpielVerloren,
    ISpielGestartet,
    IUngueltigeAktionOderTimeout,
    ISpielerInfo
} from "../api/nachrichtentypen.interface";
import {
    SpielerInfo, UngueltigeAktionOderTimeout, SpielGestartet, SpielVerloren, Aktion,
    SpielBeendet
} from "./nachrichtentypen";

@Injectable()
export class BackendConnectionRestService implements BackendConnectionServiceInterface {

    private missionControlService : MissionControlService;

    private url = 'http://localhost:13337/rest';

    private username: string = '';

    constructor(private http: Http) {
        this.connect();
    }

    private connect() {
        this.http.get(this.url + "/spieler/connection")
            .map(this.extractData)
            .subscribe((spielerinfo : ISpielerInfo) => {
                this.username = spielerinfo.username;
                this.fetchUpdates();
        })
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error("ERROR: " + errMsg);
        return Promise.reject(errMsg);
    }

    private onUpdates(updates : any[]) {
        for(let update in updates) {
            let nachrichtentypBezeichner : string = update[0];
            let nachrichtentyp : any = update[1];
            switch(nachrichtentypBezeichner) {
                case("spiel_gestartet"): this.onSpielGestartet(nachrichtentyp); break;
                case("spiel_beendet"): this.onSpielBeendet(nachrichtentyp); break;
                case("spielerinfo"): this.onSpielerinfo(nachrichtentyp); break;
                case("aktion"): this.onAktion(nachrichtentyp); break;
                case("ungueltige_aktion_oder_timeout"): this.onUngueltigeAktionOderTimeout(nachrichtentyp); break;
                case("spiel_verloren"): this.onSpielVerloren(nachrichtentyp); break;
            }
        }
    }

    private fetchUpdates() {
        this.http.get(this.url + `/spieler/${this.username}/updates`)
            .map(this.extractData)
            .subscribe(updates => {
                console.log("Es gibt Updates für Spieler"+this.username);
                this.onUpdates(updates);
                this.fetchUpdates();
            })
    }

    setMissionControlService(missionControlService : MissionControlService) : void {
        this.missionControlService = missionControlService;
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
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post(`${this.url}/${this.username}/spielmodus`, spielmodus, options).catch(this.handleError);
    }

    sendAktion(aktion: AktionsTyp) : void {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post(`${this.url}/${this.username}/aktion`, new Aktion(this.username, aktion), options)
            .catch(this.handleError);
    }

}
