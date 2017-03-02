import {GameserverWebsocketFacade} from './backend/gameserver-websocket.facade';
import {GameserverRestFacade} from "./backend/gameserver-rest.facade";
import * as express from "express";

let config  = require("./server_config.json");



// Setup ExpressJS
let expressApp = express();
expressApp.use(express.static('.'));

// Setup Gameserver Facade
if(config.useWebsockets) {
    new GameserverWebsocketFacade(expressApp,config);
} else {
    new GameserverRestFacade(expressApp,config);
}
