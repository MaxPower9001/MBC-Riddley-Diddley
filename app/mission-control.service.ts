import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
var io = require('../js/socket.io.js');
import * as dtos from './dtos';

@Injectable()
export class MissionControlService {
    private url = 'http://localhost:13337';
    private socket;

    private spielinfoToGameserver = new Subject<dtos.Spielinfo>();
    private spielinfoFromGameserver = new Subject<dtos.Spielinfo>();
    private spielGestartet = new Subject<dtos.SpielGestartet>();
    private spielBeendet = new Subject<dtos.SpielBeendet>();

    spielinfotoGameserver$ = this.spielinfoToGameserver.asObservable();
    spielinfofromGameserver$ = this.spielinfoFromGameserver.asObservable();
    spielGestartet$ = this.spielGestartet.asObservable();
    spielBeendet$ = this.spielBeendet.asObservable();

    announceSpielinfo(spielinfo: dtos.Spielinfo) {
        this.spielinfoFromGameserver.next(spielinfo);
    }

    announceSpielGestarted(spielgestartet: dtos.SpielGestartet) {
        this.spielGestartet.next(spielgestartet);
    }

    announceSpielBeendet(spielbeendet: dtos.SpielBeendet) {
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

        this.socket.on('spielinfo', function (spielinfo : dtos.Spielinfo) {
            that.announceSpielinfo(spielinfo);
        });

        this.socket.on('spiel_beendet', function (spielbeendet: dtos.SpielBeendet) {
            that.announceSpielBeendet(spielbeendet);
            if(this.socket != null)
                // wird vermutlich nicht benötigt, Server schließt den Socket
                this.socket.disconnect();
        });

        this.socket.on('aktion', function (data) {
            var spieler = data.spieler; // TODO
            var typ = data.typ;
        });

        this.socket.on('spiel_gestartet', function (spielGestartet : dtos.SpielGestartet) {
            that.announceSpielGestarted(spielGestartet);
        });
    }

    starteSpiel(spielmodus) {
        this.socket.emit('spielinfo', new dtos.Spielinfo([spielmodus], ""));
    }


}





