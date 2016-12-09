import { Component, OnInit, EventEmitter } from '@angular/core';
declare var callTheTwitterFunction:any

@Component({
  selector: 'phone-end',
  templateUrl: '../templates/phone_end.html'
})

export class PHONE_End implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }
}