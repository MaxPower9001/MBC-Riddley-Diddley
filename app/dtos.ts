
export class Spielinfo {
    spielmodi : Spielmodus[];
    username : string;

    constructor(spielmodi : Spielmodus[], username : string) {
        this.spielmodi = spielmodi;
        this.username = username;
    };

    toString() : string {
        return "Spielinfo[spielmodi='" + this.spielmodi + "',username='" + this.username + "']";
    }
}

export class Spielmodus {
    schwierigkeit: string;
    zeitFuerAktion: number;
    auswahlverfahrenSpieler: number;
    anzahlLeben: number;

    constructor( schwierigkeit : string,
                 zeitFuerAktion : number,
                 auswahlverfahrenSpieler : number,
                 anzahlLeben : number) {
        this.schwierigkeit = schwierigkeit;
        this.zeitFuerAktion = zeitFuerAktion;
        this.auswahlverfahrenSpieler = auswahlverfahrenSpieler;
        this.anzahlLeben = anzahlLeben;
    };

    toString() : string {
        return `Spielmodus[schwierigkeit='${this.schwierigkeit}',zeitFuerAktion='${this.zeitFuerAktion}',` +
            `auswahlverfahrenSpieler='${this.auswahlverfahrenSpieler}',anzahlLeben='${this.anzahlLeben}']`;
    }
}

export class SpielGestartet {
    anzahlSpieler : string;

    constructor( anzahlSpieler : string) {
        this.anzahlSpieler = anzahlSpieler;
    }

    toString() : string {
        return `SpielGestaret[anzahlSpieler='${this.anzahlSpieler}']`;
    }
}

// noch nicht final spezifiziert
export class SpielBeendet {
    spielinfo_gesamt : string;

    constructor( spielinfo_gesamt : string) {
        this.spielinfo_gesamt = spielinfo_gesamt;
    }

    toString() : string {
        return `SpielBeendet[spielinfo_gesamt='${this.spielinfo_gesamt}']`;
    }
}
