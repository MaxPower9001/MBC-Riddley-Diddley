import { Component, OnInit, EventEmitter } from '@angular/core';
import { MissionControlService } from './mission-control.service';


@Component({
	selector: 'phone-end',
	template: `
		<phone-header></phone-header>

		<div class="container">
			<h3>Das Spiel ist vorbei!</h3>
			<h4>gg Thanks</h4>
			<h4>Bye</h4>
		</div>
	`
})

export class PhoneEndComponent implements OnInit {
	
	constructor(private missionControlService: MissionControlService) {
	}

	ngOnInit() {}
}