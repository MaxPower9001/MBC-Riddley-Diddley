/*
 * VERWENDETE BEGRIFFE
 * ===================
 * Client     - ein Spieler oder der Fernseher
 * Spieler    - ist aktiv am Spiel beteiligt; sendet Aktionen an den Gameserver; ist i.d.R. ein Smartphone
 * Fernseher  - ist nur passiv am Spiel beteiligt; erhält vom Gameserver alle Informationen über den aktuellen Zustand des Spiels
 * Gameserver - ist die Instanz, die für die Einhaltung der Spielregeln zuständig ist; fordert Spieler zu Aktionen auf
 *              versorgt Clients mit allen relevanten Informationen
 */


/*
 * Information über den Spieler, wird vom Gameserver nach dem Verbinden an den jeweiligen Spieler gesendet
 * @property {string} username             - eindeutiger Spielername (wird vom Gameserver festgelegt)
 */
export interface ISpielerInfo {
    username : string;
}

/*
 * Zeigt an welche Spielregeln für das Spiel gelten (sollen); wird von einem Spieler an den Gameserver gesendet
 * Der Gameserver erstellt anhand dieser Informationen das Spiel
 * @property {number} zeitFuerAktion       - gibt die maximale Zeit in Sekunden an, bis die geforderte Aktion den
 *                                           Gameserver erreichen muss, um einen gültigen Spielzug zu erzeugen
 * @property {SpielerAuswahlVerfahren} auswahlverfahrenSpieler    - gibt das Verfahren an, mit dem der nächste Spieler
 *                                           aus der Menge der am Spiel beteiligten Spieler ausgewählt wird (wird
 *                                           anschließend zu einer Aktion aufgefordert)
 *                                           (Hinweis: im JSON wird letztlich ausschließlich die Zahl übertragen,
 *                                            siehe SpielerAuswahlVerfahren)
 * @property {number} anzahlLeben          - gibt die Anzahl der Leben an die jeder Spieler beim Spielstart erhält
 *                                           ein ungültiger Spielzug (falsche Aktion oder zu spät) kostet ein Leben
 *                                           muss größer oder gleich 1 sein
 */
export interface ISpielmodus {
    zeitFuerAktion: number;
    auswahlverfahrenSpieler: SpielerAuswahlVerfahren;
    anzahlLeben: number;
}

/*
 * Information über das gestartete Spiel, wird vom Gameserver an alle Clients gesendet sobald das Spiel gestartet wurde
 * @property {ISpielmodus} spielmodus      - gibt den Spielmodus an der gespielt wird
 * @property {string[]} beteiligteSpieler  - eine Liste aller am Spiel beteiligter Spieler, dargestellt durch Spielernamen
 */
export interface ISpielGestartet {
    spielmodus : ISpielmodus;
    beteiligteSpieler : string[];
}

/*
 * Information über das beendete Spiel, wird vom Gameserver an alle Clients gesendet sobald das Spiel beendet wurde
 * Hierüber könnte in einer zukünftigen Version vom Gameserver interessante Informationen über das gespielte Spiel übermittelt werden
 * Derzeit nur zur Signalisierung verwendet
 */
export interface ISpielBeendet {}

/*
 * Wenn geschickt von Gameserver an Spieler:
 * Der Gameserver sendet die auszführende Aktion an einen Spieler der die Aktion durchführen soll.
 *
 * Wenn geschickt von Spieler an Gameserver:
 * Übermittelt die vom Spieler ausgeführte Aktion an den Gameserver.
 * Username dient dazu Eingaben zu identifizieren, die ein Spieler getätigt hat, der nicht an der Reihe ist.
 *
 * @property {string} spieler               - Spielername der die Aktion ausführen soll, bzw. der die Aktion ausgeführt hat
 * @property {AktionsTyp} typ               - Aktionstyp der ausgeführt werden soll, bzw. der ausgeführt wurde
 */
export interface IAktion {
    spieler : string;
    typ : AktionsTyp;
}

export enum AktionsTyp {
    LINKSKNOPF = 1,
    RECHTSKNOPF = 2,
    SCHUETTELN = 3
}

export enum SpielerAuswahlVerfahren {
    REIUM = 1,
    ZUFALL = 2,
}
