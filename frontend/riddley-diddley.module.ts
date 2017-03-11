import { BrowserModule }                  from '@angular/platform-browser';
import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { RouterModule }                   from '@angular/router';

import { RiddleyDiddleyComponent }  from './riddley-diddley.component';
import { QRCodeModule } from 'angular2-qrcode';

import { TvHeaderComponent } from './tv-header.component';
import {  TvHomeComponent }              from './tv-home.component';
import {  TvPlayComponent }              from './tv-play.component';
import {  TvEndComponent }              from './tv-end.component';

import { PhoneHeaderComponent } from './phone-header.component';
import {  PhoneHomeComponent }              from './phone-home.component';
import {  PhonePlayComponent }              from './phone-play.component';
import {  PhoneEndComponent }              from './phone-end.component';

import { MissionControlService } from './mission-control.service';
import { BackendConnectionWebsocketService } from './backend-connection.websocket.service';
import {BackendConnectionRestService} from "./backend-connection-rest.service";


import {KeysPipe} from "./keys.pipe";
import {HttpModule} from "@angular/http";

// Declare NgModule
@NgModule({
  imports: [
    QRCodeModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '',                 component: TvHomeComponent },
      { path: 'fernseher',             component: TvHomeComponent },
      { path: 'tv-play',             component: TvPlayComponent },
      { path: 'tv-end',             component: TvEndComponent },
      { path: 'smartphone',             component: PhoneHomeComponent },
      { path: 'phone-play',             component: PhonePlayComponent },
      { path: 'phone-end',             component: PhoneEndComponent }
    ],{ useHash: true })
    ],
  declarations: [ RiddleyDiddleyComponent, PhoneHeaderComponent, TvHeaderComponent, TvHomeComponent, TvPlayComponent, TvEndComponent, PhoneHomeComponent, PhonePlayComponent, PhoneEndComponent, KeysPipe],
  providers:   [MissionControlService, BackendConnectionRestService, BackendConnectionWebsocketService],
  bootstrap:    [ RiddleyDiddleyComponent ]
})

export class RiddleyDiddleyModule {
  constructor() {
    console.log("Angular starting...");
  };
 
}