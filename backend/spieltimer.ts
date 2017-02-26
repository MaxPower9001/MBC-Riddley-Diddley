import {EventEmitter} from 'events';

export class SpielTimer {
    timer : EventEmitter;

    constructor() {
        this.timer = new EventEmitter();
    }
}