import {Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import {MissionControlService} from './mission-control.service';
import {Aktion, SpielVerloren} from "./nachrichtentypen";
import {AktionsTyp} from '../api/nachrichtentypen.interface.js';
var Shake = require('./lib/shake.js');

@Component({
    selector: 'phone-play',
    template: `
		<phone-header></phone-header>
		<div class="viewport">
		
            <div class="row thick">
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <button class="btn btn-primary" (click)="leftButton()">Left Button</button>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <button class="btn btn-success" (click)="rightButton()">Right Button</button>
                </div>
            </div>
            <div class="row thin">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <button class="btn btn-primary" (click)="bottomButton()">Bottom Button</button>
                </div>
            </div>
        </div>
	`
})

export class PhonePlayComponent implements OnInit {

    spieler : string;

    constructor(private missionControlService: MissionControlService, private router: Router) {
    }

    ngOnInit() {


        this.missionControlService.aktionFromGameServer$.subscribe(function (aktion: Aktion) {
            console.log("Aktion vom Server erhalten: " + aktion + " Jetzt aber schnell!");
        });

        this.missionControlService.spielVerloren$.subscribe(function ( spielVerloren : SpielVerloren ) {
            if(spielVerloren.spieler == that.missionControlService.username){
                that.router.navigateByUrl("phone-end");
            }
        });
        let that = this;
        var myShakeEvent = new Shake({
            threshold: 15, // optional shake strength threshold
            timeout: 1000 // optional, determines the frequency of event generation
        });
        myShakeEvent.start();
    }

    @HostListener('window:shake')
    shakeMe() {
        this.missionControlService.aktionDone(AktionsTyp.SCHUETTELN);
    }

    leftButton() {
        this.missionControlService.aktionDone(AktionsTyp.LINKSKNOPF);
    }

    rightButton() {
        this.missionControlService.aktionDone(AktionsTyp.RECHTSKNOPF);
    }

    bottomButton() {
        this.missionControlService.aktionDone(AktionsTyp.KNOPFUNTEN);
    }

}