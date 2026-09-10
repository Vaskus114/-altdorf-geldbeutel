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


## Profil-Responsive-Fix
- Der Profil-Tab nutzt die volle Breite des Charakterbogens.
- Die große Start/Advanced/Current-Tabelle wird auf Tablet und Smartphone automatisch durch kompakte Profilkarten ersetzt.
- Lange Namen, Karriere-Historien und Merkmale brechen sauber um statt aus den Boxen zu laufen.
- Das Bearbeitungsfenster für Charakteristika ist jetzt ein responsives Kartenraster statt einer überbreiten Tabelle.
- Tabs und Kopfzeilen sind auf kleinen Displays scrollbar bzw. zweispaltig angeordnet.


## Desktop-Profil-Fix
- Charakterbogen nutzt auf Desktop bis zu 1500 px bzw. 96 % der Fensterbreite.
- Profil-Tabelle wird ab 1250 px als vollständige klassische Tabelle dargestellt.
- Auf kleineren Desktop-/Notebookbreiten wird automatisch auf die kompakte Kartenansicht gewechselt, statt Spalten zu quetschen.
- Tabellenüberschriften dürfen wieder umbrechen und werden nicht mehr abgeschnitten.
- Profil, Kopfbereich und Ressourcen nutzen die verfügbare Desktopbreite vollständig.

## Start-Boni & Trefferzonen
- Feste Profilboni aus Skills/Talenten werden im Profil jetzt in der Zeile **Start** angezeigt und dort mit `*` markiert.
- **Current** bleibt die Gesamtsumme aus effektivem Startwert und tatsächlich gekauften Advances, ohne eigenen Stern.
- Im Werte-Editor wird der rohe Startwert weiterhin frei eingegeben; darunter erscheint die effektive Start-Anzeige inklusive Skill-/Talentbonus.
- Rüstungszonen zeigen jetzt die WFRP-1E-Trefferbereiche: Kopf 01-15, rechter Arm 16-35, linker Arm 36-55, Körper 56-80, rechtes Bein 81-90, linkes Bein 91-00.
- Unter der Rüstungsanzeige steht die Regel, dass die Ziffern des erfolgreichen Angriffswurfs zur Ermittlung der Trefferzone vertauscht werden.


## Inventar-Synchronisierung
- Der Charakterbogen zeigt im Bereich **Kampf → Ausrüstung → Am Körper** jetzt alle Gegenstände aus dem Körper-Inventar, nicht nur Waffen und Rüstung.
- Gegenstände, die über **Truhen & Lager → Am Körper** hinzugefügt werden, erscheinen dadurch sofort auch im Charakterbogen.
- Waffen und Rüstungen behalten dort ihre Anlegen/Ablegen-Funktion; normale Gegenstände werden mit Menge, ENC, Wert und Notiz angezeigt.
- Beide Menüs greifen auf dasselbe Inventarobjekt zu; es gibt keine doppelte Datenhaltung.

## Skill- & Zauberbeschreibungen
- Für alle 133 Core-Skills ist jetzt eine Regelbeschreibung aus dem WFRP-1E-Grundregelwerk hinterlegt.
- Für alle 155 Core-Zauber ist jetzt eine kompakte Regel-/Wirkungsbeschreibung hinterlegt.
- Bereits gespeicherte Core-Skills und Core-Zauber erhalten fehlende Beschreibungen beim Laden automatisch aus der Core-Datenbank.
- Im Charakterbogen sind die Texte platzsparend über **Beschreibung & Regelwirkung** bzw. **Beschreibung & Wirkung** aufklappbar.
- Skill-Beschreibungen bleiben im Editor frei bearbeitbar; eigene Skills können ebenfalls eigene Beschreibungen erhalten.
- Zauberbeschreibungen bleiben wie bisher frei bearbeitbar.
- Alte Core-Zauber, die bisher nur den Platzhaltertext bzw. die frühere Kurznotiz gespeichert hatten, werden beim Laden automatisch auf die neue Core-Beschreibung aktualisiert. Eigene manuell bearbeitete Beschreibungen bleiben erhalten.

## Belastung & Charakterportrait

