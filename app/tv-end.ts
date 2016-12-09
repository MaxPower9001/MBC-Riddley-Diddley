import { Component, OnInit, EventEmitter } from '@angular/core';
declare var callTheTwitterFunction:any

@Component({
  selector: 'tv-end',
  templateUrl: '../templates/tv_end.html'
})

export class TV_End implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }
}