console.log("This is smartphone.js speaking");
const PORT=13337;
var socket = io('http://192.168.178.136:'+PORT);
socket.on('connect', function(){
    console.log("wir sind verbunden");
    socket.emit("irgendwasVonDenClients", { quelle: "smartphone", timestamp: new Date().getTime() });
});
socket.on('irgendwasVomServer', function(data){
    console.log("Nachricht eingetroffen, Inhalt: " + data.nachricht + " Uhrzeit: " + data.timestamp);
    var timestamp = document.createElement("p");
    timestamp.innerText = "Nachricht eingetroffen, Inhalt: " + data.nachricht + " Nachricht erstellt: " + data.timestamp + " Nachricht eingetroffen: " + new Date().getTime();
    document.body.appendChild(timestamp);
});
socket.on('disconnect', function(){ console.log("Verbindung unterbrochen") });