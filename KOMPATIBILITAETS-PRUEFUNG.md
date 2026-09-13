# Kompatibilitäts- & Performance-Prüfung

Stand: 13.09.2026

## Behobene Punkte

- IndexedDB intern auf Schema v2 umgestellt: Charaktere werden einzeln gespeichert, statt bei jeder Änderung den kompletten Datenbestand aller Charaktere neu zu schreiben.
- Bestehende IndexedDB-v1-Daten werden beim ersten Start automatisch auf v2 migriert.
- Portraits werden nur noch bei tatsächlicher Änderung in IndexedDB neu geschrieben. Beim Start wird nur das Portrait des aktiven Charakters geladen.
- Wiederholte Voll-Sanitierung des aktiven Charakters bei jedem Rendern/Tabwechsel entfernt.
- Das Münzbuch rendert maximal 250 Einträge auf einmal; weitere Einträge können schrittweise nachgeladen werden.
- Ein gemeinsamer Datumsformatter ersetzt die frühere Neuerzeugung eines Formatters pro Buchungszeile.
- Das iOS/iPadOS-Fokus-Workaround läuft nur noch auf iOS/iPadOS und greift nicht mehr in das normale Android-Touch-Verhalten ein.
- Schreibvorgänge werden explizit nach Änderungen ausgelöst; reine UI-Neuzeichnungen verursachen keine unnötigen IndexedDB-Schreibvorgänge mehr.
- Der Service Worker behandelt Versions-Querystrings korrekt, sodass `app.js?v=...` und `styles.css?v=...` offline nicht versehentlich als HTML beantwortet werden.
- Navigations-Fallback und statische Ressourcen sind im Service Worker getrennt. Fehlende Bilder/Fonts liefern offline nicht mehr die Startseite als falschen Dateityp.
- Optionale Design-Assets können eine Service-Worker-Installation nicht mehr komplett verhindern.
- Ein blockiertes IndexedDB-Upgrade fällt nicht still auf alte localStorage-Daten zurück. Stattdessen erscheint ein Hinweis, andere geöffnete App-Tabs zu schließen. Das vermeidet auseinanderlaufende Datenstände.

## Zielplattformen

Die verwendeten APIs sind mit aktuellen Versionen von Safari/iPadOS/macOS, Chrome/Android, Chrome/Windows, Edge/Windows und Firefox kompatibel. Falls IndexedDB in einem sehr alten oder ungewöhnlich eingeschränkten Browser überhaupt nicht vorhanden ist, bleibt der bisherige localStorage-Fallback erhalten.

## Datenkompatibilität

- Bestehende localStorage-Daten bleiben migrierbar.
- Die vorherige IndexedDB-v1-Struktur wird automatisch übernommen.
- Das Charakter-Backupformat bleibt Version 8 und damit unverändert kompatibel.
- Portraits bleiben Bestandteil des JSON-Backups.

## Hinweise

Die App bleibt eine lokale PWA: Browser-/App-Daten zu löschen entfernt auch IndexedDB. Regelmäßige JSON-Backups bleiben daher sinnvoll.
