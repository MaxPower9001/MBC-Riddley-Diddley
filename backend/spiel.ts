import {Aktion, Spielmodus} from './nachrichtentypen';
import {Spieler} from "./spieler";
import Timer = NodeJS.Timer;
import {AktionsTyp, SpielerAuswahlVerfahren} from "../api/nachrichtentypen.interface";
import {AktuelleSpielrunde} from "./aktuelle-spielrunde";
import {Subject, Observable} from "rxjs";

export class Spiel {

    private static spielername_prefix : string = "Spatzl_";

    private aktuelleSpielrunde : AktuelleSpielrunde;
    private spielrundenUhr : Timer;

    private spielBeendet : Subject<any>;
    private neueSpielrunde : Subject<any>;

    spielBeendet$ : Observable<any>;
    neueSpielrunde$ : Observable<any>;

    spieler : Spieler[];
    spielmodus : Spielmodus;

    constructor() {
        this.spieler = new Array<Spieler>();
        this.spielBeendet = new Subject();
        this.neueSpielrunde = new Subject();
        this.spielBeendet$ = this.spielBeendet.asObservable();
        this.neueSpielrunde$ = this.neueSpielrunde.asObservable();
        this.spielmodus = null;
    }

    starteSpiel(spielmodus : Spielmodus) : void {
        this.spielmodus = spielmodus;
        // Setze die Anzahl der Leben jedes Spielers wie im Spielmodi definiert
        this.spieler.forEach((spieler) => spieler.verbleibendeLeben = spielmodus.anzahlLeben);
        this.starteSpielrunde();
    }

    beendeSpiel() : void {
        if(this.spielrundenUhr) clearInterval(this.spielrundenUhr);
        this.spielBeendet.next("Hier koennte eine interessante Statistik des Spiels uebertragen werden");
    }

    starteSpielrunde() : void {
        console.log("eine neue spielrunde beginnt!");
        // Neue Runde erstellen
        this.aktuelleSpielrunde = new AktuelleSpielrunde(this.getNextAktionsTyp(), this.getNextSpieler(), this.spielmodus.zeitFuerAktion);
        // Stoppuhr zurücksetzen
        if(this.spielrundenUhr) clearInterval(this.spielrundenUhr);
        this.neueSpielrunde.next("Hier könnten interessante Infos ueber die Spielrunde stehen");
        // folgendes wird ausgeführt, falls innerhalb der aktuellen Spielrunde keine korrekte Aktion eingetroffen ist
        this.spielrundenUhr =  setInterval(() => this.ungueltigeAktion(this.aktuelleSpielrunde.getGewuenschterSpieler()), this.spielmodus.zeitFuerAktion * 1000);
    }

    pruefeErhalteneAktion(aktionsTyp : AktionsTyp, spieler : Spieler) {
        if(this.aktuelleSpielrunde.istAktionsTypGueltig(aktionsTyp,spieler)) {
            this.starteSpielrunde();
        } else {
            this.ungueltigeAktion(spieler);
        }
    }

    addSpieler() : Spieler {
        let spieler : Spieler = new Spieler();
        spieler.name = Spiel.spielername_prefix + (this.spieleranzahl() + 1);
        this.spieler.push(spieler);
        return spieler;
    }

    spieleranzahl() : number {
        return this.spieler.length;
    }

    getSpielernamen() : string[] {
        return this.spieler.map((s : Spieler) => s.name);
    }

    getSpielerFromSpielerliste(spielername : string) : Spieler {
        return this.spieler.find(spieler => spieler.name == spielername);
    }

    getNextSpieler() : Spieler {
        if(!this.aktuelleSpielrunde) return this.spieler[0]; // Fuer denn Fall: erste Spielrunde im Spiel
        let lastSpielerIndex : number;
        let nextSpielerIndex : number;
        lastSpielerIndex = this.spieler.findIndex((elem : Spieler) => this.aktuelleSpielrunde.getGewuenschterSpieler().name == elem.name);
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

    ungueltigeAktion(spieler : Spieler) {
        console.log("ungueltige Aktion, d.h. keine Aktion gesendet, oder falsche");
        spieler.verbleibendeLeben--;
        if(spieler.verbleibendeLeben <= 0) {
            this.beendeSpiel();
        } else {
            this.starteSpielrunde();
        }
    }


}