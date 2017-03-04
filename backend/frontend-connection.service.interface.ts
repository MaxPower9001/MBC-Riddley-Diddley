import {
    AktionsTyp, ISpielBeendet, ISpielmodus, IAktion, ISpielGestartet,
    ISpielerInfo, ISpielVerloren, IUngueltigeAktionOderTimeout
} from "../api/nachrichtentypen.interface";

/*
 * Stellt Methoden zur Verfügung um den Austausch der Nachrichtentypen zwischen Front- und Backend zu ermöglichen.
 */
export interface FrontendConnectionServiceInterface {

    /*
     * Sendet die IAktion an den darin genannten Spieler und zusätzlich an den Fernseher. Blockiert bis davon ausgegangen
     * werden kann, das die IAktion den Fernseher erreicht hat.
     * @property {IAktion} aktion
     *           IAktion die in der aktuellen Spielrunde ausgeführt werden soll
     */
    sendAktion(aktion: IAktion): void;

    /*
     * Sendet ISpielGestartet an alle Clients um den Beginn des Spieles anzuzeigen. Blockiert bis davon ausgegangen
     * werden kann, das ISpielGestartet alle Spieler und den Fernseher erreicht hat.
     * @property {ISpielGestartet} spielGestartet
     *           ISpielGestartet des gestarteten Spiels
     */
    sendSpielGestartet(spielGestartet: ISpielGestartet): void;

    /*
     * Sendet ISpielBeendet an alle Clients um das Ende des Spieles anzuzeigen
     * @property {ISpielBeendet} spielBeendet
     *           ISpielBeendet des beendeten Spiels
     */
    sendSpielBeendet(spielBeendet: ISpielBeendet): void;

    /*
     * Sendet eine ISpielerInfo an denjenigen Spieler der die Verbindung aufgebaut hat und zusätzlich an den Fernseher
     * @property {ISpielerInfo} spielerInfo
     *           ISpielerInfo des Spielers (Clients), der die Verbindung aufgebaut hat
     */
    sendSpielerInfo(spielerInfo: ISpielerInfo): void;

    /*
     * Sendet eine ISpielVerloren an denjenigen Spieler der das Spiel verloren hat und zusätzlich an den Fernseher..
     * Dieser Fall tritt ein, wenn der Spieler keine Leben mehr hat
     * @property {ISpielVerloren} spielVerloren
     */
    sendSpielVerloren(spielVerloren: ISpielVerloren) : void;

    /*
     * Sendet eine IUngueltigeAktionOderTimeout an den Fernseher.
     * @property {IUngueltigeAktionOderTimeout} ungueltigeAktionOderTimeout
     *           IUngueltigeAktionOderTimeout für den Spieler der eine ungültige Aktion ausgelöst hat oder zu spät reagiert hat
     */
    sendUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout) : void;

}