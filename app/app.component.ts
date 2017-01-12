import { Component, NgZone, EventEmitter, OnInit } from '@angular/core';
import {MissionControlService} from "./mission-control.service";


@Component({
  selector: 'my-app',
  template: `
        <base href="/">
        <!--<cads-header></cads-header>-->
        <router-outlet></router-outlet>
    `,
  providers: [MissionControlService],
})
export class AppComponent  {
}