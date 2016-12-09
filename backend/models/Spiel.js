//var events = require('events');
// class MyEmitter extends EventEmitter {}
//var spielTimer = new events.EventEmitter();

var spielTimer = require('./SpielTimer.js').spielTimer;
var Aktion = require('./Aktion.js');
var timerId;


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
        this._aktuelleAktion = Aktion.getZufallsAktion();
        timerId = setInterval(this._pruefeAktionen, this.spielmodus.zeitFuerAktion);
        console.log("Created Timer with ID: " + timerId);
    }

    _pruefeAktionen() {
        // Falls gewünschte Aktion vom gewünschten Spieler in der gewünschten Zeit ausgeführt wurde
        // setze neue Aktion für Spieler
        if (this._aktionInTimeAusgefuehrt) {
            this._aktuelleAktion = Aktion.getZufallsAktion();
        } else {
            spielTimer.emit('spiel_timeout');
            clearInterval(timerId);
            console.log("Cleared Timer with ID: " + timerId);
        }
    }


}
exports.Spiel = Spiel;