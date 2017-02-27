import {SpielTimer} from './spieltimer';
import {Aktion, Spielmodus} from './nachrichtentypen';
import {Spieler} from "./spieler";
import Timer = NodeJS.Timer;
import {AktionsTyp, SpielerAuswahlVerfahren} from "../api/nachrichtentypen.interface";

export class Spiel {

    private static spielername_prefix : string = "Spatzl_";

    spielTimer : SpielTimer;
    private timerId : Timer;

    aktuelleAktion : AktionsTyp;
    verstricheneZeit : number;
    spieler : Spieler[];
    lastSpielerIndex : number;
    spielmodus : Spielmodus;
    aktionInTimeAusgefuehrt : boolean;

    constructor() {
        this.spieler = [];
        this.lastSpielerIndex = 0;
    }

    starteSpiel() : void {
        this.aktionInTimeAusgefuehrt = false;
        this.aktuelleAktion = Aktion.getZufallsAktion();
        this.spielTimer = new SpielTimer();
        this.timerId =  setInterval(() => this.pruefeAktionen(this), this.spielmodus.zeitFuerAktion);
        console.log("Created Timer with ID: " + this.timerId);
    }

    pruefeAktionen(thisSpiel) : void {
        // Falls gewünschte Aktion vom gewünschten Spieler in der gewünschten Zeit ausgeführt wurde
        // setze neue Aktion für Spieler
        if (thisSpiel.aktionInTimeAusgefuehrt) {
            thisSpiel.aktuelleAktion = Aktion.getZufallsAktion();
        } else {
            thisSpiel.spielTimer.timer.emit('spiel_timeout');
            clearInterval(this.timerId);
            console.log("Cleared Timer with ID: " + thisSpiel.timerId);
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

    getNextSpieler() : Spieler {
        let nextSpielerIndex : number;
        if(this.spielmodus.auswahlverfahrenSpieler == SpielerAuswahlVerfahren.ZUFALL) {
            nextSpielerIndex = Math.floor(Math.random() * this.spieler.length);
            this.lastSpielerIndex = nextSpielerIndex;
        } else if (this.spielmodus.auswahlverfahrenSpieler == SpielerAuswahlVerfahren.REIUM) {
            if(this.lastSpielerIndex + 1 > this.spieler.length) {
                nextSpielerIndex = 0;
            } else {
                nextSpielerIndex = this.lastSpielerIndex + 1;
            }
        }
        return this.spieler[nextSpielerIndex];
    }


}