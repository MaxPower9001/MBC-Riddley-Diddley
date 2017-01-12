import { BrowserModule }                  from '@angular/platform-browser';
import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { RouterModule }                   from '@angular/router';

// My Modules
import { AppComponent }  from './app.component';

// header 
import { Header } from './d.header';

import { QRCodeModule } from 'angular2-qrcode';

// Output
import {  TV_Home }              from './tv-home';
import {  TV_Play }              from './tv-play';
import {  TV_End }              from './tv-end';

import {  PHONE_Home }              from './phone-home';
import {  PHONE_Play }              from './phone-play';
import {  PHONE_End }              from './phone-end';

import {KeysPipe} from "./keys.pipe";
// Declare NgModule
@NgModule({
  imports: [
    QRCodeModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '',                 component: TV_Home },
      { path: 'fernseher',             component: TV_Home },
      { path: 'tv-play',             component: TV_Play },
      { path: 'tv-end',             component: TV_End },
      { path: 'smartphone',             component: PHONE_Home },
      { path: 'phone-play',             component: PHONE_Play },
      { path: 'phone-end',             component: PHONE_End }
    ],{ useHash: true })
    ],
  declarations: [ AppComponent, Header, TV_Home, TV_Play, TV_End, PHONE_Home, PHONE_Play, PHONE_End, KeysPipe],
  bootstrap:    [ AppComponent ]
})

export class AppModule {
  constructor() {
    console.log("Angular starting...");
  };
 
}