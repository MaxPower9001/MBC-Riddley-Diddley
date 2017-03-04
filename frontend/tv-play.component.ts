import { Component, OnInit, DoCheck, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService }     from './mission-control.service';
import {SpielGestartet, Spielmodus, Aktion, UngueltigeAktionOderTimeout, SpielVerloren} from "./nachrichtentypen";
import {AktionsTyp} from "../api/nachrichtentypen.interface";

@Component({
	selector: 'tv-play',
	styles: [`
#myProgress {
	width: 100%;
	background-color: grey;
}
#myBar {
	width: 100%;
	height: 30px;
	background-color: #4CAF50;
	text-align: center; /* To center it horizontally (if you want) */
	line-height: 30px; /* To center it vertically */
	color: white; 
}
		
	`],
	template: `
		<tv-header></tv-header>	
        <!--Dont know why but we need text here or otherwise all elements are behind the tv-header, yay bootstrap-->
        <h1 id="infoSection">Das Spiel geht los!</h1>
        <h1>Schnell {{username}}, <span id="aktion"></span>!</h1>
		
		<div id="myProgress">
		 <div id="myBar">{{timerMax}}</div>
		</div>
		
		<!--TODO: This button is just there to trigger the Loading bar, just remove it after the bar is triggered by the proper event-->
		<button (click)="move()">Click Me</button>
		 
		</div>
  `
})

export class TvPlayComponent implements OnInit, DoCheck {
	timerMax: number;
	username: string;
	aktion: AktionsTyp;

  aktionen = {
    1 : "linker Button",
    2 : "rechter Button",
    3 : "Schütteln",
    4 : "unterer Button"
  }

  move() {
  let timerMax = this.timerMax * 1000;

		var elem = document.getElementById("myBar");
		var width = timerMax;
		var id = setInterval(frame, 10);
		function frame() {
			if (timerMax == 0) {
				clearInterval(id);
			} else {
				timerMax = timerMax - 10;
				elem.style.width = (timerMax / width) * 100 + '%';
				elem.innerHTML = (timerMax / 1000) + 's';
			}
		}
	}

	constructor(private missionControlService: MissionControlService, private router: Router) { }

  ngOnInit() {
    let that = this;
    console.log("TvPlayComponent loaded...");

    this.timerMax = this.missionControlService.spielmodus.zeitFuerAktion;

    this.missionControlService.aktionFromGameServer$.subscribe(function(aktion : Aktion){
      console.log("Aktion vom Server erhalten: " + aktion);
      that.username = aktion.spieler;
      document.getElementById("aktion").innerHTML = that.aktionen[aktion.typ];
      that.move();
    });
    console.log("Subscribed to Action Queue");

    this.missionControlService.ungueltigeAktionOderTimeout$.subscribe(function (ungueltigeAktionOderTimeout : UngueltigeAktionOderTimeout) {
      console.log("Ungueltige Aktion oder Timeout durch Spieler: " + ungueltigeAktionOderTimeout);
      document.getElementById("infoSection").innerHTML = ungueltigeAktionOderTimeout.spieler + "hat Mist gebaut und ein Leben verloren!";
    });
    console.log("Subscribed to Wrong Action or Timeout Queue");

    this.missionControlService.spielVerloren$.subscribe(function (spielVerloren : SpielVerloren) {
      console.log( spielVerloren.spieler + "hat leider verloren" );
      document.getElementById("infoSection").innerHTML = spielVerloren.spieler + "ist sowas von raus!";
    });
    console.log("Subscribed to Player lost the game Queue");

    this.missionControlService.spielBeendet$.subscribe(function () {
      console.log("Das Spiel ist vorbei, leite weiter auf TV-End");
      that.router.navigateByUrl("/tv-end");
    })
    console.log("Subscribed to Game ended Queue");

  }
}