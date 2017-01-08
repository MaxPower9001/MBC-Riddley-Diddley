import { Component, OnInit } from '@angular/core';
import { MissionControlService }     from './mission-control.service';
import * as dtos from './dtos'
import {Spielmodus} from "./dtos";
import {Spielinfo} from "./dtos";

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

  spielmodi : dtos.Spielmodus[];
  username : string;

  constructor(private missionControlService: MissionControlService) {}


  ngOnInit() {
    this.missionControlService.spielinfofromGameserver$.subscribe(
        spielinfo => {
          this.spielmodi = spielinfo.spielmodi;
          this.username = spielinfo.username;
          console.log("Spielinfo vom Server erhalten: " + (new Spielinfo(spielinfo.spielmodi, spielinfo.username)).toString());
        });
    this.missionControlService.spielGestartet$.subscribe(
        spielGestartet => {
          console.log("SpielGestartet vom Server erhalten: " + new dtos.SpielGestartet(spielGestartet.anzahlSpieler));
          // TODO Change View to phone-play
          document.getElementsByTagName("phone-home")[0].innerHTML = "<h1 style='font-size: 30px;'>SPIEL GESTARTET LOS GEHTS</h1>"
        });
    this.missionControlService.connectToGameserver();
  }

  starteSpiel(spielmodus : dtos.Spielmodus) {
    this.missionControlService.starteSpiel(spielmodus);
  }

  printSpielmodus(spielmodus : dtos.Spielmodus) {
    return (new Spielmodus(spielmodus.schwierigkeit, spielmodus.zeitFuerAktion, spielmodus.auswahlverfahrenSpieler, spielmodus.anzahlLeben)).toString();
  }
}