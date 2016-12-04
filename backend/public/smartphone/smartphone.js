console.log("This is smartphone.js speaking");
const PORT=13337;
var socket = io('http://localhost:'+PORT);
socket.on('connect', function(){
    console.log("wir sind verbunden");
    socket.emit("irgendwasVonDenClients", { quelle: "fernseher" });
});
socket.on('irgendwasVomServer', function(data){ console.log("Nachricht eingetroffen, Inhalt: " + data.nachricht) });
socket.on('disconnect', function(){ console.log("Verbindung unterbrochen") });