import {AktionsTyp} from "../api/nachrichtentypen.interface";
import {Spieler} from "./spieler";

export class AktuelleSpielrunde {

    private _beginnInMilliSekunden : number;
    private _endeInMillisekunden : number;
    private gewuenschterAktionsTyp : AktionsTyp;
    private gewuenschterSpieler : Spieler;
    private gueltig : boolean; // Gewünschte Aktion vom gewünschten Spieler innerhalb der Zeit erhalten
    private spielrundenDauerInSekunden :number;

    constructor(gewuenschterAktionsTyp : AktionsTyp, gewuenschterSpieler : Spieler, spielrundenDauerInSekunden : number) {
        this.gewuenschterAktionsTyp = gewuenschterAktionsTyp;
        this.gewuenschterSpieler = gewuenschterSpieler;
        this.spielrundenDauerInSekunden = spielrundenDauerInSekunden;
        this.gueltig = false;
    }

    get beginnInMilliSekunden(): number {
        return this._beginnInMilliSekunden;
    }

    set beginnInMilliSekunden(value: number) {
        this._beginnInMilliSekunden = value;
    }

    get endeInMillisekunden(): number {
        return this._endeInMillisekunden;
    }

    set endeInMillisekunden(value: number) {
        this._endeInMillisekunden = value;
    }

    istAktionsTypGueltig(aktionsTyp : AktionsTyp, spieler : Spieler ) : boolean {
        // doppelte korrekte Aktionen sind gültig
        console.log("---------------------Gültigkeitsprüfung---------------------");
        console.log("Gesendete Aktion: " + aktionsTyp);
        console.log("Gewünschte Aktion: " + this.gewuenschterAktionsTyp);
        console.log("");
        console.log("Spieler: " + spieler.name);
        console.log("Gewünschter Spieler: " + this.getGewuenschterSpieler().name);
        console.log("");
        console.log("Zeit: " + new Date().getTime());
        console.log("Gewünschte Zeit: " + this._endeInMillisekunden);
        console.log("------------------------------------------------------------");
        if (spieler.name == this.gewuenschterSpieler.name
            && aktionsTyp == this.gewuenschterAktionsTyp
            && this.spielrundenDauerInSekunden <= this._endeInMillisekunden-this._beginnInMilliSekunden) {
            this.gueltig = true;
            return true;
        }
        return false;
    }

    istSpielrundeGueltig() : boolean {
        return this.gueltig;
    }

    getGewuenschterSpieler() : Spieler {
        return this.gewuenschterSpieler;
    }

}