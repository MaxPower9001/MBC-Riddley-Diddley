import { Component } from '@angular/core';
import {MissionControlService} from "./mission-control.service";

@Component({
  selector: 'my-app',
  template: `
        <base href="/">
        <!--<header></header>-->
        <router-outlet></router-outlet>
    `,
  providers: [MissionControlService],
})
export class AppComponent  {
}