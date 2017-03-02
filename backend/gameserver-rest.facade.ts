import {FrontendConnectionServiceInterface} from "./frontend-connection.service.interface";
import {
    IAktion, ISpielmodus, ISpielGestartet, ISpielBeendet, ISpielerInfo,
    ISpielVerloren, IUngueltigeAktionOderTimeout
} from "../api/nachrichtentypen.interface";
import {Spiel} from "./spiel";
import {Spieler} from "./spieler";
import {hostname} from "os";
import {SpielVerloren} from "./nachrichtentypen";

export class GameserverRestFacade implements FrontendConnectionServiceInterface {

    private httpServer: any;
    private spiel : Spiel;

    constructor(httpserver) {
        this.httpServer = httpserver;
        this.spiel = new Spiel();
        this.spiel.spielrundeAusgelaufen$.subscribe((spieler : Spieler) => this.onSpielrundeAusgelaufen(spieler));
        console.log("GameserverRestFacade started, We are: " + hostname());
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