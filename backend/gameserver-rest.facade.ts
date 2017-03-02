import {FrontendConnectionServiceInterface} from "./frontend-connection.service.interface";
import {
    IAktion, ISpielmodus, ISpielGestartet, ISpielBeendet, ISpielerInfo,
    ISpielVerloren, IUngueltigeAktionOderTimeout
} from "../api/nachrichtentypen.interface";
import {Spiel} from "./spiel";
import {Spieler} from "./spieler";
import {hostname} from "os";
import {SpielVerloren, Spielmodus, SpielBeendet, Aktion, SpielerInfo} from "./nachrichtentypen";
import {createServer} from "http";
import * as express from "express";
import * as bodyparser from "body-parser";


export class GameserverRestFacade implements FrontendConnectionServiceInterface {

    private httpServer: any;
    private spiel : Spiel;

    constructor(expressApp, config) {
        // parse application/json
        expressApp.use(bodyparser.json());
        this.setupRoutes(expressApp);
        var httpserver = createServer(expressApp);
        httpserver.listen(config.server.port, config.server.ip);
        console.log(`Server is listening on ${config.server.ip}:${config.server.port}`);
        this.httpServer = httpserver;
        this.spiel = new Spiel();
        this.spiel.spielrundeAusgelaufen$.subscribe((spieler : Spieler) => this.onSpielrundeAusgelaufen(spieler));
        console.log("GameserverRestFacade started, We are: " + hostname());
    }

    // remember to Set Content-Type: application/json
    setupRoutes(expressApp) {
        expressApp.get('/rest/fernseher/connection', (req : express.Request, res : express.Response) => {
            console.log("Hallo Fernseher! ip: " + req.ip);
            res.send("Willkommen anboard");
        });
        expressApp.get('/rest/spieler/connection', (req : express.Request, res : express.Response) => {
            console.log("Hallo Spieler! ip: " + req.ip);
            this.onConnection();
            res.send("Willkommen anboard");
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

    private addSpieler() : ISpielerInfo {
        let neuerSpieler : Spieler = this.spiel.addSpieler();
        return new SpielerInfo(neuerSpieler.name);
    }

    /*
     * Wird aufgerufen wenn die Spielrunde ausgelaufen ist und währenddessen keine gültige Aktion vom Spieler gesendet wurde
     * @property {Spieler} spieler
     *           Spieler der in der vergangenen Spielrunde eine Aktion hätte durchführen sollen
     */
    onSpielrundeAusgelaufen(spieler : Spieler ) {
        let darfWeiterspielen : boolean = this.spiel.verringereLeben(spieler.name);
        if(!darfWeiterspielen) {
            this.spiel.removeSpieler(spieler);
            this.sendSpielVerloren(new SpielVerloren(spieler.name));
        }

    }

    onConnection() {
        // Ein neuer Spieler möchte dem Spiel beitreten
        let spielerInfo : ISpielerInfo = this.addSpieler();
        console.log("Hallo Spieler! von nun an bist du bekannt unter dem Namen " + spielerInfo.username);

        // Sende Spieler seinen Spielernamen
        //this.sendSpielerInfo(spielerInfo);
    }

    onAktion(aktion: IAktion): void {
    }

    onSpielmodus(spielmodus: ISpielmodus): void {
    }

    sendAktion(aktion: IAktion): void {
    }

    sendSpielGestartet(spielGestartet: ISpielGestartet): void {
    }

    sendSpielBeendet(spielBeendet: ISpielBeendet): void {
    }

    sendSpielerInfo(spielerInfo: ISpielerInfo): void {
    }

    sendSpielVerloren(spielVerloren: ISpielVerloren): void {
    }

    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
    }

}