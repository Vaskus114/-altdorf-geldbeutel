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
