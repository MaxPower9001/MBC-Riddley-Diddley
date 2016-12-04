/**
 * Created by kk on 04.12.16.
 */

class Spielzug {

    constructor() {
        this._aktionAusgefuehrt = null;
        this._aktionGewuenscht = null;
        this._verstricheneZeit = null;
    }

    get aktionAusgefuehrt() {
        return this._aktionAusgefuehrt;
    }

    set aktionAusgefuehrt(value) {
        this._aktionAusgefuehrt = value;
    }

    get aktionGewuenscht() {
        return this._aktionGewuenscht;
    }

    set aktionGewuenscht(value) {
        this._aktionGewuenscht = value;
    }

    get verstricheneZeit() {
        return this._verstricheneZeit;
    }

    set verstricheneZeit(value) {
        this._verstricheneZeit = value;
    }
}