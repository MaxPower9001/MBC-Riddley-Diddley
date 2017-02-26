import {Injectable} from '@angular/core';
import {BackendConnectionServiceInterface} from './backend-connection.service.interface';
import {MissionControlService} from "./mission-control.service";
import {Spielmodus, AktionsTyp} from "./nachrichtentypen";

@Injectable()
export class BackendConnectionRestService implements BackendConnectionServiceInterface {
    setMissionControlService(missionControlService: MissionControlService): void {
        // TODO
    }

    connectToGameserver(): void {
        // TODO
    }

    starteSpiel(spielmodus: Spielmodus): void {
        // TODO
    }

    aktionDone(aktion: AktionsTyp): void {
        // TODO
    }
}
