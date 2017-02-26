import {ISpielerInfo} from "../api/nachrichtentypen.interface.js";
import {ISpielmodus} from "../api/nachrichtentypen.interface.js";
import {SpielerAuswahlVerfahren} from "../api/nachrichtentypen.interface.js";
import {ISpielGestartet} from "../api/nachrichtentypen.interface.js";
import {ISpielBeendet} from "../api/nachrichtentypen.interface.js";
import {IAktion} from "../api/nachrichtentypen.interface.js";
import {AktionsTyp} from "../api/nachrichtentypen.interface.js";

export class SpielerInfo implements ISpielerInfo {
    username : string;

    constructor(spielerInfo : SpielerInfo) {
        this.username = spielerInfo.username;
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

    static getZufallsAktion () : number {
        let keys = Object.keys(AktionsTyp);
        return AktionsTyp[keys[ keys.length * Math.random() << 0]];
    };
}