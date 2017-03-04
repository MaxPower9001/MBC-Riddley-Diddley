import {Component, OnInit, HostListener} from '@angular/core';
import {MissionControlService} from './mission-control.service';
import {Aktion} from "./nachrichtentypen";
import {AktionsTyp} from '../api/nachrichtentypen.interface.js';
var Shake = require('./lib/shake.js');

@Component({
    selector: 'phone-play',
    styles: [`
		
        .thin {
            height:40%;
        }

        .thick {
            height:60%;
            color: red;
        }
        .viewport{
            height:60%;
            width:100%;
        }
		
	`],
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

    constructor(private missionControlService: MissionControlService) {
    }

    ngOnInit() {
        var myShakeEvent = new Shake({
            threshold: 1, // optional shake strength threshold
            timeout: 1000 // optional, determines the frequency of event generation
        });
        myShakeEvent.start();

        this.missionControlService.aktionFromGameServer$.subscribe(function (aktion: Aktion) {
            console.log("Aktion vom Server erhalten: " + aktion + " Jetzt aber schnell!");
        });
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
        this.missionControlService.aktionDone(AktionsTyp.RECHTSKNOPF);
    }

}