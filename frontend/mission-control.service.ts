import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {Spielmodus, SpielGestartet, SpielBeendet, Aktion, SpielerInfo} from './nachrichtentypen';
import {Observable} from "rxjs";
import {BackendConnectionWebsocketService} from "./backend-connection.websocket.service";
import {BackendConnectionServiceInterface} from "./backend-connection.service.interface";
import {AktionsTyp} from "../api/nachrichtentypen.interface";

@Injectable()
export class MissionControlService {

    private spielerInfoFromGameserver = new Subject<SpielerInfo>();
    private spielmodusToGameserver = new Subject<Spielmodus>();
    private spielmodusFromGameserver = new Subject<Spielmodus>();
    private spielGestartet = new Subject<SpielGestartet>();
    private spielBeendet = new Subject<SpielBeendet>();
    private aktionFromGameserver = new Subject<Aktion>();

    username: string = '';

    spielerInfoFromGameserver$ : Observable<SpielerInfo>;
    spielmodustoGameserver$ : Observable<Spielmodus>;
    spielmodusfromGameserver$ : Observable<Spielmodus>;
    spielGestartet$ : Observable<SpielGestartet>;
    spielBeendet$ : Observable<SpielBeendet>;
    aktionFromGameServer$ : Observable<Aktion>;

    constructor(private websocketService : BackendConnectionWebsocketService ) {
        this.spielerInfoFromGameserver$ = this.spielerInfoFromGameserver.asObservable();
        this.spielmodustoGameserver$ = this.spielmodusToGameserver.asObservable();
        this.spielmodusfromGameserver$ = this.spielmodusFromGameserver.asObservable();
        this.spielGestartet$ = this.spielGestartet.asObservable();
        this.spielBeendet$ = this.spielBeendet.asObservable();
        this.aktionFromGameServer$ = this.aktionFromGameserver.asObservable();
        this.websocketService.setMissionControlService(this);
        this.spielerInfoFromGameserver$.subscribe((spielerInfo : SpielerInfo) => this.username = spielerInfo.username);
    }

    announceSpielmodus(spielmodus: Spielmodus) {
        this.spielmodusFromGameserver.next(spielmodus);
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
        this.websocketService.starteSpiel(spielmodus);
    }

    aktionDone(aktion: AktionsTyp) {
        this.websocketService.aktionDone(aktion);
    }

}





