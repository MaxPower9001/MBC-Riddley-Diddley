import {GameserverWebsocketFacade} from './backend/gameserver-websocket.facade';

var config            = require("./server_config.json");
var webserverModule   = require("./backend/lib/setupWebserver");

var serverIP    = config.server.ip   || "0.0.0.0";
var serverPort  = config.server.port || 13337;

// Setup HTTP Webserver
var webserver = webserverModule.createApplicationServer(config, serverIP, serverPort);
// Setup GameserverRestFacade
var gameserver = new GameserverWebsocketFacade(webserver);

