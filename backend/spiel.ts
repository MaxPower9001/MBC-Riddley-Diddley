import {Aktion, Spielmodus, SpielBeendet, SpielGestartet} from './nachrichtentypen';
import {Spieler} from "./spieler";
import Timer = NodeJS.Timer;
import {
    AktionsTyp, SpielerAuswahlVerfahren, IAktion, ISpielBeendet,
    ISpielGestartet
} from "../api/nachrichtentypen.interface";
import {AktuelleSpielrunde} from "./aktuelle-spielrunde";
import {Subject, Observable} from "rxjs";

export class Spiel {

    private static spielername_prefix : string = "Spatzl_";

    private aktuelleSpielrunde : AktuelleSpielrunde;
    private spielrundenUhr : Timer;

    private spielrundeAusgelaufen : Subject<Spieler>;

    spielrundeAusgelaufen$ : Observable<Spieler>;

    spieler : Spieler[];
    spielmodus : Spielmodus;

    constructor() {
        this.spieler = new Array<Spieler>();
        this.spielrundeAusgelaufen = new Subject<Spieler>();
        this.spielrundeAusgelaufen$ = this.spielrundeAusgelaufen.asObservable();
        this.spielmodus = null;
    }

    /*
     * Erstellt ein neues Spiel auf Basis des übergebenen ISpielmodus
     * @property {ISpielmodus} spielmodus
     *           von einem beliebigen Spieler erstellter Spielmodus
     * @return   {ISpielGestartet}
     *           Informationen über das gestartete Spiel
     */
    erstelleSpiel(spielmodus : Spielmodus) : ISpielGestartet {
        this.spielmodus = spielmodus;
        // Setze die Anzahl der Leben jedes Spielers wie im Spielmodi definiert
        this.spieler.forEach((spieler) => spieler.verbleibendeLeben = spielmodus.anzahlLeben);
        return new SpielGestartet(this.spielmodus, this.getAllSpielernamen());
    }

    /*
     * Erstellt eine neue Spielrunde
     * @return {IAktion}
     *         gibt die Aktion zurück die in der neu erstellten Spielrunde gespielt werden soll
     *         gibt null zurück, wenn kein Spieler mehr im Spiel ist
     */
    erstelleSpielrunde() : IAktion {
        // Neue Runde erstellen
        let nextAktionsTyp : AktionsTyp = this.getNextAktionsTyp();
        let nextSpieler : Spieler = this.getNextSpieler();
        let nextAktion : IAktion = new Aktion(nextSpieler.name, nextAktionsTyp);
        this.aktuelleSpielrunde = new AktuelleSpielrunde(nextAktionsTyp, nextSpieler, this.spielmodus.zeitFuerAktion);
        // Stoppuhr zurücksetzen
        if(this.spielrundenUhr) this.stoppeSpielrunde();
        return nextAktion;
    }

    beendeSpiel() : ISpielBeendet {
        if(this.spielrundenUhr) this.stoppeSpielrunde();
        return new SpielBeendet();
    }

    starteSpielrunde() : void {
        let spielerAnDerReihe : Spieler = this.aktuelleSpielrunde.getGewuenschterSpieler();
        // folgendes wird ausgeführt, falls innerhalb der aktuellen Spielrunde keine korrekte Aktion eingetroffen ist
        let zeitInMillis : number = new Date().valueOf();
        console.log("Spieluhr gestartet, Zeit: " + zeitInMillis);
        this.aktuelleSpielrunde.beginnInMilliSekunden = zeitInMillis;
        this.spielrundenUhr =  setInterval(() => this.handleSpielrundeAusgelaufen(spielerAnDerReihe), this.spielmodus.zeitFuerAktion * 1000);
    }

    stoppeSpielrunde() : void {
        clearInterval(this.spielrundenUhr);
        this.spielrundenUhr = null;
        let zeitInMillis : number = new Date().valueOf();
        this.aktuelleSpielrunde.endeInMillisekunden = zeitInMillis;
        console.log("Spieluhr gestoppt, Zeit " + zeitInMillis +
            " Dauer in ms: " + (this.aktuelleSpielrunde.endeInMillisekunden-this.aktuelleSpielrunde.beginnInMilliSekunden));
    }

