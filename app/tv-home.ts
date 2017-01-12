import { Component, AfterViewInit } from '@angular/core';

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
  `
})
export class TV_Home {

  port : number;
  hostname : string;

  constructor() {
    this.hostname = window.location.hostname;
    this.port = 13337;
  }

  getUrl(): string {
    return "http://" + this.hostname + ":" + this.port + "/#/smartphone";
  }

}