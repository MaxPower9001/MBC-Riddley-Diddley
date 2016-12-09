import { Component, OnInit, EventEmitter } from '@angular/core';
declare var callTheTwitterFunction:any

@Component({
  selector: 'tv-home',
  templateUrl: '../templates/tv_home.html'
})

export class TV_Home implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }
}