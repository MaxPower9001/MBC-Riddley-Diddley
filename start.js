// JavaScript File
var TX_INFO_CADS      = "[INFO CaDS][START] "
var TX_INFO_EXPRESS   = "Modul EXPESS "
var TX_INFO_HTTP      = "Modul HTTP "
var TX_INFO_WEBSOCKET = "Modul WEBSOCKETS "
var TX_INFO_ACTIVATED = "activated "
var TX_INFO_START     = "PLAYGROUND... "

///////////// Conf Service /////////////
/* Lets start to create a new world*/
var config            = require("./server_config.json");
var webserverModule   = require("./lib/setupWebserver");
var gameserverModule  = require('./gameserver_backend/gameserver.js');

var serverIP    = config.server.ip   || "0.0.0.0";
var serverPort  = config.server.port || 13337;

// Setup HTTP Webserver
var webserver = webserverModule.createApplicationServer(config, serverIP, serverPort);

// Setup Gameserver
var gameserver = gameserverModule.init(webserver);
