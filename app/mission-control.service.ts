import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
var io = require('../js/socket.io.js');
import { Spielinfo, SpielGestartet, SpielBeendet } from './dtos';

@Injectable()
export class MissionControlService {
    private url = 'http://192.168.178.136:13337';
    private socket;

    private spielinfoToGameserver = new Subject<Spielinfo>();
    private spielinfoFromGameserver = new Subject<Spielinfo>();
    private spielGestartet = new Subject<SpielGestartet>();
    private spielBeendet = new Subject<SpielBeendet>();

    spielinfotoGameserver$ = this.spielinfoToGameserver.asObservable();
    spielinfofromGameserver$ = this.spielinfoFromGameserver.asObservable();
    spielGestartet$ = this.spielGestartet.asObservable();
    spielBeendet$ = this.spielBeendet.asObservable();

    announceSpielinfo(spielinfo: Spielinfo) {
        this.spielinfoFromGameserver.next(spielinfo);
    }

    announceSpielGestarted(spielgestartet: SpielGestartet) {
        this.spielGestartet.next(spielgestartet);
    }

    announceSpielBeendet(spielbeendet: SpielBeendet) {
        this.spielBeendet.next(spielbeendet);
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
            that.announceSpielinfo(spielinfo_);
        });

        this.socket.on('spiel_beendet', function (spielbeendet: SpielBeendet) {
            that.announceSpielBeendet(spielbeendet);
            if(this.socket != null)
                // wird vermutlich nicht benötigt, Server schließt den Socket
                this.socket.disconnect();
        });

        this.socket.on('aktion', function (data) {
            var spieler = data.spieler; // TODO
            var typ = data.typ;
        });

        this.socket.on('spiel_gestartet', function (spielGestartet) {
            let spielGestartet_ : SpielGestartet = new SpielGestartet(spielGestartet.anzahlSpieler);
            that.announceSpielGestarted(spielGestartet_);
        });
    }

    starteSpiel(spielmodus) {
        this.socket.emit('spielinfo', new Spielinfo([spielmodus], ""));
    }


}





