import {MissionControlService} from "./mission-control.service";
import {Spielmodus} from "./nachrichtentypen";
import {AktionsTyp} from "../api/nachrichtentypen.interface";
export interface BackendConnectionServiceInterface {

    setMissionControlService(missionControlService : MissionControlService) : void;
    connectToGameserver() : void;
    starteSpiel(spielmodus : Spielmodus) : void;
    aktionDone(aktion: AktionsTyp): void;

}