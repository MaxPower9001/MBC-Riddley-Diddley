Object.defineProperty(exports, "__esModule", {
    value: true
});
var EventEmitter = require('events').EventEmitter;


function MyEmitter() {
    EventEmitter.call(this);
}
//var events = require('events');
//var myEmitter = new events.EventEmitter();

exports.exports = MyEmitter;