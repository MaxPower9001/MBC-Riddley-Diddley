import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService } from './mission-control.service';
import {SpielGestartet, SpielerInfo, Spielmodus} from "./nachrichtentypen";
import {SpielerAuswahlVerfahren} from '../api/nachrichtentypen.interface.js';

@Component({
	selector: 'phone-home',
	styles: [`
		.panel {
			background-color: yellowgreen	;
		}

		.panel:nth-child(odd) {
			background-color: chocolate;
		}
		.viewport{
    height:80%;
    width:100%;
}
		
	`],
	template: `

		<phone-header></phone-header>
		&nbsp;
		<div class="viewport">
				<ul>
					<li class="list-group-item" *ngFor="let keyval of auswahlVerfahrenSpielerMoeglichkeiten | keys"
					 (click)="setAuswahlVerfahrenSpieler(keyval.value)">
						<!-- Beschreibung des Auswahlverfahrens -->
						{{keyval.key}}
					</li>
				</ul>
				<ul>
					<li class="list-group-item zeitFuerAktion" *ngFor="let zeitFuerAktion of zeitFuerAktionMoeglichkeiten"
					    (click)="setZeitFuerAktion(zeitFuerAktion)">{{zeitFuerAktion}}</li>
				</ul>
				<ul>
					<li class="list-group-item glyphicon glyphicon-heart-empty" *ngFor="let anzahlLeben of anzahlLebenMoeglichkeiten"
					    (click)="setAnzahlLeben(anzahlLeben)"></li>
				</ul>
		<button class="btn btn-primary" (click)="starteSpiel()">Spiel starten</button>
		</div>
    `
})

export class PhoneHomeComponent implements OnInit {

	auswahlVerfahrenSpielerMoeglichkeiten = {
		"Reium" : SpielerAuswahlVerfahren.REIUM ,
		"Zufällig" : SpielerAuswahlVerfahren.ZUFALL
	};
	zeitFuerAktionMoeglichkeiten = [1,2,3,4];
	anzahlLebenMoeglichkeiten = [1,2,3,4];
	username: string;
	spielmodus : Spielmodus;


	constructor(private missionControlService: MissionControlService, private router: Router) {	}

	ngOnInit() {
		let that = this;
		this.missionControlService.spielGestartet$.subscribe(function (spielGestartet: SpielGestartet) {
			console.log("SpielGestartet vom Server erhalten: " + spielGestartet);
			that.router.navigateByUrl("/phone-play");
		});
		// set default values
		this.spielmodus = new Spielmodus(1, SpielerAuswahlVerfahren.ZUFALL, 5);
	}

	starteSpiel() {
		// this.spielmodus = new Spielmodus(
		// 	this.spielmodus.zeitFuerAktion,
		// 	this.spielmodus.auswahlverfahrenSpieler,
		// 	this.spielmodus.anzahlLeben);
		console.log(this.spielmodus);
		this.missionControlService.starteSpiel(this.spielmodus);
	}

	setAuswahlVerfahrenSpieler(auswahlVerfahrenSpieler : SpielerAuswahlVerfahren) {
		// TODO markiere geklicktes Verfahren
		this.spielmodus.auswahlverfahrenSpieler = auswahlVerfahrenSpieler;
	}

	setZeitFuerAktion(zeitFuerAktion : number) {
		// TODO markiere geklickte Zahl
		this.spielmodus.zeitFuerAktion = zeitFuerAktion;
	}

	setAnzahlLeben(anzahlLeben : number) {
		// TODO passe class an zwecks Herz Symbol ausgefüllt/leer
		this.spielmodus.anzahlLeben = anzahlLeben;
	}
}