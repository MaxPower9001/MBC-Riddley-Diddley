import { Component, OnInit, EventEmitter } from '@angular/core';
var smartphone = require('./js/smartphone.js');
declare var callTheTwitterFunction:any

@Component({
  selector: 'phone-home',
  templateUrl: '../templates/phone_home.html'
})

export class PHONE_Home implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }

  startGameClicked(event) {
    smartphone.connectToGameserver();
  }
}