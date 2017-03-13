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

    /*
    Fernseher und Clients erhalten die Nachrichtentypen über die Endpunkte
    /rest/spieler/:spielername/updates und /rest/fernseher/updates
    Diese Endpunkte sind als Long-Polling Variante implementiert, d.h. die GET-Requests
    werden erst beantwortet, wenn Daten für den Fernseher bzw. Spieler zur Verfügung stehen
    Um die Updates (Nachrichtentypen) zwischen zu lagern werden die beiden Objekte
    fernseherUpdates und spielerUpdates eingeführt.
    Die Clients erhalten über die /updates Endpunkte eine Liste von Nachrichtentypen nach
    folgendem Aufbau: [[<Bezeichner>, <Nachricht>],[<Bezeichner>,<Nachricht>],...]
    Dabei entspricht der Bezeichner dem Namen, welcher bereits in der Websocket-Implementierung
    verwendet wird. Nachricht ist das zugehörige Objekt im JSON Format
    */

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

    private blockiertBisAlleClientsUpdatesErhaltenHaben(functionToRun) {
        for (let spielername in this.spielerUpdates) {
            if (this.spielerUpdates.hasOwnProperty(spielername)) {
                this.blockiertBisSpielerUpdatesErhaltenHat(spielername,functionToRun);
            }
        }
        this.blockiertBisFernseherUpdatesErhaltenHat(functionToRun);
    }

    private blockiertBisFernseherUpdatesErhaltenHat(functionToRun) {
        let nochAnstehendeUpdates : boolean = this.fernseherUpdates.length > 0;
        if(nochAnstehendeUpdates) setTimeout(() => this.blockiertBisFernseherUpdatesErhaltenHat(functionToRun));
        else functionToRun();
    }

    private blockiertBisFernseherUpdatesVorhandenSind(functionToRun) {
        let nochAnstehendeUpdates : boolean = this.fernseherUpdates.length > 0;
        // Blockiere bis es Updates für den Fernseher gibt
        if(nochAnstehendeUpdates) functionToRun();
        else setTimeout(() => this.blockiertBisFernseherUpdatesVorhandenSind(functionToRun));
    }

    private blockiertBisSpielerUpdatesErhaltenHat(spielername : string, functionToRun) {
        let nochAnstehendeUpdates : boolean = this.spielerUpdates[spielername].length > 0;
        if(nochAnstehendeUpdates) setTimeout(() => this.blockiertBisSpielerUpdatesErhaltenHat(spielername,functionToRun));
        else functionToRun();
    }

    private blockiertBisSpielerUpdatesVorhandenSind(spielername : string, functionToRun) {
        let nochAnstehendeUpdates : boolean = this.spielerUpdates[spielername].length > 0;
        //console.log("gibt es updates für spieler " + spielername + ":" + nochAnstehendeUpdates);
        // Blockiere bis es Updates für den gewünschten Spieler gibt
        if(nochAnstehendeUpdates) functionToRun();
        else setTimeout(() => this.blockiertBisSpielerUpdatesVorhandenSind(spielername,functionToRun));
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
            this.blockiertBisSpielerUpdatesVorhandenSind(spielername, () => {
                console.log("sende Updates für Spieler " + spielername + ": " + this.spielerUpdates[spielername]);
                res.send(this.spielerUpdates[spielername]);
                this.spielerUpdates[spielername] = [];
            });
        });
        expressApp.get('/rest/fernseher/updates', (req : express.Request, res : express.Response) => {
            this.blockiertBisFernseherUpdatesVorhandenSind(() => {
                console.log("sende Updates für Fernseher");
                res.send(this.fernseherUpdates);
                this.fernseherUpdates = [];
            });
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
        this.blockiertBisFernseherUpdatesErhaltenHat(function(){});
    }

    sendSpielGestartet(spielGestartet: ISpielGestartet): void {
        for (let spielername in this.spielerUpdates) {
            if (this.spielerUpdates.hasOwnProperty(spielername)) {
                this.spielerUpdates[spielername].push(["spiel_gestartet",spielGestartet]);
            }
        }
        this.fernseherUpdates.push(["spiel_gestartet",spielGestartet]);
        this.blockiertBisAlleClientsUpdatesErhaltenHaben(function(){});
    }

    sendSpielBeendet(spielBeendet: ISpielBeendet): void {
        for (let spielername in this.spielerUpdates) {
            if (this.spielerUpdates.hasOwnProperty(spielername)) {
                this.spielerUpdates[spielername].push(["spiel_beendet",spielBeendet]);
            }
        }
        this.fernseherUpdates.push(["spiel_beendet",spielBeendet]);
    }

    sendSpielerInfo(spielerInfo: ISpielerInfo): void {
        this.spielerUpdates[spielerInfo.username].push(["spielerinfo",spielerInfo]);
        this.blockiertBisSpielerUpdatesErhaltenHat(spielerInfo.username,function(){});
    }

    sendSpielVerloren(spielVerloren: ISpielVerloren): void {
        this.fernseherUpdates.push(["spiel_verloren",spielVerloren]);
        this.spielerUpdates[spielVerloren.spieler].push(["spiel_verloren",spielVerloren]);
        this.blockiertBisFernseherUpdatesErhaltenHat(function(){});
    }

    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
        this.fernseherUpdates.push(["ungueltige_aktion_oder_timeout",ungueltigeAktionOderTimeout]);
        this.blockiertBisFernseherUpdatesErhaltenHat(function(){});
    }

}