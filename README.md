# Netzwerk-Rallye (Prototyp)
Kooperatives Multiplayer-Lernspiel: ARP, DNS, DHCP, ICMP, SNTP.

Start lokal:   npm install && npm start   → http://localhost:3000
Start Docker:  docker build -t netzwerk-rallye . && docker run -d -p 3000:3000 netzwerk-rallye

Alle Spieler öffnen die Seite, geben Name + gleichen Raumcode ein. Der erste Spieler startet.
Fragen/Missionen: missions.js (opts[0] = richtige Antwort, wird beim Anzeigen gemischt).
