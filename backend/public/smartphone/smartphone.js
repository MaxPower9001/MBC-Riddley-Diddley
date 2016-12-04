console.log("This is smartphone.js speaking");
const PORT=13337;
var socket = io('http://192.168.178.136:'+PORT);
socket.on('connect', function(){
    console.log("wir sind verbunden");
    socket.emit("irgendwasVonDenClients", { quelle: "smartphone", timestamp: new Date().getTime() });
    sentTimeRequestOnTime = new Date().getTime();
    socket.emit("syncTimeRequest");
});
socket.on('irgendwasVomServer', function(data){
    console.log("Nachricht eingetroffen, Inhalt: " + data.nachricht + " Uhrzeit: " + data.timestamp);
    var timestamp = document.createElement("p");
    diff = new Date().getTime() - data.timestamp;
    timestamp.innerText = "Nachricht eingetroffen, Inhalt: " + data.nachricht + " Zeitdiff Nachricht erstellt/eingetroffen: " + diff;
    document.body.appendChild(timestamp);
});
socket.on('disconnect', function(){ console.log("Verbindung unterbrochen") });
socket.on('syncTimeResponse', function() {
    receivedTimeResponse = new Date().getTime();
    rtt = receivedTimeResponse - sentTimeRequestOnTime;
    var rtt_elem = document.createElement("p");
    rtt_elem.innerText = "Round Trip Time Client -> Server: " + rtt;
    document.body.appendChild(rtt_elem);
});