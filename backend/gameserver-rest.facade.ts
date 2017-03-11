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
import {Spielmodus, Aktion, SpielerInfo, SpielBeendet} from "./nachrichtentypen";
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

    private async blockiertBisFernseherUpdatesErhaltenHat() {
        let nochAnstehendeUpdates : boolean = this.fernseherUpdates.length > 0;
        while(nochAnstehendeUpdates) {
            await this.sleep(100);
            nochAnstehendeUpdates = this.fernseherUpdates.length > 0;
        }
    }

    private async blockiertBisSpielerUpdatesErhaltenHat(spielername : string) {
        let nochAnstehendeUpdates : boolean = this.spielerUpdates[spielername].length > 0;
        while(nochAnstehendeUpdates) {
            await this.sleep(100);
            nochAnstehendeUpdates = this.spielerUpdates[spielername].length > 0;
        }
    }

    private async blockiertBisSpielerUpdatesVorhandenSind(spielername : string) {
        let nochAnstehendeUpdates : boolean = this.spielerUpdates[spielername].length > 0;
        console.log("gibt es updates für spieler " + spielername + ":" + nochAnstehendeUpdates);
        // Blockiere bis es Updates für den gewünschten Spieler gibt
        while(!nochAnstehendeUpdates) {
            await this.sleep(100);
            console.log("gibt es updates für spieler " + spielername + ":" + nochAnstehendeUpdates);
            nochAnstehendeUpdates = this.spielerUpdates[spielername].length > 0;
        }
    }

    private sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // remember to Set Content-Type: application/json
    private setupRoutes(expressApp) {
        expressApp.get('/rest/fernseher/connection', (req : express.Request, res : express.Response) => {
            console.log("Hallo Fernseher! ip: " + req.ip);
            res.send("Willkommen anboard");
        });
        expressApp.get('/rest/spieler/connection', (req : express.Request, res : express.Response) => {
            console.log("Hallo Spieler! ip: " + req.ip);
            let spielerinfo : ISpielerInfo = this.onConnection();
            res.send(spielerinfo);
        });
        expressApp.get('/rest/spieler/:spielername/updates', (req : express.Request, res : express.Response) => {
            let spielername = req.params["spielername"];
            this.blockiertBisSpielerUpdatesVorhandenSind(spielername);
            console.log("sende Updates für Spieler " + spielername + ": " + this.spielerUpdates[spielername]);
            res.send(this.spielerUpdates[spielername]);
            this.spielerUpdates[spielername] = [];
        });
        expressApp.get('/rest/fernseher/updates', (req : express.Request, res : express.Response) => {
            console.log("sende Updates für Fernseher");
            res.send(this.fernseherUpdates);
            this.fernseherUpdates = [];
        });
        expressApp.post('/rest/spieler/:spielername/spielmodus', (req : express.Request, res : express.Response) => {
            let spielmodus : ISpielmodus = new Spielmodus(req.body.zeitFuerAktion,req.body.auswahlverfahrenSpieler,req.body.anzahlLeben);
            console.log(`Spielmodus erhalten: ${spielmodus}`);
            this.gameserver.onSpielmodus(spielmodus);
            res.send('Sie haben geschickt: ' + spielmodus);
        });
        expressApp.post('/rest/spieler/:spielername/spiel_beendet', (req : express.Request, res : express.Response) => {
            let spielBeendet : ISpielBeendet = new SpielBeendet();
            console.log(`SpielBeendet erhalten: ${spielBeendet}`);
            this.gameserver.onSpielBeendet(spielBeendet);
            res.send('Sie haben geschickt: ' + spielBeendet);

        });
        expressApp.post('/rest/spieler/:spielername/aktion', (req : express.Request, res : express.Response) => {
            let aktion = new Aktion(req.params["spielername"],req.body.typ);
            console.log(`Aktion erhalten: ${aktion}`);
            this.gameserver.onAktion(aktion);
            res.send('Sie haben geschickt: ' + aktion);

        });
    }

    private onConnection() : ISpielerInfo{
        // Ein neuer Spieler möchte dem Spiel beitreten
        let spielerInfo : ISpielerInfo = this.addSpieler();
        console.log("Hallo Spieler! von nun an bist du bekannt unter dem Namen " + spielerInfo.username);
        return spielerInfo;
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
        this.blockiertBisSpielerUpdatesErhaltenHat(spielerInfo.username);
    }

    sendSpielVerloren(spielVerloren: ISpielVerloren): void {
        this.fernseherUpdates.push(["spiel_verloren",spielVerloren]);
        this.blockiertBisFernseherUpdatesErhaltenHat();
    }

    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
        this.fernseherUpdates.push(["ungueltige_aktion_oder_timeout",ungueltigeAktionOderTimeout]);
        this.blockiertBisFernseherUpdatesErhaltenHat();
    }

}