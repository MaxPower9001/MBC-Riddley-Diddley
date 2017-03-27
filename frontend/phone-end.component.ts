import { Component, OnInit, EventEmitter } from '@angular/core';
import { MissionControlService } from './mission-control.service';
import {Router} from "@angular/router";
import {ISpielBeendet} from "../api/nachrichtentypen.interface";


@Component({
	selector: 'phone-end',
	template: `
		<phone-header></phone-header>

		<div class="viewport">
			<h3>Das Spiel ist vorbei!</h3>
			<h4>gg Thanks</h4>
			<h4>Bye</h4>
			<button class="btn btn-primary start" *ngIf="spielBeendet" (click)="joinNewGame()">Neue Runde!</button>
		</div>
	`
})

export class PhoneEndComponent implements OnInit {

	spielBeendet = false;
	timeBetweenGamesInSeconds = 5;
	
	constructor(private missionControlService: MissionControlService, private router: Router) {
	}

	ngOnInit() {
		// Relevant wenn Spieler verloren hat, aber noch andere Spieler im Spiel sind
		this.missionControlService.spielBeendet$.subscribe((spielGestartet: ISpielBeendet) => {
			console.log("SpielBeendet vom Server erhalten: " + spielGestartet);
			this.missionControlService.disconnect();
			setTimeout(() => this.spielBeendet = true,this.timeBetweenGamesInSeconds*1000);
		});

	}

	joinNewGame() {
		this.router.navigateByUrl("/smartphone");
	}
}