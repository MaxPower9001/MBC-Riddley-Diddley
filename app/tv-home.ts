import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionControlService }     from './mission-control.service';
import {Spielinfo, SpielGestartet, Spielmodus, Aktion} from "./dtos";

@Component({
  selector: 'tv-home',
  styles: [`
    p {
        font-size: 20px;
    }
    div {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }
  `],
  template: `
    <div>
      <h1>Öffne diesen Link</h1>
          <p>{{ getUrl() }}</p>
      <h1>Oder öffne folgenden QRCode um am Spiel teilzunehmen</h1>
          <qr-code [data]="getUrl()" [size]="300"></qr-code>
    </div>
  `,
})
export class TV_Home implements OnInit{

  port : number;
  hostname : string;
  spielmodi : Spielmodus[];
  username : string;

  constructor(private missionControlService: MissionControlService, private router: Router) {
    this.hostname = window.location.hostname;
    this.port = 13337;
  }

  ngOnInit() {
    let that = this;
    this.missionControlService.spielinfofromGameserver$.subscribe(function(spielinfo : Spielinfo) {
      that.spielmodi = spielinfo.spielmodi;
      that.username = spielinfo.username;
      console.log("Spielinfo vom Server erhalten: " + spielinfo);
    });
    this.missionControlService.spielGestartet$.subscribe(function(spielGestartet: SpielGestartet) {
      console.log("SpielGestartet vom Server erhalten: " + spielGestartet);
      that.router.navigateByUrl("/tv-play");
    });
    this.missionControlService.connectToGameserver();
  }

  getUrl(): string {
    return "http://" + this.hostname + ":" + this.port + "/#/smartphone";
  }

}