# Skalierung v2 & Android-Performance

- Android verwendet fuer 75–140 % keinen globalen CSS-Zoom mehr, sondern einen angepassten Layout-Viewport.
- Dadurch folgen Media Queries, Fixed-Dialoge und Touch-Ziele derselben effektiven Breite.
- Die Skalierung wird beim Verschieben des Reglers nur vorgewaehlt und erst beim Loslassen angewendet.
- Auf Android ist standardmaessig ein Leistungsmodus aktiv. Er reduziert ausschliesslich teure Darstellungs-Effekte (Blur, grosse Schatten, Filter, Clip-Paths), nicht Funktionen oder Daten.
- Der Leistungsmodus kann in den Anzeigeeinstellungen deaktiviert werden.
- Desktop/iOS behalten CSS-Zoom; Fixed-Dialoge werden dabei explizit an die effektive Viewporthoehe/-breite angepasst, damit bei 125–140 % nichts abgeschnitten wird.
- Die Einstellung bleibt geraetespezifisch in localStorage gespeichert.
