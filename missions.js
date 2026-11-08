// Missionen leicht erweiterbar: jeder Schritt = eine Frage an EINE Person (rotiert).
// opts[0] ist immer die richtige Antwort, der Server mischt sie pro Anzeige.
module.exports = [
  { title: "DHCP – Der neue Laptop", intro: "Ein Laptop wird angeschlossen und hat noch keine IP-Adresse. Der DHCP-Server im Netz hat den Pool 192.168.1.100–200.", steps: [
    { q: "CLIENT: Du hast keine IP. Welche Nachricht sendest du als Broadcast?", opts: ["DHCPDISCOVER", "DHCPOFFER", "DHCPACK", "ARP Reply"], why: "Der Client sucht per Broadcast (255.255.255.255) einen DHCP-Server: DHCPDISCOVER." },
    { q: "SERVER: Du hast ein DISCOVER erhalten. Was antwortest du?", opts: ["DHCPOFFER mit freier Adresse (z. B. 192.168.1.101)", "DHCPACK", "DHCPREQUEST", "DNS Response"], why: "Der Server bietet eine freie Adresse an: DHCPOFFER." },
    { q: "CLIENT: Du nimmst das Angebot an. Was sendest du?", opts: ["DHCPREQUEST", "DHCPDISCOVER", "DHCPNAK", "ICMP Echo Request"], why: "Der Client fordert die angebotene Adresse offiziell an: DHCPREQUEST." },
    { q: "SERVER: Zum Abschluss bestätigst du mit …?", opts: ["DHCPACK (inkl. Lease-Zeit)", "DHCPOFFER", "DHCPDISCOVER", "ARP Request"], why: "Mit DHCPACK ist die Zuweisung samt Lease-Zeit fertig (DORA)." } ] },
  { title: "ARP – Wer hat die 192.168.1.20?", intro: "PC-A (192.168.1.10) will PC-B (192.168.1.20) im selben Subnetz erreichen, kennt aber dessen MAC-Adresse nicht.", steps: [
    { q: "PC-A: Was sendest du, um die MAC zu erfahren?", opts: ["ARP Request als Broadcast (Ziel-MAC FF:FF:FF:FF:FF:FF)", "ARP Reply als Unicast", "DNS Query", "DHCPDISCOVER"], why: "ARP Request geht per Broadcast an alle im Segment: „Wer hat 192.168.1.20?“" },
    { q: "PC-B: Du hast die Anfrage erhalten. Wie antwortest du?", opts: ["ARP Reply als Unicast mit deiner MAC an PC-A", "ARP Request als Broadcast", "ICMP Time Exceeded", "Gar nicht, Switch antwortet"], why: "Der Angesprochene antwortet per Unicast mit seiner MAC." },
    { q: "PC-A: Was machst du mit der Antwort?", opts: ["MAC im ARP-Cache speichern und Frame senden", "Verwerfen", "Als neue IP-Adresse eintragen", "DNS-Eintrag anlegen"], why: "Die Zuordnung IP→MAC kommt in den ARP-Cache, danach geht der Frame raus." } ] },
  { title: "DNS – www.beispiel.de aufrufen", intro: "Ein Client möchte www.beispiel.de öffnen und kennt nur seinen DNS-Resolver.", steps: [
    { q: "CLIENT: An wen schickst du zuerst die Namensanfrage?", opts: ["An den konfigurierten DNS-Resolver", "An einen Root-Server", "An den Webserver", "An den DHCP-Server per Broadcast"], why: "Der Client fragt zuerst seinen (rekursiven) Resolver." },
    { q: "RESOLVER: Du hast nichts im Cache. Wen fragst du als Erstes?", opts: ["Root-Server (Verweis auf .de-TLD)", "Autoritativen Server von beispiel.de", "Den Client zurück", "Den Mailserver"], why: "Iterative Auflösung: Root → TLD (.de) → autoritativer Server." },
    { q: "Welchen Record-Typ liefert der autoritative Server für die IPv4-Adresse?", opts: ["A", "AAAA", "MX", "PTR"], why: "A = IPv4, AAAA = IPv6, MX = Mail, PTR = Reverse-Lookup." },
    { q: "Es soll die Mail-Zustellung für @beispiel.de geklärt werden. Welcher Record?", opts: ["MX", "CNAME", "A", "SOA"], why: "MX-Records nennen die zuständigen Mailserver." } ] },
  { title: "ICMP – Ping und Traceroute", intro: "Ein Ping zu einem entfernten Server schlägt fehl. Ihr analysiert gemeinsam.", steps: [
    { q: "PC: Welche ICMP-Nachricht sendet ein Ping?", opts: ["Echo Request (Type 8)", "Echo Reply (Type 0)", "Time Exceeded (Type 11)", "Redirect"], why: "Ping = Echo Request (Type 8), Antwort = Echo Reply (Type 0)." },
    { q: "ROUTER: Das Paket hat TTL = 1 und müsste weitergeleitet werden. Was tust du?", opts: ["Verwerfen und ICMP Time Exceeded (Type 11) zurücksenden", "TTL auf 255 setzen", "Echo Reply senden", "Paket weiterleiten"], why: "TTL wird dekrementiert; bei 0 wird verworfen und Time Exceeded gesendet – darauf basiert Traceroute." },
    { q: "ROUTER: Es gibt keine Route zum Zielnetz. Welche Meldung sendest du?", opts: ["Destination Unreachable (Type 3)", "Echo Reply", "Time Exceeded", "ARP Reply"], why: "Ohne Route: Destination Unreachable (Type 3)." } ] },
  { title: "SNTP – Die Uhr geht falsch", intro: "Zeitstempel (in ms nach 10:00:00): T1 = 0 (Client sendet), T2 = 150 (Server empfängt), T3 = 160 (Server sendet), T4 = 130 (Client empfängt).", steps: [
    { q: "Offset = ((T2−T1) + (T3−T4)) / 2. Wie groß ist der Offset?", opts: ["90 ms", "120 ms", "75 ms", "10 ms"], why: "((150−0) + (160−130)) / 2 = (150 + 30) / 2 = 90 ms." },
    { q: "Delay = (T4−T1) − (T3−T2). Wie groß ist die Laufzeit?", opts: ["120 ms", "90 ms", "130 ms", "10 ms"], why: "(130−0) − (160−150) = 130 − 10 = 120 ms." },
    { q: "Wie korrigiert der Client seine Uhr?", opts: ["Um den Offset (+90 ms) vorstellen", "Um den Delay vorstellen", "Gar nicht, Server korrigiert", "Auf 00:00:00 setzen"], why: "Der Client passt seine Uhr um den berechneten Offset an." } ] }
];
