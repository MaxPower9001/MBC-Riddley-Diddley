import { Component, OnInit, EventEmitter } from '@angular/core';
declare var callTheTwitterFunction:any

@Component({
  selector: 'phone-play',
  templateUrl: '../templates/phone_play.html'
})

export class PHONE_Play implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }
}