# Core-Daten – Karriere- und Regelnotizen

**Quelle:** Warhammer Fantasy Roleplay – First Edition Core Rulebook.

Die App trennt weiterhin zwischen `core` und `custom`. Core-Presets dürfen nach dem Einfügen frei bearbeitet werden.

## Karriere-Datenumfang

- 63 Basic Careers
- 40 benannte Advanced-Career-Gruppen
- 66 konkret auswählbare Advanced-Career-/Stufen-Presets
- 129 auswählbare Core-Karriere-/Stufen-Presets insgesamt

Mehrstufige Karrieren sind als einzelne Stufen hinterlegt. Das betrifft insbesondere Alchemist, Cleric, Druidic Priest, Wizard, Demonologist, Elementalist, Illusionist und Necromancer. Mercenary und Sea Captain besitzen ebenfalls getrennte Stufen/Ränge.

Jeder der 129 Einträge enthält ein vollständiges Scheme-Objekt für:

`M, WS, BS, S, T, W, I, A, Dex, Ld, Int, Cl, WP, Fel`

Nicht gesteigerte Werte stehen ausdrücklich auf `0`, sodass kein Schemafeld fehlt.

## Karriere-Historie

Beim Wechsel einer Karriere kann die bisherige Karriere archiviert werden. Gespeichert werden dabei:

- Name / konkrete Stufe
- Typ Basic / Advanced / Custom
- Advance Scheme
- Quellen-/Notizfeld
- Zeitstempel des Wechsels

Die Historie beeinflusst die aktuelle Charakteristik nicht zusätzlich; sie dient zur Nachvollziehbarkeit und stellt frühere Karriere-Skills im Skill-Picker bereit.

## Automatisierte Regeln

- Traglastanzeige: Stärke × 100 ENC
- Characteristic Advances: 100 EP
- WS/BS/I/Dex/Ld/Int/Cl/WP/Fel: +10 je Advance
- M/S/T/W/A: +1 je Advance, falls das Career Scheme den Wert vorsieht
- freier Anfangs-Advance einmalig ohne EP-Kosten
- neue Karriere-Skills: 100 EP
- Rüstungsberechnung nach Trefferzonen
- Leder-0/1-Regel
- Specialist Weapons ohne passende Spezialisierung: WS bzw. BS 10
- Zaubern in Rüstung: +2 MP je relevantem Rüstungspunkt; Meditation mit Rüstung/Schild blockiert

## Hinweis zu freien Feldern

Die Karriere-Datenbank ist jetzt vollständig als Core-Preset hinterlegt. Manuelle Scheme-Felder bleiben trotzdem erhalten, damit Hausregeln und individuelle Änderungen möglich sind. Bei Zaubern bleiben nicht sicher bestätigte Detailwerte weiterhin frei editierbar; dieses Update konzentriert sich auf die vollständige Karriere-/Scheme-Integration.
