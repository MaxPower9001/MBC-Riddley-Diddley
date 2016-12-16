import { Component, OnInit, EventEmitter } from '@angular/core';
import 'js/smartphone.js';

declare var connectToGameserver : any;

@Component({
  selector: 'phone-home',
  templateUrl: '../templates/phone_home.html'
})

export class PHONE_Home implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }

  startGameClicked(event) {
    connectToGameserver();
  }
}