import {SpielTimer} from './SpielTimer';
import {Aktion, AktionsTyp, Spielmodus} from './nachrichtentypen';
import {Spieler} from "./Spieler";
import Timer = NodeJS.Timer;

export class Spiel {

    spielTimer : SpielTimer;
    private timerId : Timer;

    aktuelleAktion : AktionsTyp;
    verstricheneZeit : number;
    spieler : Spieler[];
    spielmodus : Spielmodus;
    aktionInTimeAusgefuehrt : boolean;

    constructor() {
        this.spieler = [];
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

    addSpieler(spieler : Spieler) : void {
        this.spieler.push(spieler);
    }

    spieleranzahl() : number {
        return this.spieler.length + 1;
    }


}