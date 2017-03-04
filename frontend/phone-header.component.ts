import { Component, OnInit } from '@angular/core';
import { MissionControlService } from './mission-control.service';
import {SpielerInfo} from "./nachrichtentypen";
import {SpielerAuswahlVerfahren} from '../api/nachrichtentypen.interface.js';

@Component({
  selector: 'phone-header',
  template: `
  <div class="col-md-12 col-sm-12 col-xs-12 well">
			<h1>Hi, <span id="username">{{username}}</span></h1> 
		</div>
  `
})

export class PhoneHeaderComponent implements OnInit {

  username: string;


  constructor(private missionControlService: MissionControlService) {	}

  ngOnInit() {
    this.username = this.missionControlService.username;
    document.getElementById("username").innerHTML = this.missionControlService.username;
  }
}