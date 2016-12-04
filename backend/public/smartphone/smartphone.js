console.log("This is smartphone.js speaking");
const PORT=13337;
var socket = io('http://192.168.178.136:'+PORT);
socket.on('connect', function(){
    console.log("wir sind verbunden");
    socket.emit("irgendwasVonDenClients", { quelle: "smartphone", timestamp: new Date().getTime() });
    sentTimeRequestOnTime = new Date().getTime();
    socket.emit("syncTimeRequest");
});
socket.on('disconnect', function(){ console.log("Verbindung unterbrochen") });

socket.on('spielinfo', function(data) {
    var moin_elem = document.createElement("p");
    moin_elem.innerText = data._username;
    document.body.appendChild(moin_elem);
});