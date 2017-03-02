import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService }     from './mission-control.service';
import {SpielGestartet, Spielmodus, Aktion} from "./nachrichtentypen";
import {AktionsTyp} from "../api/nachrichtentypen.interface";

@Component({
  selector: 'tv-play',
  styles: [`
.viewport{
    height:80%;
    width:100%;
}
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
		<div class="viewport">
		<tv-header></tv-header>	
        <!--Dont know why but we need text here or otherwise all elements are behind the tv-header, yay bootstrap-->
        <h1>Timer Bar:</h1>
        <h1>Schnell {{username}}, {{aktion}}!</h1>
        
        <div id="myProgress">
         <div id="myBar">{{timerMax}}</div>
        </div>
        
        <!--TODO: This button is just there to trigger the Loading bar, just remove it after the bar is triggered by the proper event-->
        <button (click)="move()">Click Me</button>
         
		</div>
  `
})

export class TvPlayComponent implements OnInit {
  timerMax : number;
  username : string;
  aktion : AktionsTyp;

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
      elem.style.width = ( timerMax / width ) * 100 + '%';
      elem.innerHTML = ( timerMax / 1000 ) + 's';
    }
  }
}

  constructor(private missionControlService: MissionControlService, private router: Router) {}

  ngOnInit() {
    let that = this;
    console.log("TvPlayComponent loaded...");
    this.missionControlService.aktionFromGameServer$.subscribe(function(aktion : Aktion){
      console.log("Aktion vom Server erhalten: " + aktion);
      that.username = aktion.spieler;
      that.aktion = aktion.typ;
      that.move();
    });
    this.missionControlService.spielGestartet$.subscribe(function(spielGestartet : SpielGestartet) {
      that.timerMax = spielGestartet.spielmodus.zeitFuerAktion;
      console.log("Spielmodus vom Server erhalten: " + spielGestartet);
    });

  }
}