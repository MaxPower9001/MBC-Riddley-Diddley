import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {Spielinfo, SpielGestartet, SpielBeendet, Aktion, AktionsTyp, Spielmodus} from './nachrichtentypen';
import {Observable} from "rxjs";
import {BackendConnectionWebsocketService} from "./backend-connection.websocket.service";
import {BackendConnectionServiceInterface} from "./backend-connection.service.interface";

@Injectable()
export class MissionControlService {

    private spielinfoToGameserver = new Subject<Spielinfo>();
    private spielinfoFromGameserver = new Subject<Spielinfo>();
    private spielGestartet = new Subject<SpielGestartet>();
    private spielBeendet = new Subject<SpielBeendet>();
    private aktionFromGameserver = new Subject<Aktion>();

    username: string = '';

    spielinfotoGameserver$ : Observable<Spielinfo>;
    spielinfofromGameserver$ : Observable<Spielinfo>;
    spielGestartet$ : Observable<SpielGestartet>;
    spielBeendet$ : Observable<SpielBeendet>;
    aktionFromGameServer$ : Observable<Aktion>;

    constructor(private websocketService : BackendConnectionWebsocketService ) {
        this.spielinfotoGameserver$ = this.spielinfoToGameserver.asObservable();
        this.spielinfofromGameserver$ = this.spielinfoFromGameserver.asObservable();
        this.spielGestartet$ = this.spielGestartet.asObservable();
        this.spielBeendet$ = this.spielBeendet.asObservable();
        this.aktionFromGameServer$ = this.aktionFromGameserver.asObservable();
        this.websocketService.setMissionControlService(this);
    }

    announceSpielinfo(spielinfo: Spielinfo) {
        this.spielinfoFromGameserver.next(spielinfo);
    }

    announceSpielGestarted(spielgestartet: SpielGestartet) {
        this.spielGestartet.next(spielgestartet);
    }

    announceSpielBeendet(spielbeendet: SpielBeendet) {
        this.spielBeendet.next(spielbeendet);
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





