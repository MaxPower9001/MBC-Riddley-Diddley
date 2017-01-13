import {Component, OnInit, HostListener} from '@angular/core';
var Shake = require('../js/shake.js');

@Component({
  selector: 'phone-play',
  template: `
    <h1>Das Spiel wurde gestartet!</h1>
    <div class="row">
      <div class="col-md-6 col-sm-6 col-xs-6">
        <button class="btn btn-primary">Left Button</button>
      </div>
      <div class="col-md-6 col-sm-6 col-xs-6">
        <button class="btn btn-success">Right Button</button>
      </div>
      <div class="col-md-12">
        <button class="btn btn-danger">Big Button</button>
      </div>
    </div>
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