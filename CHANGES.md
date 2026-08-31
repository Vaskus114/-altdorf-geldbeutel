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
