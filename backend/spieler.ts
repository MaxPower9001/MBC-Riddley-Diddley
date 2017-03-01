export class Spieler {

    name : string;
    spielzuege : any[];
    verbleibendeLeben : number;

    constructor() {
        this.name = null;
        this.spielzuege = [];
        this.verbleibendeLeben = null;
    }

    toString() : string {
        return JSON.stringify(this);
    }
}