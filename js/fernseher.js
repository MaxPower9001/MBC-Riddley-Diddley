console.log("This is fernseher.js speaking");

var connectToGameserver = function() {
    const PORT=8080;
    var socket = io('http://localhost:' + PORT);
    socket.on('connect', function () {
        console.log("wir sind verbunden");
        socket.emit("irgendwasVonDenClients", {quelle: "fernseher", timestamp: new Date().getTime()});
    });
    socket.on('irgendwasVomServer', function (data) {
        console.log("Nachricht eingetroffen, Inhalt: " + data.nachricht + " Uhrzeit: " + data.timestamp)
    });
    socket.on('disconnect', function () {
        console.log("Verbindung unterbrochen")
    });

    socket.on('spiel_beendet', function (data) {
        var spielinfo_gesamt = data.spielinfo_gesamt; // TODO
    });

    socket.on('spiel_gestartet', function (data) {
        var anzahl_spieler = data.anzahl_spieler; // TODO
    });

    socket.on('aktion', function (data) {
        var spieler = data.spieler; // TODO
        var typ = data.typ;
    });
}