import { Component, OnInit, EventEmitter } from '@angular/core';
import {Router} from "@angular/router";
import setInterval = core.setInterval;


@Component({
  selector: 'tv-end',
  template: `
    <h1>Spiel zuende</h1>
    <h3>Ein neues Spiel startet in <span id="countdown">5</span></h3>
`
})

export class TvEndComponent implements OnInit {

  redirectDelay = 5;
  router : Router;

  constructor(router : Router) {
    this.router = router;
  }

  ngOnInit() {
    let that = this;
    var redirect = setInterval(countdown, 1000);
    function countdown() {
      if(that.redirectDelay == 0){
        clearInterval(redirect);
        that.router.navigateByUrl("/");
      }
      else {
        that.redirectDelay--;
        document.getElementById("countdown").innerHTML = that.redirectDelay + "";
      }
    }
  }
}