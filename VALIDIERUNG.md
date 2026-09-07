# Validierung – Belastung & Portrait

## Belastungsregeln

Implementierte Formel:

- Normale Traglast: `S × 100 ENC`
- Zwerg: `S × 200 ENC`
- Überlast: `max(0, getragene ENC − Traglast)`
- Movement-Abzug: `ceil(Überlast / 50)`
- Effektive Movement Allowance: `max(0, Original-M − Movement-Abzug)`

Geprüfte Grenzfälle für M 4 / S 4:

- 400 ENC → M 4
- 434 ENC → 34 ENC zu viel → −1 → M 3
- 450 ENC → 50 ENC zu viel → −1 → M 3
- 451 ENC → 51 ENC zu viel → −2 → M 2
- 500 ENC → 100 ENC zu viel → −2 → M 2
- Zwerg mit S 4: 800 ENC ohne Abzug; ab 801 ENC → −1

Der Original-M-Wert wird nicht verändert und bleibt im Profil sichtbar.

## Portrait

- Bildupload ist auf Bilddateien beschränkt.
- Eingangsdateien über 15 MB werden abgelehnt.
- Das Bild wird auf maximal 900 px Kantenlänge skaliert und als JPEG komprimiert.
- Gespeicherte Data-URLs sind auf 1.500.000 Zeichen begrenzt.
- Der Portraitdatensatz wird durch `sanitizeSheet()` geprüft.
- Die bestehende Charakter-Sicherung enthält das komplette `sheet`-Objekt und damit auch das Portrait.

## Technische Prüfung

- `node --check app.js`
- `node --check wfrp1e-data.js`
- ZIP-Integrität wird vor Ausgabe geprüft.


## Consumer-Guide-Daten

- Neue/erhaltene Ausrüstungs-Presets gesamt: 84
- Subsistence S. 293: 10 Zeilen
- Miscellaneous Items S. 296: 69 Zeilen (10 Carrying, 15 Household, 7 Illumination, 11 Musical Instruments, 23 Tools, 3 Reading/Writing)
- Vorherige Munition/Zubehör-Presets beibehalten: 5
- Doppelte Preset-IDs: 0

## Waffen- und Rüstungsprüfung

Abgleich mit dem Grundregelwerk:

- Consumer Guide S. 295: alle Rüstungszeilen vorhanden.
- Consumer Guide S. 295: alle Waffenzeilen vorhanden; Munition/Zubehör wird als allgemeines Equipment geführt.
- Kampf S. 120: alle Einträge der Weapon Modifiers Table mit den Preset-Werten abgeglichen.
- Kampf S. 128: alle Einträge der Missile Weapon Chart mit Reichweite und Effective Strength abgeglichen.
- Korrigiert: Repeating Crossbow ES 1.
- Korrigiert: Halberd To Hit -10/0**.
- Fehlende Tabellenzeilen ergänzt: Sword, Foil, Garotte, Hook, Knuckle Duster, Scabbard, Back Plate, Gauntlets, Knight's Helm, Unrimmed Shield.
- Back Plate und Gauntlets: keine automatischen AP erfunden, da die Trefferzonen-/AP-Tabelle des Kampfkapitels dafür keinen separaten Eintrag vorgibt.

## Gambeson-Hausregel

- Materialwert `gambeson` wird von Migration/Sanitizer akzeptiert.
- Ohne Metall: 0/1 AP auf den im Gegenstand markierten Trefferzonen.
- Mit Metall auf derselben Trefferzone: Gambeson wird dort als fester +1 AP addiert.
- Anzeige nennt explizit „Gambeson unter Metall +1 AP“.
