import {AktionsTyp} from "../api/nachrichtentypen.interface";
import {Spieler} from "./spieler";

export class AktuelleSpielrunde {

    private _beginnInMilliSekunden : number;
    private _endeInMillisekunden : number;
    private gewuenschterAktionsTyp : AktionsTyp;
    private gewuenschterSpieler : Spieler;
    private gueltig : boolean; // Gewünschte Aktion vom gewünschten Spieler innerhalb der Zeit erhalten

    constructor(gewuenschterAktionsTyp : AktionsTyp, gewuenschterSpieler : Spieler, spielrundenDauerInSekunden : number) {
        this.gewuenschterAktionsTyp = gewuenschterAktionsTyp;
        this.gewuenschterSpieler = gewuenschterSpieler;
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
        if (spieler.name == this.gewuenschterSpieler.name
            && aktionsTyp == this.gewuenschterAktionsTyp
            && new Date().getTime() <= this._endeInMillisekunden) {
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