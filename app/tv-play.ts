import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService }     from './mission-control.service';
import {Spielinfo, SpielGestartet, Spielmodus, Aktion} from "./dtos";

@Component({
  selector: 'tv-play',
  template: `
  	<div class="alert alert-success" role="alert">
			<h2>TV Screen - PLAY</h2> 
		</div>
  `
})

export class TV_Play implements OnInit {

  constructor(private missionControlService: MissionControlService, private router: Router) {}

  ngOnInit() {
    console.log("TV_Play loaded...");
    this.missionControlService.aktionFromGameServer$.subscribe(function(aktion : Aktion){
      console.log("Aktion vom Server erhalten: " + aktion);
    })
  }
}