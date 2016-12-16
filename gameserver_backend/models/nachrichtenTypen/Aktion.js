Object.defineProperty(exports, "__esModule", {
    value: true
});

class Aktion {
    constructor(spieler, typ, absolute_uhrzeit) {
        this.spieler = spieler;
        this.typ = typ;
        this.absolute_uhrzeit = absolute_uhrzeit;
    }
}

exports.Aktion = Aktion;