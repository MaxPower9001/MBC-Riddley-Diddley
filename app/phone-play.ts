import { Component, OnInit, HostListener } from '@angular/core';
import { MissionControlService } from './mission-control.service';
import { Aktion, AktionsTyp } from "./dtos";
var Shake = require('../js/shake.js');

@Component({
	selector: 'phone-play',
	template: `
		<div class="alert alert-success" role="alert">
			<h3>Das Spiel wurde gestartet!</h3> 
		</div>

		<div class="row">
			<div class="col-md-6 col-sm-6 col-xs-6">
				<button class="btn btn-primary" (click)="leftButton()">Left Button</button>
			</div>
			<div class="col-md-6 col-sm-6 col-xs-6">
				<button class="btn btn-success" (click)="rightButton()">Right Button</button>
			</div>
		</div>
	`
})

export class PHONE_Play implements OnInit {

	constructor(private missionControlService: MissionControlService) {

	}

	ngOnInit() {
		var myShakeEvent = new Shake({
			threshold: 1, // optional shake strength threshold
			timeout: 1000 // optional, determines the frequency of event generation
		});
		myShakeEvent.start();

		this.missionControlService.aktionFromGameServer$.subscribe(function (aktion: Aktion) {
			
			console.log("Spielinfo vom Server erhalten: " + aktion);
		});
	}

	@HostListener('window:shake')
	shakeMe() {
		this.missionControlService.aktionDone(AktionsTyp.SCHUETTELN);
	}

	leftButton() {
		this.missionControlService.aktionDone(AktionsTyp.LINKSKNOPF);
	}

	rightButton() {
		this.missionControlService.aktionDone(AktionsTyp.RECHTSKNOPF);
	}

}