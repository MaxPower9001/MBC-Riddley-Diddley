import {MissionControlService} from "./mission-control.service";
import {Spielmodus, AktionsTyp} from "./dtos";
export interface BackendConnectionServiceInterface {

    setMissionControlService(missionControlService : MissionControlService) : void;
    connectToGameserver() : void;
    starteSpiel(spielmodus : Spielmodus) : void;
    aktionDone(aktion: AktionsTyp): void;

}