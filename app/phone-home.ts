import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService } from './mission-control.service';
import { Spielinfo, SpielGestartet, Spielmodus } from "./dtos";

declare var connectToGameserver: any;

@Component({
	selector: 'phone-home',
	styles: [`
		.panel {
			background-color: coral	;
		}

		.panel:nth-child(odd) {
			background-color: yellowgreen;
		}
		
	`],
	template: `
		<div class="alert alert-success" role="alert">
			<h1>Hi {{username}},</h1> 
			<p>folgende Spielmodi stehen dir zur Auswahl:</p>
		</div>
		
		<div class="alert alert-info">Clicke auf gewünschten Spielmodus um das spiel zu starten</div>
		<div class="panel panel-default" *ngFor="let spielmodus of spielmodi">
			<div class="panel-body">
				<p class="hidden">{{printSpielmodus(spielmodus)}}</p>
				<ul class="list-group">
					<li class="list-group-item" *ngFor="let keyval of spielmodus | keys">
						{{keyval.key}}: {{keyval.value}}
					</li>
				</ul>
				<button class="btn btn-primary" (click)="starteSpiel(spielmodus)">Spiel starten</button>
				
			</div>
		</div>
    `
})

export class PHONE_Home implements OnInit {

	spielmodi: Spielmodus[];
	username: string;

	constructor(private missionControlService: MissionControlService, private router: Router) { }

	ngOnInit() {
		let that = this;
		this.missionControlService.spielinfofromGameserver$.subscribe(function (spielinfo: Spielinfo) {
			that.spielmodi = spielinfo.spielmodi;
			that.username = spielinfo.username;
			console.log("Spielinfo vom Server erhalten: " + spielinfo);
		});
		this.missionControlService.spielGestartet$.subscribe(function (spielGestartet: SpielGestartet) {
			console.log("SpielGestartet vom Server erhalten: " + spielGestartet);
			that.router.navigateByUrl("/phone-play");
		});
		this.missionControlService.connectToGameserver();
	}

	starteSpiel(spielmodus: Spielmodus) {
		this.missionControlService.starteSpiel(spielmodus);
	}

	printSpielmodus(spielmodus: Spielmodus) {
		return (new Spielmodus(spielmodus.schwierigkeit, spielmodus.zeitFuerAktion, spielmodus.auswahlverfahrenSpieler, spielmodus.anzahlLeben)).toString();
	}
}