import { Component, AfterViewInit } from '@angular/core';
require('js/qrcode.js');

declare var QRCode : any;

@Component({
  selector: 'tv-home',
  styles: [`
    p {
        font-size: 20px;
    }
    h1, p, div {
        text-align:center;
        margin-left: auto;
        margin-right: auto;
    }
  `],
  template: `
    <h1>Öffne diesen Link</h1>
        <p>{{ getUrl() }}</p>
    <h1>Oder öffne folgenden QRCode um am Spiel teilzunehmen</h1>
        <div id="qrcode-container"></div>
  `
})
export class TV_Home implements AfterViewInit {

  port : number;
  hostname : string;
  qrcode : any;



  constructor() {
    this.hostname = window.location.hostname;
    this.port = 13337;
  }

  ngAfterViewInit(): void {
    //this.createQRCode();
  }

  getUrl(): string {
    return "http://" + this.hostname + ":" + this.port + "/#/smartphone";
  }

  createQRCode(): void {
    this.qrcode = new QRCode("qrcode-container", {
      text : this.getUrl(),
      width : 250,
      height : 250
    });
    this.qrcode.makeCode();
  }

}