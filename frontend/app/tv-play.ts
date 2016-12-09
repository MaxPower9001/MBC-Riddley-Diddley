import { Component, OnInit, EventEmitter } from '@angular/core';
declare var callTheTwitterFunction:any

@Component({
  selector: 'tv-play',
  templateUrl: '../templates/tv_play.html'
})

export class TV_Play implements OnInit { 

  ngOnInit() {
    console.log("= Find Cads Page loaded... =");
  }
}