    handleSpielrundeAusgelaufen(spieler : Spieler) : void{
        this.stoppeSpielrunde();
        this.spielrundeAusgelaufen.next(spieler);
    }

    /*
     * Prüft eine erhaltene IAktion auf Gültigkeit
     * @property {IAktion} aktion
     *           von einem Spieler ausgeführte Aktion
     * @return   {boolean}
     *           gibt an, ob die erhaltene Aktion im aktuellen Spielzustand gültig war oder nicht
     *           (z.B. korrekter Spieler, falscher AktionsTyp, zu spät eingetroffen)
     */
    pruefeErhalteneAktion(aktion : IAktion) : boolean {
        let spieler = this.getSpielerFromSpielerliste(aktion.spieler);
        return this.aktuelleSpielrunde.istAktionsTypGueltig(aktion.typ,spieler);
    }


    /*
     * Verringert das Leben des Spielers und gibt zurück ob der Spieler anschließend noch weiterspielen darf
     * @return  {boolean}
     *          gibt an, ob der Spieler nach den verringern des Lebens noch im Spiel ist. True bedeutet der Spieler
     *          darf weiterspielen, false heißt der Spieler hat das Spiel verloren und spielt nicht mehr mit
     */
    verringereLeben(spielername : string) : boolean {
        let spieler : Spieler = this.getSpielerFromSpielerliste(spielername);
        spieler.verbleibendeLeben--;
        let darfWeiterspielen : boolean = spieler.verbleibendeLeben > 0;
        console.log("Leben des Spielers " + spielername +" verrringert, dieser hat nun noch " + spieler.verbleibendeLeben + " Leben");
        return darfWeiterspielen;
    }

    addSpieler() : Spieler {
        let spieler : Spieler = new Spieler();
        spieler.name = Spiel.spielername_prefix + (this.spieleranzahl() + 1);
        this.spieler.push(spieler);
        return spieler;
    }

    removeSpieler(spieler : Spieler ) : void {
        let idx : number = this.spieler.indexOf(spieler);
        if (idx > -1) {
            this.spieler.splice(idx, 1);
        }
    }

    spieleranzahl() : number {
        return this.spieler.length;
    }

    getAllSpielernamen() : string[] {
        return this.spieler.map((s : Spieler) => s.name);
    }

    getSpielerFromSpielerliste(spielername : string) : Spieler {
        return this.spieler.find(spieler => spieler.name === spielername);
    }

    getNextSpieler() : Spieler {
        if(!this.aktuelleSpielrunde) return this.spieler[0]; // Fuer denn Fall: erste Spielrunde im Spiel
        let lastSpielerIndex : number;
        let nextSpielerIndex : number;
        lastSpielerIndex = this.spieler.findIndex((elem : Spieler) => this.aktuelleSpielrunde.getGewuenschterSpieler().name === elem.name);
        if(this.spielmodus.auswahlverfahrenSpieler == SpielerAuswahlVerfahren.ZUFALL) {
            nextSpielerIndex = Math.floor(Math.random() * this.spieler.length);
            lastSpielerIndex = nextSpielerIndex;
        } else if (this.spielmodus.auswahlverfahrenSpieler == SpielerAuswahlVerfahren.REIUM) {
            if(lastSpielerIndex + 1 >= this.spieler.length) {
                nextSpielerIndex = 0;
            } else {
                nextSpielerIndex = lastSpielerIndex + 1;
            }
        }
        return this.spieler[nextSpielerIndex];
    }

    getNextAktionsTyp() : AktionsTyp {
        let keys = Object.keys(AktionsTyp);
        return AktionsTyp[keys[Math.floor(Math.random() * keys.length)]];
    }

    /*
     * Prueft ob die gegebene Aktion zum aktuellen Spielzeitpunkt sinnvoll verwertbar ist. Die Aktion sollte verworfen
     * werden, falls diese Funktion false zurückgibt
     * @return {boolean}
     *         False, wenn Spielrunde nicht gestartet oder wenn der in der Aktion genannte Spieler nicht (mehr) im Spiel ist
     */
    istAktionImAktuellenSpielstatusVerwertbar(aktion : IAktion) {
        let spielerIdx : number = this.spieler.findIndex((elem : Spieler) => this.aktuelleSpielrunde.getGewuenschterSpieler().name === elem.name);
        return this.spielrundenUhr != null && spielerIdx > 0;
    }


}