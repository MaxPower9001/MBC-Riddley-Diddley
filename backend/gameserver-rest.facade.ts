import {FrontendConnectionServiceInterface} from "./frontend-connection.service.interface";
import {
    IAktion,
    ISpielmodus,
    ISpielGestartet,
    ISpielBeendet,
    ISpielerInfo,
    ISpielVerloren,
    IUngueltigeAktionOderTimeout
} from "../api/nachrichtentypen.interface";
import {Spieler} from "./spieler";
import {hostname} from "os";
import {Spielmodus, Aktion, SpielerInfo} from "./nachrichtentypen";
import {createServer} from "http";
import * as express from "express";
import * as bodyparser from "body-parser";
import {Gameserver} from "./gameserver";


export class GameserverRestFacade implements FrontendConnectionServiceInterface {

    private httpServer: any;
    private gameserver : Gameserver;

    private fernseherUpdates = [];
    private spielerUpdates = {};

    constructor(expressApp, config, gameserver) {
        this.gameserver = gameserver;
        // parse application/json
        expressApp.use(bodyparser.json());
        this.setupRoutes(expressApp);
        let httpserver = createServer(expressApp);
        httpserver.listen(config.server.port, config.server.ip);
        console.log(`Server is listening on ${config.server.ip}:${config.server.port}`);
        this.httpServer = httpserver;
        console.log("GameserverRestFacade started, We are: " + hostname());
    }

    private getUpdatesBySpieler(spieler : Spieler) : any {
        return this.spielerUpdates[spieler.name];
    }

    private getUpdatesBySpielername(spielername : string) : any {
        return this.spielerUpdates[spielername];
    }

    private addSpieler() : ISpielerInfo {
        let neuerSpieler : Spieler = this.gameserver.spiel.addSpieler();
        this.spielerUpdates[neuerSpieler.name] = [];
        return new SpielerInfo(neuerSpieler.name);
    }

    private blockiertBisAlleClientsUpdatesErhaltenHaben() {
        for (let spielername in Object.keys(this.spielerUpdates)) {
            this.blockiertBisSpielerUpdatesErhaltenHat(spielername);
        }
        this.blockiertBisFernseherUpdatesErhaltenHat();
    }

    private blockiertBisFernseherUpdatesErhaltenHat() {
        let nochAnstehendeUpdates : boolean = true;
        while(nochAnstehendeUpdates) {
            nochAnstehendeUpdates = this.fernseherUpdates.length > 0;
        }
    }

    private blockiertBisSpielerUpdatesErhaltenHat(spielername : string) {
        let nochAnstehendeUpdates : boolean = true;
        while(nochAnstehendeUpdates) {
            nochAnstehendeUpdates = this.spielerUpdates[spielername].length > 0;
        }
    }


    // remember to Set Content-Type: application/json
    private setupRoutes(expressApp) {
        expressApp.get('/rest/fernseher/connection', (req : express.Request, res : express.Response) => {
            console.log("Hallo Fernseher! ip: " + req.ip);
            res.send("Willkommen anboard");
        });
        expressApp.get('/rest/spieler/connection', (req : express.Request, res : express.Response) => {
            console.log("Hallo Spieler! ip: " + req.ip);
            this.onConnection();
            res.send("Willkommen anoard");
        });
        expressApp.get('/rest/spieler/:spielername/updates', (req : express.Request, res : express.Response) => {
            console.log("sende Updates für Spieler " + req.params["spielername"]);
            this.onConnection();
            let spielerUpdateObj = this.spielerUpdates[req.params["spielername"]];
            res.send(spielerUpdateObj);
            spielerUpdateObj = [];
        });
        expressApp.post('/rest/spieler/:spielername/spielmodus', (req : express.Request, res : express.Response) => {
            let spielmodus : ISpielmodus = new Spielmodus(req.body.zeitFuerAktion,req.body.auswahlverfahrenSpieler,req.body.anzahlLeben);
            console.log(`Spielmodus erhalten: ${spielmodus}`);
            this.onSpielmodus(spielmodus);
            res.send('Sie haben geschickt: ' + spielmodus);
        });
        expressApp.post('/rest/spieler/:spielername/aktion', (req : express.Request, res : express.Response) => {
            let aktion : IAktion = new Aktion(req.body.spieler, req.body.typ);
            console.log(`Aktion erhalten: ${aktion}`);
            res.send('Sie haben geschickt: ' + aktion);
        });
    }

    private onConnection() {
        // Ein neuer Spieler möchte dem Spiel beitreten
        let spielerInfo : ISpielerInfo = this.addSpieler();
        console.log("Hallo Spieler! von nun an bist du bekannt unter dem Namen " + spielerInfo.username);
        // Sende Spieler seinen Spielernamen
        this.sendSpielerInfo(spielerInfo);
    }

    private onAktion(aktion: IAktion): void {
        //TODO
    }

    private onSpielmodus(spielmodus: ISpielmodus): void {
        //TODO
    }

    private onSpielBeendet(spielBeendet : ISpielBeendet) : void {
        //TODO
    }

    sendAktion(aktion: IAktion): void {
        this.fernseherUpdates.push(["aktion",aktion]);
        this.blockiertBisFernseherUpdatesErhaltenHat();
    }

    sendSpielGestartet(spielGestartet: ISpielGestartet): void {
        for(let spielername in Object.keys(this.spielerUpdates)) {
            this.spielerUpdates[spielername].push(["spiel_gestartet",spielGestartet]);
        }
        this.fernseherUpdates.push(["spiel_gestartet",spielGestartet]);
        this.blockiertBisAlleClientsUpdatesErhaltenHaben();
    }

    sendSpielBeendet(spielBeendet: ISpielBeendet): void {
        for(let spielername in Object.keys(this.spielerUpdates)) {
            this.spielerUpdates[spielername].push(["spiel_beendet",spielBeendet]);
        }
        this.fernseherUpdates.push(["spiel_beendet",spielBeendet]);
    }

    sendSpielerInfo(spielerInfo: ISpielerInfo): void {
        this.spielerUpdates[spielerInfo.username].push(["spielerinfo",spielerInfo]);
    }

    sendSpielVerloren(spielVerloren: ISpielVerloren): void {
        //this.spielerUpdates[spielVerloren.spieler].push(["spiel_verloren",spielVerloren]);
        this.fernseherUpdates.push(["spiel_verloren",spielVerloren]);
    }

    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
        //this.spielerUpdates[ungueltigeAktionOderTimeout.spieler].push(["ungueltige_aktion_oder_timeout",ungueltigeAktionOderTimeout]);
        this.fernseherUpdates.push(["ungueltige_aktion_oder_timeout",ungueltigeAktionOderTimeout]);
    }

}