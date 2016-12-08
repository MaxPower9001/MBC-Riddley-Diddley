import { Component } from '@angular/core';

import { ApiService } from './shared';

import '../style/app.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {

  constructor(private api: ApiService) {
    
  }
}
