import { Component, OnInit, EventEmitter } from '@angular/core';
import 'js/QRCode.js';

declare var QRCode : any;

@Component({
  selector: 'tv-home',
  templateUrl: '../templates/tv_home.html'
})

export class TV_Home implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
    console.log("oh mein goooooooood");
    var qrcode = new QRCode(document.getElementById("qrcode"), {
      width : 200,
      height : 200
    });

    function makeCode () {

      qrcode.makeCode("http://141.22.74.13:8080/#/phone-play");
    }

    makeCode();
  }
}