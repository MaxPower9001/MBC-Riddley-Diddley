import {AktionsTyp} from "../api/nachrichtentypen.interface";
export class Spielzug {

    aktionAusgefuehrt : AktionsTyp;
    aktionGewuenscht : AktionsTyp;
    verstricheneZeit : number;

    constructor(aktionAusgefuehrt, aktionGewuenscht, verstricheneZeit) {
        this.aktionAusgefuehrt = aktionAusgefuehrt;
        this.aktionGewuenscht = aktionGewuenscht;
        this.verstricheneZeit = verstricheneZeit;
    }

    toString() : string {
        return JSON.stringify(this);
    }

}