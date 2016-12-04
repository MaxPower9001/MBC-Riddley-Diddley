console.log("This is fernseher.js speaking");
const PORT=13337;
var socket = io('http://localhost:'+PORT);
socket.on('connect', function(){
    console.log("wir sind verbunden");
    socket.emit("irgendwasVonDenClients", { quelle: "fernseher", timestamp: new Date().getTime() });
});
socket.on('irgendwasVomServer', function(data){ console.log("Nachricht eingetroffen, Inhalt: " + data.nachricht + " Uhrzeit: " + data.timestamp) });
socket.on('disconnect', function(){ console.log("Verbindung unterbrochen") });