import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService }     from './mission-control.service';
import {SpielGestartet, Spielmodus, Aktion} from "./nachrichtentypen";

@Component({
  selector: 'tv-play',
  template: `
  	<div class="alert alert-success" role="alert">
			<h2>TV Screen - PLAY</h2> 
		</div>
  `
})

export class TvPlayComponent implements OnInit {

  constructor(private missionControlService: MissionControlService, private router: Router) {}

  ngOnInit() {
    console.log("TvPlayComponent loaded...");
    this.missionControlService.aktionFromGameServer$.subscribe(function(aktion : Aktion){
      console.log("Aktion vom Server erhalten: " + aktion);
    })
  }
}