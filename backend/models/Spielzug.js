/**
 * Created by kk on 04.12.16.
 */

class Spielzug {

    constructor(aktionAusgefuehrt, aktionGewuenscht, verstricheneZeit) {
        this._aktionAusgefuehrt = aktionAusgefuehrt;
        this._aktionGewuenscht = aktionGewuenscht;
        this._verstricheneZeit = verstricheneZeit;
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