import { Component } from '@angular/core';
import {MissionControlService} from "./mission-control.service";

@Component({
  selector: 'my-app',
  template: `
    <div class="container">
        <base href="/">
        <!--<header></header>-->
        <router-outlet></router-outlet>
    </div>
    `,
  providers: [MissionControlService],
})
export class AppComponent  {
}