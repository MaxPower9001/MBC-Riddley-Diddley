/**
 * Created by kk on 04.12.16.
 */
export default class {

    constructor() {
        this._name = null;
        this._spielzuege = [];
        this._verbleibendeLeben = null;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get spielzuege() {
        return this._spielzuege;
    }

    set spielzuege(value) {
        this._spielzuege.add(value);
    }

    get verbleibendeLeben() {
        return this._verbleibendeLeben;
    }

    set verbleibendeLeben(value) {
        this._verbleibendeLeben = value;
    }
}