# Änderungen – vollständige WFRP-1E-Karrieren

## Karriere-Datenbank

- alle 63 Basic Careers mit Advance Scheme integriert
- alle 40 Advanced-Career-Gruppen integriert
- mehrstufige Advanced Careers in einzelne auswählbare Stufen aufgeteilt
- insgesamt 129 konkrete Karriere-/Stufen-Presets
- jeder Eintrag besitzt ein vollständiges Scheme-Objekt
- Karriere-Skills für alle Presets hinterlegt
- Movement (M) in der Advance-Automatik ergänzt

## Charakterbogen

- Karriereauswahl lädt Scheme und Skillliste automatisch
- offene Karriere-Skills direkt mit 100 EP lernbar
- mehrere Karrieren über Karriere-Historie unterstützt
- frühere Career Schemes werden in der Historie als Kurzprofil angezeigt
- Skill-Auswahl berücksichtigt aktuelle und frühere Karrieren
- klassische Papierbogen-Optik weiter verfeinert

## Datenmigration

- LocalStorage-Key: `altdorf-geldbeutel-v6`
- Backup-Format: v5
- Import von Backups v1–v4 bleibt möglich
- Service-Worker-Cache auf `altdorf-geldbeutel-core-v11-all-careers` erhöht

## Korrektur bei mehreren Karrieren

- der freie Anfangs-Advance ist jetzt **charakterweit** auf die erste Karriere begrenzt
- ein Karrierewechsel erzeugt keinen neuen kostenlosen Advance
- Karrierewechsel werden unabhängig davon gezählt, ob die alte Karriere in der sichtbaren Historie archiviert wird


## Profilwerte Start / Advanced / Current
- Charakteristika werden nun wie gewünscht in drei Zeilen dargestellt: **Start**, **Advanced**, **Current**.
- **Start** enthält ausschließlich die bei der Charaktererschaffung festgelegten Werte.
- **Advanced** enthält das Advance Scheme der aktuell ausgewählten Karriere.
- **Current** wird automatisch als `Start + Advanced` berechnet.
- Der frühere manuelle Charakteristik-Modifikator wird nicht mehr in Current eingerechnet.
- Das Bearbeitungsfenster verwendet dieselbe Tabellenstruktur; Current ist dort ein automatisch aktualisiertes Ausgabefeld.
- Dieser ältere Zwischenstand wurde in der folgenden Korrektur ersetzt.


## Korrektur Advanced-Semantik
- **Advanced** steht jetzt für das komplette Advance Scheme der aktuell ausgewählten Karriere, nicht für bereits gekaufte Steigerungen.
- Beim Auswählen oder Reaktivieren einer Karriere wird ihr Core-Schema automatisch in die Advanced-Zeile übernommen.
- Start und Advanced sind im Profil frei editierbar.
- Änderungen an Advanced aktualisieren zugleich das aktuell verwendete Karriere-Schema.
- Current wird ausschließlich als `Start + Advanced` berechnet.
- Charakteristik-Kaufbuttons und der freie Anfangs-Advance wurden aus dieser Darstellung entfernt, damit Advanced nicht mehr als Kaufhistorie missverstanden wird.
- LocalStorage-Key auf `altdorf-geldbeutel-v8`, Backup-Format auf v7 und Service-Worker-Cache auf `altdorf-geldbeutel-core-v11` angehoben.


## EP-Advances und Talentboni
- Advanced bleibt das Karriere-Schema und wird nicht mehr direkt auf Current addiert.
- Neuer separater Wert `purchased` je Charakteristik speichert tatsächlich erworbene Advances.
- Jeder reguläre Charakteristik-Advance kostet 100 EP; Kaufbuttons befinden sich im Karriere-Tab.
- Current = Start + gekaufte Advances + Profilboni aus Skills/Talenten.
- Profilboni hinterlegt: Fleet Footed M +1, Lightning Reflexes I +10, Very Resilient T +1, Very Strong S +1, Strongman S +1.
- Bei skill-/talentbeeinflussten Current-Werten erscheint ein Stern `*` mit Hinweis auf den verursachenden Skill.
- Strongmans variabler D4-Wundenbonus kann als W-Profilbonus am Skill eingetragen werden.
- LocalStorage-Key auf `altdorf-geldbeutel-v9`, Backup-Format auf v8 und Service-Worker-Cache auf `altdorf-geldbeutel-core-v12` angehoben.

> Hinweis: Frühere Abschnitte in diesem Änderungsprotokoll dokumentieren Zwischenstände. Die aktuelle verbindliche Logik ist der Abschnitt **EP-Advances und Talentboni**: Advanced ist nur das Scheme; Current verwendet ausschließlich Start + gekaufte Advances + Skill/Talent-Boni.
