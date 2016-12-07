console.log("This is smartphone.js speaking");
const PORT=13337;
var socket = io('http://192.168.178.76:'+PORT);

socket.on('connect', function(){
    console.log("wir sind verbunden");
    //socket.emit("irgendwasVonDenClients", { quelle: "smartphone", timestamp: new Date().getTime() });
    //sentTimeRequestOnTime = new Date().getTime();
    //socket.emit("syncTimeRequest");
});

socket.on('disconnect', function(){ console.log("Verbindung unterbrochen") });

socket.on('spielinfo', function(spielinfo) {
    document.dispatchEvent(new CustomEvent('spielinfo', { "detail": spielinfo }));
    sendeSpielinfo(spielinfo.spielmodi[0]);
});

socket.on('spiel_beendet', function(data) {
    var spielinfo_gesamt = data.spielinfo_gesamt; // TODO
});

socket.on('aktion', function(data) {
    var spieler = data.spieler; // TODO
    var typ = data.typ;
});

socket.on('spiel_gestartet', function(data) {
    document.dispatchEvent(new CustomEvent('spiel_gestartet', { "detail": data }));
    console.log("Es geht los, es geht los! Es spielen " + data.anzahl_spieler + " Spieler");
});

function sendeSpielinfo(spielmodus) {
    socket.emit('spielinfo', { "username": "", "spielmodi": [spielmodus] } );
}

//document.addEventListener('spielinfo', function (event) {console.log("moin Event: " +event.detail.spielmodi[0].anzahlLeben)});