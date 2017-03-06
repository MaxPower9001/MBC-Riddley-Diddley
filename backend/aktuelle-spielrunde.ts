import {AktionsTyp} from "../api/nachrichtentypen.interface";
import {Spieler} from "./spieler";

export class AktuelleSpielrunde {

    //------------------JUST FOR DEBUGGING-----------------------
    private aktionen = {
        1 : "LINKSKNOPF",
        2 : "RECHTSKNOPF",
        3 : "SCHÜTTELN",
        4 : "KNOPFUNTEN"
    };
    //-----------------------------------------------------------


    private _beginnInMilliSekunden : number;
    private _endeInMillisekunden : number;
    private gewuenschterAktionsTyp : AktionsTyp;
    private _gewuenschterSpieler : Spieler;
    private spielrundenDauerInSekunden :number;

    constructor(gewuenschterAktionsTyp : AktionsTyp, gewuenschterSpieler : Spieler, spielrundenDauerInSekunden : number) {
        this.gewuenschterAktionsTyp = gewuenschterAktionsTyp;
        this._gewuenschterSpieler = gewuenschterSpieler;
        this.spielrundenDauerInSekunden = spielrundenDauerInSekunden;
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

    get gewuenschterSpieler() : Spieler {
        return this._gewuenschterSpieler;
    }

    istAktionsTypGueltig(aktionsTyp : AktionsTyp, spieler : Spieler ) : boolean {
        // doppelte korrekte Aktionen sind gültig
        console.log("---------------------Gültigkeitsprüfung---------------------");
        console.log("Gesendete Aktion: " + this.aktionen[aktionsTyp]);
        console.log("Gewünschte Aktion: " + this.aktionen[this.gewuenschterAktionsTyp]);
        console.log("");
        console.log("Spieler: " + spieler.name);
        console.log("Gewünschter Spieler: " + this._gewuenschterSpieler.name);
        console.log("");
        console.log("Zeit: " + new Date().getTime());
        console.log("Gewünschte Zeit: " + this._endeInMillisekunden);
        console.log("------------------------------------------------------------");
        return (spieler.name == this.gewuenschterSpieler.name
            && aktionsTyp == this.gewuenschterAktionsTyp
            && this.spielrundenDauerInSekunden <= this._endeInMillisekunden-this._beginnInMilliSekunden);
    }

}