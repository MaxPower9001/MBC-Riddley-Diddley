import { Component, NgZone, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'my-app',
  template: `
        <base href="/">
        <cads-header></cads-header>
        <router-outlet></router-outlet>
    `,
})


export class AppComponent  {
  name: string;
  title     = 'CaDS Playground';
  page_name = 'home';
}