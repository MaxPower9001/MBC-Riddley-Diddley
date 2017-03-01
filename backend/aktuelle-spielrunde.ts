import {AktionsTyp} from "../api/nachrichtentypen.interface";
import {Spieler} from "./spieler";

export class AktuelleSpielrunde {

    private beginnInMilliSekunden : number;
    private endeInMillisekunden : number;
    private gewuenschterAktionsTyp : AktionsTyp;
    private gewuenschterSpieler : Spieler;
    private gueltig : boolean; // Gewünschte Aktion vom gewünschten Spieler innerhalb der Zeit erhalten

    constructor(gewuenschterAktionsTyp : AktionsTyp, gewuenschterSpieler : Spieler, spielrundenDauerInSekunden : number) {
        this.gewuenschterAktionsTyp = gewuenschterAktionsTyp;
        this.gewuenschterSpieler = gewuenschterSpieler;
        this.gueltig = false;
        this.beginnInMilliSekunden = new Date().getTime();
        this.endeInMillisekunden = this.beginnInMilliSekunden + spielrundenDauerInSekunden+1000;
    }

    istAktionsTypGueltig(aktionsTyp : AktionsTyp, spieler : Spieler ) : boolean {
        // doppelte korrekte Aktionen sind gültig
        if (spieler.name == this.gewuenschterSpieler.name
            && aktionsTyp == this.gewuenschterAktionsTyp
            && new Date().getTime() <= this.endeInMillisekunden) {
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