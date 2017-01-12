import {Component, OnInit, HostListener} from '@angular/core';
var Shake = require('../js/shake.js');

@Component({
  selector: 'phone-play',
  template: `
    <h1>Das Spiel wurde gestartet!</h1>
  `
})

export class PHONE_Play implements OnInit { 

  ngOnInit() {
    var myShakeEvent = new Shake({
      threshold: 1, // optional shake strength threshold
      timeout: 1000 // optional, determines the frequency of event generation
    });
    myShakeEvent.start();
  }

  @HostListener('window:shake')
  shakeMe() {
    console.log("ich wurde geschüttelt");
  }
}