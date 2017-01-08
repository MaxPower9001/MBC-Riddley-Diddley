import { Component, OnInit } from '@angular/core';
import 'js/smartphone.js';

declare var connectToGameserver : any;

@Component({
  selector: 'phone-home',
  template: `
    <h1>sdkljfsdf</h1>
    <h1>sdkljfsdf</h1>
    <h1>sdkljfsdf</h1>
    <h1>sdkljfsdf</h1>
    <button (click)="startGameClicked()">Spiel starten</button>
    <ul>
      <li *ngFor="let spielmodus of spielmodi">
      <span>data binding geht nichth TODO fix mich</span>
        <ul>
        <li *ngFor="let spieleigenschaft of spielmodus">{{spieleigenschaft}}</li>
        </ul>
      </li>
    </ul>
`
})

export class PHONE_Home implements OnInit {

  spielmodi : string[];
  username : string;

  ngOnInit() {
    document.addEventListener('spielinfo', function (event: CustomEvent) {
      this.username = event.detail.username;
      this.spielmodi = event.detail.spielmodi;
      console.log("moin Event: " + this.spielmodi[0] + this.spielmodi[1]);
    });
  }

  startGameClicked(event) {
    connectToGameserver();
  }
}