import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
var io = require('../js/socket.io.js');
import { Spielinfo, SpielGestartet, SpielBeendet, Aktion, AktionsTyp } from './dtos';

@Injectable()
export class MissionControlService {
    private url = 'http://localhost:13337';
    private socket;

    private spielinfoToGameserver = new Subject<Spielinfo>();
    private spielinfoFromGameserver = new Subject<Spielinfo>();
    private spielGestartet = new Subject<SpielGestartet>();
    private spielBeendet = new Subject<SpielBeendet>();
    private aktionFromGameserver = new Subject<Aktion>();

    private username: string = '';

    spielinfotoGameserver$ = this.spielinfoToGameserver.asObservable();
    spielinfofromGameserver$ = this.spielinfoFromGameserver.asObservable();
    spielGestartet$ = this.spielGestartet.asObservable();
    spielBeendet$ = this.spielBeendet.asObservable();
    aktionFromGameServer$ = this.aktionFromGameserver.asObservable();

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

    connectToGameserver() {
        var that = this;

        this.socket = io(this.url);

        this.socket.on('connect', function () {
            console.log("wir sind verbunden");
            //socket.emit("irgendwasVonDenClients", { quelle: "smartphone", timestamp: new Date().getTime() });
            //sentTimeRequestOnTime = new Date().getTime();
            //socket.emit("syncTimeRequest");
        });

        this.socket.on('disconnect', function () {
            console.log("Verbindung unterbrochen")
        });

        this.socket.on('spielinfo', function (spielinfo) {
            let spielinfo_ : Spielinfo = new Spielinfo(spielinfo.spielmodi, spielinfo.username);
            that.username = spielinfo.username;
            that.announceSpielinfo(spielinfo_);
        });

        this.socket.on('spiel_beendet', function (spielbeendet: SpielBeendet) {
            that.announceSpielBeendet(spielbeendet);
            if(this.socket != null)
                // wird vermutlich nicht benötigt, Server schließt den Socket
                this.socket.disconnect();
        });

        this.socket.on('aktion', function (aktion) {
            console.log("aktion bekommen");
            let aktion_ : Aktion = new Aktion(aktion.spieler, aktion.typ, Date.now() / 1000);
            that.announceAktion(aktion_);
        });

        this.socket.on('spiel_gestartet', function (spielGestartet) {
            let spielGestartet_ : SpielGestartet = new SpielGestartet(spielGestartet.anzahlSpieler);
            that.announceSpielGestarted(spielGestartet_);
        });
    }

    starteSpiel(spielmodus) {
        this.socket.emit('spielinfo', new Spielinfo([spielmodus], ""));
    }

    aktionDone(aktion: AktionsTyp) {
        this.socket.emit('aktion', new Aktion(this.username, aktion, 1)); //TODO AKtionszeit
    }



}





