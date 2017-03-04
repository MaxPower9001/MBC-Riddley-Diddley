import { Component, OnInit, EventEmitter } from '@angular/core';


@Component({
  selector: 'phone-end',
  template: `
    <h1>Das Spiel ist zuende!</h1>
    <h3>Danke fürs Spielen</h3>
`
})

export class PhoneEndComponent implements OnInit {

  ngOnInit() {}
}