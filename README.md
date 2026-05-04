# GONDOLA - Festival Website

## Projektname und Kurzbeschreibung
**GONDOLA** ist eine Website für ein fiktives Musikfestival, das Gondeln als zentrales Thema nutzt. Die Seite bietet Informationen zu Künstlern, Ticketverkauf, Warenkorb-Funktionalität und eine interaktive Benutzeroberfläche.

## Was ist GONDOLA?
Gondola ist ein hybrides Musikfestival in den Alpen, das die klassische Mainstage mit einem intimen, mobilen Erlebnis verbindet. Während oben auf dem Gipfel die Headliner spielen, verwandeln sich die Bergbahnen in «Sky-Stages». Jede Gondel ist einem Genre gewidmet (z.B. Techno-Gondel, Metal-Gondel, 80s-Gondel), sodass die Reise zum Gipfel bereits Teil des Line-ups ist.


## Projektstruktur
```
GONDOLA/
├── index.html              # Hauptseite mit Festival-Übersicht
├── cart.html               # Warenkorb- und Checkout-Seite
scripts/                    # JS-Scripts
│   ├── script.js           # Haupt-JavaScript für Navigation und Interaktionen
│   ├── cart.js             # JavaScript für Warenkorb-Funktionalität              
│   ├── faq-click-effect.js # JavaScript für FAQ-Accordion-Effekte
├── main artists/           # Artist-Unterseiten
│   ├── ajr.html
│   ├── charlotte.html
│   └── the-killers.html
├── stylesheets/            # CSS-Stylesheets
│   ├── style.css           # Globale Styles und Design-Tokens
│   ├── navigation.css      # Navigation-Styling
│   ├── artist.css          # Artist-Seiten-Styling
│   ├── cart.css            # Warenkorb-Styling
│   ├── faq.css             # FAQ-Styling
│   ├── lineup.css          # Lineup-Styling
│   └── ticket.css          # Ticket-Styling
└── images/                 # Bilder und Assets
    ├── Cable Cars/         # Gondel-Themen-Bilder
    └── main artists/       # Künstler-Bilder
```

### Erklärung der Hauptdateien und Ordner:
- **index.html**: Die Startseite des Festivals mit Übersicht, Lineup und allgemeinen Informationen.
- **cart.html**: Die Warenkorb-Seite, auf der Benutzer ihre Tickets verwalten und den Checkout durchführen können.
- **main artists/**: Enthält individuelle HTML-Seiten für jeden Künstler (AJR, Charlotte, The Killers) mit Biografien und Details.
- **stylesheets/**: Zentralisierter Ordner für alle CSS-Dateien, mit einem Design-System basierend auf CSS-Variablen für Farben, Schriftarten und Effekte.
- **scripts/**: JavaScript-Dateien für Interaktivität (im Workspace als einzelne .js-Dateien organisiert).
- **images/**: Statische Assets wie Festival-Bilder, Künstlerfotos und thematische Illustrationen.

## Funktionalitäten
- **Navigation**: Responsive Navigation mit thematischen "Pills" für verschiedene Bereiche.
- **Scroll-Reveals**: Sanfte Animationen beim Scrollen, die Elemente einblenden.
- **FAQ-Accordion**: Interaktive FAQ-Sektion mit Klick-Effekten zum Ausklappen von Antworten.
- **Warenkorb**: Vollständige Warenkorb-Funktionalität mit Hinzufügen/Entfernen von Tickets und Preisberechnung.
- **Checkout-Simulation**: Simulierter Zahlungsprozess mit Formularvalidierung und Bestätigung.
- **Artist-Seiten**: Dedizierte Seiten für jeden Künstler mit Bildern, Biografien und Links zur Hauptseite.

## Technologien
- **HTML**: Struktur und Semantik der Webseiten.
- **CSS**: Styling mit CSS Custom Properties (Variablen) für ein zentralisiertes Design-System.
- **JavaScript**: Interaktivität, DOM-Manipulation und localStorage für Warenkorb-Persistenz.
- **localStorage**: Browser-basierte Datenspeicherung für Warenkorb-Inhalte.
- **Font Awesome**: Icons für UI-Elemente wie Navigation und Buttons.
- **Google/Adobe Fonts**: Typografie mit Schriftarten wie "Bebas Neue" und "DM Sans".


## Bekannte Einschränkungen
- **Zahlung ist nur simuliert**: Der Checkout-Prozess speichert keine echten Zahlungsdaten und hat keine Backend-Anbindung.
- **Keine echte Backend-Anbindung**: Alle Daten (Tickets, Warenkorb) werden nur lokal im Browser gespeichert (localStorage).
- **Browser-Kompatibilität**: Optimiert für moderne Browser; ältere Versionen könnten Einschränkungen bei CSS-Variablen haben.
- **Keine echten APIs**: Keine Integration mit Zahlungsanbietern oder Datenbanken.

## Autor:innen
Erstellt von:
- Bachmann Valerie
- Helmboldt Xenia
- Kottmann Stefanie
- Schneider Valérie
- Zoss Anthony
als Teil des Modusl **UX in der agilen Softwareentwicklung** an der Fachhochschule Graubünden, Master in User Experience Design.