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
		
	`],
	template: `

		<phone-header></phone-header>
		&nbsp;
		<div class="viewport">
			<!-- Beschreibung des Auswählmodus -->
			<h4>Auswählmodus</h4>
			<div class="btn-group" data-toggle="buttons">
				<label class="btn btn-primary" *ngFor="let keyval of auswahlVerfahrenSpielerMoeglichkeiten | keys"
				(click)="setAuswahlVerfahrenSpieler(keyval.value)">
					<input type="radio" name="spielverfahren" id="{{keyval.value}}" autocomplete="off" checked>{{keyval.key}}
				</label>
			</div>

			<!-- Aktions Zeit -->
			<h4>Zeit für Aktion</h4>
			<div class="btn-group" data-toggle="buttons">
				<label class="btn btn-default"  *ngFor="let zeitFuerAktion of zeitFuerAktionMoeglichkeiten"
					(click)="setZeitFuerAktion(zeitFuerAktion)">
					<input type="radio" name="aktionsmoeglichkeiten" id="{{zeitFuerAktion}}" autocomplete="off" checked>{{zeitFuerAktion}}
				</label>
			</div>
			
			<!-- Spielleben -->
			<h4>Leben</h4>
			<div class="btn-group" data-toggle="buttons">
				<label class="btn btn-default" *ngFor="let anzahlLeben of anzahlLebenMoeglichkeiten"
					(click)="setAnzahlLeben(anzahlLeben)">
					<input type="radio" name="aktionsmoeglichkeiten" id="{{zeitFuerAktion}}" autocomplete="off" checked>
					<span class="glyphicon glyphicon-heart-empty"></span>
				</label>
			<div>
			&nbsp;&nbsp;&nbsp;
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