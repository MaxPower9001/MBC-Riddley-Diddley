# Riddley-Diddley
     
## Installation und Start des Spiels
$ npm install      
$ npm start      
Öffnen der Website auf dem Fernseher (oder ggf. anderes Anzeigegerät) via http://<IP-Addresse>:13337

Um mit dem Smartphone am Spiel teilzunehmen muss nun der QR-Code oder die angegebene URL im mobilen Browser geöffnet werden.
Wenn sich alle Spieler so mit dem Spiel verbunden haben, kann einer der Spieler das Spiel starten (Button).

Hinweis: Nach einem beendetem Spiel müssen alle Spieler den Browser/Tab schließend und sich erneut via QR-Code verbinden.
Der Fernseher wechselt selbstständig wieder in einen Zustand indem ein neues Spiel begonnen werden kann.

Hinweis: Backend (Gameserver) und Fernseher (Browser welcher die Fernseher-View geöffnet hat) müssen auf der selben Maschine laufen

##  Konfiguration des Backends
Die IP-Adresse des Gameservers wird über die Config-Datei server_config.json eingestellt.
Hier kann zusätzlich konfiguriert werden, ob das Websocket oder die REST Implementation verwendet werden soll.

## Konfiguration des Frontends
Die IP-Adresse des Gameservers wird (je nach Anbindung) in der Variablen gameServer in der Datei backend-connection-websocket.service.ts bzw. backend-connection-rest.service angegeben. Welche der beiden Implementierungen genutzt werden soll ist über den Typ der  Konstruktor-Variable backendConnectionService in der Datei mission-control.service.ts anzugeben. Möglich sind: BackendConnectionWebsocketService bzw. BackendConnectionRestService. Der entsprechende Service wird beim Start anschließend via Dependency Injection übergeben.


