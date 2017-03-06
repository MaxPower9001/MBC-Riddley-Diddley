import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {Spielmodus, SpielGestartet, SpielBeendet, Aktion, SpielerInfo, SpielVerloren} from './nachrichtentypen';
import {Observable} from "rxjs";
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {BackendConnectionWebsocketService} from "./backend-connection.websocket.service";
import {AktionsTyp, ISpielmodus} from "../api/nachrichtentypen.interface";
import {UngueltigeAktionOderTimeout} from "../frontend/nachrichtentypen";

@Injectable()
export class MissionControlService {

    private spielerInfoFromGameserver = new ReplaySubject<SpielerInfo>();
    private spielmodusToGameserver = new Subject<Spielmodus>();
    private spielGestartet = new Subject<SpielGestartet>();
    private spielBeendet = new Subject<SpielBeendet>();
    private aktionFromGameserver = new Subject<Aktion>();
    private ungueltigeAktionOderTimeout = new Subject<UngueltigeAktionOderTimeout>();
    private spielVerloren = new Subject<SpielVerloren>();

    username: string = '';
    spielmodus: ISpielmodus;

    spielerInfoFromGameserver$ : Observable<SpielerInfo>;
    spielmodustoGameserver$ : Observable<Spielmodus>;
    spielGestartet$ : Observable<SpielGestartet>;
    spielBeendet$ : Observable<SpielBeendet>;
    aktionFromGameServer$ : Observable<Aktion>;
    ungueltigeAktionOderTimeout$ : Observable<UngueltigeAktionOderTimeout>;
    spielVerloren$ : Observable<SpielVerloren>;

    constructor(private websocketService : BackendConnectionWebsocketService ) {

        this.websocketService.setMissionControlService(this);

        this.spielerInfoFromGameserver$ = this.spielerInfoFromGameserver.asObservable();
        this.spielmodustoGameserver$ = this.spielmodusToGameserver.asObservable();
        this.spielGestartet$ = this.spielGestartet.asObservable();
        this.spielBeendet$ = this.spielBeendet.asObservable();
        this.aktionFromGameServer$ = this.aktionFromGameserver.asObservable();
        this.spielVerloren$ = this.spielVerloren.asObservable();
        this.ungueltigeAktionOderTimeout$ = this.ungueltigeAktionOderTimeout.asObservable();

        this.spielerInfoFromGameserver$.subscribe((spielerInfo : SpielerInfo) => this.username = spielerInfo.username);
        this.spielGestartet.subscribe((spielGestartet : SpielGestartet) => this.spielmodus = spielGestartet.spielmodus);
    }

    announceSpielVerloren(spielVerloren : SpielVerloren) {
        this.spielVerloren.next(spielVerloren);
    }

    annouceUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout : UngueltigeAktionOderTimeout) {
        this.ungueltigeAktionOderTimeout.next(ungueltigeAktionOderTimeout);
    }

    announceSpielGestarted(spielgestartet: SpielGestartet) {
        this.spielGestartet.next(spielgestartet);
    }

    announceSpielBeendet(spielbeendet: SpielBeendet) {
        this.spielBeendet.next(spielbeendet);
    }

    announceSpielerinfo(spielerinfo : SpielerInfo) {
        this.spielerInfoFromGameserver.next(spielerinfo);
    }

    announceAktion(aktion : Aktion) {
        this.aktionFromGameserver.next(aktion);
    }

    starteSpiel(spielmodus : Spielmodus) {
        this.websocketService.sendSpielmodus(spielmodus);
    }

    aktionDone(aktion: AktionsTyp) {
        this.websocketService.sendAktion(aktion);
    }

}





