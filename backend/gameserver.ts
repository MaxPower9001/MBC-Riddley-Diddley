// Ein Hoch auf Ecmascript 6 !!!!!!
import {Spieler} from "./spieler";
import {Spiel} from "./spiel";
import {Spielmodus, SpielVerloren, UngueltigeAktionOderTimeout} from "./nachrichtentypen";
import {IAktion, ISpielGestartet, ISpielBeendet} from "../api/nachrichtentypen.interface";
import {FrontendConnectionServiceInterface} from "./frontend-connection.service.interface";
import {GameserverWebsocketFacade} from "./gameserver-websocket.facade";
import Socket = SocketIO.Socket;
import Server = SocketIO.Server;
import {GameserverRestFacade} from "./gameserver-rest.facade";

export class Gameserver {

    private facade : FrontendConnectionServiceInterface;
    spiel : Spiel;

    constructor(expressApp, config) {
        if(config.useWebsockets) {
            this.facade = new GameserverWebsocketFacade(expressApp, config, this);
        } else {
            this.facade = new GameserverRestFacade(expressApp, config, this);
        }
        this.spiel = new Spiel();
        this.spiel.spielrundeAusgelaufen$.subscribe((spieler : Spieler) => this.onSpielrundeAusgelaufen(spieler));
    }

    /*
     * Startet eine neue Spielrunde falls die Bedingungen dafür erfüllt sind oder beendet das Spiel, wenn dem nicht der Fall ist
     */
    private starteNeueSpielrunde() : void {
        let nextAktion : IAktion = this.spiel.erstelleSpielrunde();
        if(nextAktion) {
            this.facade.sendAktion(nextAktion);
            this.spiel.starteSpielrunde();
        } else {
            let spielBeendet : ISpielBeendet = this.spiel.beendeSpiel();
            this.facade.sendSpielBeendet(spielBeendet);
        }
    }

    /*
     * Wird aufgerufen wenn die Spielrunde ausgelaufen ist und währenddessen keine gültige Aktion vom Spieler gesendet wurde
     * @property {Spieler} spieler
     *           Spieler der in der vergangenen Spielrunde eine Aktion hätte durchführen sollen
     */
    onSpielrundeAusgelaufen(spieler : Spieler ) {
        console.log("Die aktuelle Spielrunde ist ausgelaufen, keine gültige Aktion erhalten, Spieler " + spieler.name + "hat es verbockt");
        this.facade.sendUngueltigeAktionOderTimeout(new UngueltigeAktionOderTimeout(spieler.name));
        let darfWeiterspielen : boolean = this.spiel.verringereLeben(spieler.name);
        if(!darfWeiterspielen) {
            this.spiel.removeSpieler(spieler);
            this.facade.sendSpielVerloren(new SpielVerloren(spieler.name));
        }
        this.starteNeueSpielrunde();
    }

    /*
     * Behandelt ein ISpielBeendet von einem Spieler. Beendet das Spiel
     * @property {ISpielBeendet} spielBeendet
     */
    onSpielBeendet(spielBeendet : ISpielBeendet) : void {
        spielBeendet = this.spiel.beendeSpiel();
        this.facade.sendSpielBeendet(spielBeendet);
    }

    /*
     * Behandelt eine IAktion von einem Spieler
     * @property {IAktion} aktion
     *           von einem Spieler ausgeführte Aktion
     */
    onAktion(aktion: IAktion): void {
        this.spiel.stoppeSpielrunde();
        console.log("Aktion erhalten: " + aktion);
        if(!this.spiel.istAktionImAktuellenSpielstatusVerwertbar(aktion)) {
            console.log("Aktion wird verworfen");
            return;
        }
        let istGueltig =  this.spiel.pruefeErhalteneAktion(aktion);
        if(istGueltig) {
            this.starteNeueSpielrunde();
        } else {
            this.facade.sendUngueltigeAktionOderTimeout(new UngueltigeAktionOderTimeout(aktion.spieler));
            let darfWeiterspielen : boolean = this.spiel.verringereLeben(aktion.spieler);
            if(!darfWeiterspielen) {
                this.facade.sendSpielVerloren(new SpielVerloren(aktion.spieler));
            }
        }
    }

    /*
     * Behandelt ein ISpielmodus von einem Spieler. Erstellt ein Spiel und startet die erste Spielrunde
     * @property {ISpielmodus} spielmodus
     *           von einem beliebigen Spieler erstellter Spielmodus
     */
    onSpielmodus(spielmodus : Spielmodus) : void {
        // Spieler hat dem Server mitgeteilt, welcher Spielmodus gespielt werden soll
        // Spiel kann erstellt und der Spielmodus entsprechend gesetzt werden
        let spielGestartet : ISpielGestartet = this.spiel.erstelleSpiel(spielmodus);
        this.facade.sendSpielGestartet(spielGestartet);

        // Sende erste Aktion des Spiels, nachfolgende Aktionen werden durch onAktion ausgelöst
        let nextAktion : IAktion = this.spiel.erstelleSpielrunde();
        this.facade.sendAktion(nextAktion);
        this.spiel.starteSpielrunde();
    }

}