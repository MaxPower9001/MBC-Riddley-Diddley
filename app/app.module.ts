import { BrowserModule }                  from '@angular/platform-browser';
import { NgModule, OnInit, EventEmitter}  from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { RouterModule }                   from '@angular/router';

// My Modules
import { AppComponent }  from './app.component';

// header 
import { Header } from './d.header';


// TGAS
import {  CADS_TAG_MENU_ENTRY_SITE }  from './tag.menu_entry_site';

// Output
import {  CADS_Welcome }              from './d.welcome';

import {  TV_Home }              from './tv-home';
import {  TV_Play }              from './tv-play';
import {  TV_End }              from './tv-end';

import {  PHONE_Home }              from './phone-home';
import {  PHONE_Play }              from './phone-play';
import {  PHONE_End }              from './phone-end';
// Declare NgModule
@NgModule({
  imports: [ BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '',                 component: CADS_Welcome },
      { path: 'home',             component: CADS_Welcome },
      { path: 'tv-home',             component: TV_Home },
      { path: 'tv-play',             component: TV_Play },
      { path: 'tv-end',             component: TV_End },
      { path: 'phone-home',             component: PHONE_Home },
      { path: 'phone-play',             component: PHONE_Play },
      { path: 'phone-end',             component: PHONE_End }
    ],{ useHash: true })
    ],
  declarations: [ AppComponent, Header, CADS_Welcome,
              TV_Home, TV_Play, TV_End, PHONE_Home, PHONE_Play, PHONE_End,
                  CADS_TAG_MENU_ENTRY_SITE ],
  bootstrap:    [ AppComponent ]
})

export class AppModule {
  constructor() {
    console.log("======= CaDS APP START =========");
  };
 
}