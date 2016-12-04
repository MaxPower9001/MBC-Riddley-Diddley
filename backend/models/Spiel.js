/**
 * Created by kk on 04.12.16.
 */
Object.defineProperty(exports, "__esModule", {
    value: true
});
class Spiel{

    constructor() {
        this._aktuelleAktion = null;
        this._verstricheneZeit = null;
        this._spieler = [];
        this._spielmodus = null;
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
}
exports.Spiel = Spiel;