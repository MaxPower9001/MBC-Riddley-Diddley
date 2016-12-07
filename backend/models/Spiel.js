//var events = require('events');
// class MyEmitter extends EventEmitter {}
//var myEmitter = new events.EventEmitter();

var myEmitter = require('./MyEmitter.js');


Object.defineProperty(exports, "__esModule", {
    value: true
});
class Spiel{

    constructor() {
        this._aktuelleAktion = null;
        this._verstricheneZeit = null;
        this._spieler = [];
        this._spielmodus = null;
        this._aktionInTimeAusgefuehrt = true;
        this._myEmitter = null;
    }

    get aktuelleAktion() {
        return this._aktuelleAktion;
    }

    set aktuelleAktion(value) {
        this._aktuelleAktion = value;
    }

    get verstricheneZeit() {
        return this._verstricheneZeit;
    }

    set verstricheneZeit(value) {
        this._verstricheneZeit = value;
    }

    get spieler() {
        return this._spieler;
    }

    set spieler(value) {
        this._spieler.push(value);
    }

    get spielmodus() {
        return this._spielmodus;
    }

    set spielmodus(value) {
        this._spielmodus = value;
    }

    get myEmitter() {
        return this._myEmitter;
    }

    set myEmitter(value) {
        this._myEmitter = value;
    }

    starteSpiel() {
        this._aktionInTimeAusgefuehrt = false;
        setInterval(this._pruefeAktionen, this.spielmodus.zeitFuerAktion);
    }

    _pruefeAktionen() {
        if (!(this._aktionInTimeAusgefuehrt)) {
            console.log("los gehts");
            myEmitter.emit('spiel_timeout');
        }
    }

}
exports.Spiel = Spiel;