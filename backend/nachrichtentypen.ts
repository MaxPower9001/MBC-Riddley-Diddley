import {ISpielerInfo} from "../api/nachrichtentypen.interface";
import {ISpielmodus} from "../api/nachrichtentypen.interface";
import {SpielerAuswahlVerfahren} from "../api/nachrichtentypen.interface";
import {ISpielGestartet} from "../api/nachrichtentypen.interface";
import {ISpielBeendet} from "../api/nachrichtentypen.interface";
import {IAktion} from "../api/nachrichtentypen.interface";
import {AktionsTyp} from "../api/nachrichtentypen.interface";

export class SpielerInfo implements ISpielerInfo {
    username : string;

    constructor(username : string) {
        this.username = username;
    }

    toString() : string {
        return JSON.stringify(this);
    }
}

export class Spielmodus implements ISpielmodus {
    zeitFuerAktion: number;
    auswahlverfahrenSpieler: SpielerAuswahlVerfahren;
    anzahlLeben: number;

    constructor( zeitFuerAktion : number,
                 auswahlverfahrenSpieler : number,
                 anzahlLeben : number) {
        this.zeitFuerAktion = zeitFuerAktion;
        this.auswahlverfahrenSpieler = auswahlverfahrenSpieler;
        this.anzahlLeben = anzahlLeben;
    }

    toString() : string {
        return JSON.stringify(this);
    }
}

export class SpielGestartet implements ISpielGestartet{
    spielmodus : ISpielmodus;
    beteiligteSpieler : string[];

    constructor( spielmodus : ISpielmodus, beteiligteSpieler : string[]) {
        this.spielmodus = spielmodus;
        this.beteiligteSpieler = beteiligteSpieler;
    }

    toString() : string {
        return JSON.stringify(this);
    }
}

export class SpielBeendet implements ISpielBeendet {}

export class Aktion implements IAktion {
    spieler : string;
    typ : AktionsTyp;

    constructor(spieler : string, typ : AktionsTyp) {
        this.spieler = spieler;
        this.typ = typ;
    };

    toString() : string {
        return JSON.stringify(this);
    }

}