- Überladung reduziert jetzt die angezeigte **Movement Allowance** nach WFRP 1E: Für je 50 ENC oder angefangene 50 ENC über der Traglast wird Movement um 1 reduziert.
- Der gespeicherte/originale M-Wert bleibt unverändert und wird bei einer Belastungsstrafe weiterhin sichtbar angezeigt.
- Die Belastungsbox im Kampf-Tab zeigt Original-M, effektives Movement, ENC-Überschreitung und den berechneten Abzug.
- Zwerge werden bei `Volk` als `Zwerg/Zwerge/Dwarf/Dwarfs` erkannt und verwenden regelkonform Stärke × 200 statt Stärke × 100 als Traglastgrenze.
- Im Profil kann pro Charakter ein Portrait hochgeladen, angezeigt, ersetzt und entfernt werden.
- Portraits werden vor dem Speichern auf maximal 900 px Kantenlänge verkleinert und als komprimiertes JPEG im lokalen Charakterdatensatz gespeichert.
- Das Portrait ist dadurch Bestandteil der bestehenden Charakter-Sicherung und wird beim Wiederherstellen mit übernommen.


## Consumer-Guide-Erweiterung: Subsistence & Miscellaneous Items

- Gegenstands-Presets aus `Subsistence` auf Grundregelwerk S. 293 ergänzt (inkl. Iron Rations, Getränke, Unterkunft/Stabling und Fodder).
- Sämtliche Tabellen unter `Miscellaneous Items` auf Grundregelwerk S. 296 ergänzt: Carrying Equipment, Household Items and Personal Equipment, Illumination, Musical Instruments, Tools sowie Reading and Writing.
- Preis, ENC und Availability wurden aus den Tabellen übernommen. Availability und Seitenquelle stehen als Notiz am Preset.
- Preset-Auswahl ist jetzt nach den Original-Tabellen gruppiert, damit die große Liste übersichtlich bleibt.
- Bei Preisbereichen verwendet das Preset einen sinnvollen Ausgangswert und dokumentiert den Tabellenbereich in der Notiz; alle Werte bleiben frei editierbar.

## Waffen-/Rüstungsvollständigkeit & Gambeson

- Armour- und Weapons-Presets erneut mit dem WFRP-1E-Grundregelwerk abgeglichen (Kampf S. 120/121/128 sowie Consumer Guide S. 295).
- Fehlende Consumer-Guide-Rüstung ergänzt: Back Plate, Gauntlets, Knight's Helm und Unrimmed Shield.
- Bezeichnungen der vorhandenen Teile an die Tabellenbezeichnungen angenähert (u. a. Leather Jacket/Jack, Mail Sleeve/Arm Bracers, Vambrace, Cuisse & Greaves, Pot Helmet).
- Fehlende Waffen ergänzt: Sword, Foil, Garotte, Hook und Knuckle Duster.
- Scabbard als Waffen-Zubehör ergänzt.
- Zusätzlich eigenes Preset „Improvised Missile“ für die vollständige Missile Weapon Chart ergänzt.
- Repeating Crossbow korrigiert: Effective Strength 1 (nicht 4).
- Halberd korrigiert: To Hit -10/0** statt -10/+10**.
- Gambeson als eigener Rüstungstyp eingebaut: allein 0/1 AP wie Leder; auf überdeckten Trefferzonen unter Metall als fester +1 AP (Hausregel).
- Leder bleibt unter Metall ohne zusätzlichen Schutz.
- Back Plate und Gauntlets werden zwar vollständig aus der Einkaufstabelle angeboten, erhalten aber keine erfundenen AP: Das Kampfkapitel weist ihnen keinen eigenen AP-/Trefferzoneneintrag zu. Die Werte bleiben frei editierbar.


## Advance-Korrektur & Ausrüstungseffekte

- Gekaufte Charakteristik-Advances können im Karriere-Reiter schrittweise zurückgenommen werden.
- Beim Zurücknehmen wird genau ein +10- bzw. +1-Schritt entfernt und der reguläre Advance-Preis von 100 EP wieder gutgeschrieben.
- Waffen und Rüstungen können nun beliebig viele frei benannte Effekte/Fähigkeiten besitzen.
- Jeder Effekt hat Typ, Beschreibung/Regelwirkung und einen Aktiv-Schalter.
- Effekte werden unter Kampf → Magische Effekte aufgelistet, sobald die zugehörige Waffe/Rüstung aktiv angelegt bzw. griffbereit ist.
- Der Bereich zeigt nun außerdem alle aktivierten Zauber, nicht nur Zauber mit Rüstungsbonus.
- Beispielnamen wie Armour Piercing oder Warp Attack können frei eingetragen werden; die App erfindet dafür keine automatische Regelwirkung.
