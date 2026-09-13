# Gerätespezifische Anzeigeskalierung

- Bereich: 75–140 %, Schrittweite 5 %.
- Speicherung: `localStorage`, Schlüssel `altdorf-geldbeutel-ui-scale-v1`.
- Keine Änderung am IndexedDB-Schema und keine Auswirkung auf Charakter-Backups.
- Technische Umsetzung: CSS `zoom` auf dem Dokument. Dadurch skalieren Text, Buttons, Dialoge, Charakterbogen und Lager gemeinsam, ohne `transform: scale()` und dessen typische Scroll-/Touch-Nebenwirkungen.
- Responsive Sonderfall Profil: Die App berechnet `Viewportbreite / Skalierungsfaktor`. Unter 1400 effektiven Pixeln werden die Profilkarten erzwungen, darüber die klassische Tabelle.
- Print: immer 100 %.
