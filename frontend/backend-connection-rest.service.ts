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

    private gameServer = 'localhost';
    private url = `http://${this.gameServer}:13337/rest`;

    private username: string = '';

    constructor(private http: Http) {
        this.connect();
    }

    private connect() {
        if(window.location.href === `http://${this.gameServer}:13337/#/`) {
            this.http.get(this.url + "/fernseher/connection")
                .catch(this.handleError)
                .subscribe((data) => {
                    console.log("Wir sind ein Fernseher");
                    this.fetchUpdatesFernseher();
                });
        } else {
            this.http.get(this.url + "/spieler/connection")
                .map(this.extractData)
                .subscribe((spielerinfo : ISpielerInfo) => {
                    console.log("Wir sind ein Spieler");
                    this.username = spielerinfo.username;
                    this.onSpielerinfo(spielerinfo);
                    this.fetchUpdatesSpieler();
                })
        }
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
        console.log("onUpdates hat updates erhalten: " + updates);
        for(let updateIdx in updates) {
            let update = updates[updateIdx];
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

    private fetchUpdatesSpieler() {
        this.http.get(this.url + `/spieler/${this.username}/updates`)
            .map(this.extractData)
            .subscribe(updates => {
                console.log("Es gibt Updates für Spieler"+this.username);
                this.onUpdates(updates);
                this.fetchUpdatesSpieler();
            })
    }

    private fetchUpdatesFernseher() {
        this.http.get(this.url + `/fernseher/updates`)
            .map(this.extractData)
            .subscribe(updates => {
                console.log("Es gibt Updates für den Fernseher");
                this.onUpdates(updates);
                this.fetchUpdatesFernseher();
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
        console.log(`send spielmodus to ${this.url}/spieler/${this.username}/spielmodus`);
        this.http.post(`${this.url}/spieler/${this.username}/spielmodus`, spielmodus, options)
            .catch(this.handleError)
            .subscribe(() => console.log("Spielmodus erfolgreich versendet"));
    }

    sendAktion(aktion: AktionsTyp) : void {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post(`${this.url}/spieler/${this.username}/aktion`, new Aktion(this.username, aktion), options)
            .catch(this.handleError)
            .subscribe(() => console.log("Aktion erfolgreich versendet"));
    }

}
