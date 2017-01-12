import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MissionControlService }     from './mission-control.service';
import { Spielinfo, SpielGestartet, Spielmodus } from "./dtos";

declare var connectToGameserver : any;

@Component({
  selector: 'phone-home',
  styles: [`
    .spielmodus {
        background-color: cornflowerblue;
    }
    .spielmodus-eigenschaft {
        background-color: yellowgreen;
    }
    
  `],
  template: `
    <p>Hi {{username}}, folgende Spielmodi stehen dir zur Auswahl (Clicke auf gewünschten Spielmodus um das spiel zu starten):</p>
    <ol>
      <li class="spielmodus" *ngFor="let spielmodus of spielmodi">
        <button (click)="starteSpiel(spielmodus)">Spiel starten</button><span>{{printSpielmodus(spielmodus)}}</span>
        <ul>
        <li class="spielmodus-eigenschaft" *ngFor="let keyval of spielmodus | keys">{{keyval.key}}: {{keyval.value}}</li>
        </ul>
      </li>
    </ol>
    `,
  providers: [MissionControlService]
})

export class PHONE_Home implements OnInit {

  spielmodi : Spielmodus[];
  username : string;

  constructor(private missionControlService: MissionControlService, private router: Router) {}

  ngOnInit() {
    let that = this;
    this.missionControlService.spielinfofromGameserver$.subscribe(function(spielinfo : Spielinfo) {
            that.spielmodi = spielinfo.spielmodi;
            that.username = spielinfo.username;
            console.log("Spielinfo vom Server erhalten: " + spielinfo);
        });
    this.missionControlService.spielGestartet$.subscribe(function(spielGestartet: SpielGestartet) {
          console.log("SpielGestartet vom Server erhalten: " + spielGestartet);
          that.router.navigateByUrl("/phone-play");
        });
    this.missionControlService.connectToGameserver();
  }

  starteSpiel(spielmodus : Spielmodus) {
    this.missionControlService.starteSpiel(spielmodus);
  }

  printSpielmodus(spielmodus : Spielmodus) {
    return (new Spielmodus(spielmodus.schwierigkeit, spielmodus.zeitFuerAktion, spielmodus.auswahlverfahrenSpieler, spielmodus.anzahlLeben)).toString();
  }
}