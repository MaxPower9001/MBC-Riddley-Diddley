import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smartphone',
  templateUrl: './smartphone.html',
  styleUrls: ['./smartphone.scss']
})
export class SmartphoneComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello Smartphone');
  }

}
