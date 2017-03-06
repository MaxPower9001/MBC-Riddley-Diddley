import {Injectable} from "@angular/core";
import {BackendConnectionServiceInterface} from "./backend-connection.service.interface";
import {MissionControlService} from "./mission-control.service";
import {
    AktionsTyp,
    ISpielmodus,
    ISpielBeendet,
    IAktion,
    ISpielVerloren,
    ISpielGestartet,
    IUngueltigeAktionOderTimeout,
    ISpielerInfo
} from "../api/nachrichtentypen.interface";

@Injectable()
export class BackendConnectionRestService implements BackendConnectionServiceInterface {
    setMissionControlService(missionControlService: MissionControlService): void {
    }

    sendSpielmodus(spielmodus: ISpielmodus): void {
    }

    sendAktion(aktion: AktionsTyp): void {
    }

    onSpielBeendet(spielbeendet: ISpielBeendet): void {
    }

    onAktion(aktion: IAktion): void {
    }

    onSpielVerloren(spielVerloren: ISpielVerloren): void {
    }

    onSpielGestartet(spielGestartet: ISpielGestartet): void {
    }

    onUngueltigeAktionOderTimeout(ungueltigeAktionOderTimeout: IUngueltigeAktionOderTimeout): void {
    }

    onSpielerinfo(spielerinfo: ISpielerInfo): void {
    }

}
