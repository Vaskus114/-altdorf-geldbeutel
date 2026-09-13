# Anzeige-Skalierung v4

Die Anzeigegröße wird ab dieser Version plattformunabhängig über die Root-Schriftgröße und `rem`-basierte UI-Maße umgesetzt.

## Warum die alte Lösung ersetzt wurde

Die bisherigen Varianten nutzten je nach Plattform CSS `zoom` bzw. viewportnahe Kompensationen. Das führte auf iOS bei großen Werten zu verschobenen/abgeschnittenen Dialogen und auf installierten Android-PWAs teilweise zu hoher Renderlast oder wirkungsloser Skalierung.

## Neue Methode

- 100 % = die normale Root-Schriftgröße des Browsers (typischerweise 16 px).
- 75–140 % verändern nur die Root-Schriftgröße.
- UI-Abstände, Schriftgrößen, Karten, Buttons, Bilder und Dialog-Innenmaße sind auf `rem` umgestellt.
- Der Browser-Viewport bleibt unverändert.
- Kein `transform: scale()` für die Anwendung.
- Kein CSS `zoom` für die Anwendung.
- Keine dynamische Änderung des Meta-Viewports.
- Responsive Breakpoints bleiben an der echten Gerätebreite orientiert; für sehr dichte Bereiche des Charakterbogens werden zusätzlich effektive Breitenklassen verwendet.
- Auf iOS bleiben Texteingaben mindestens 16 CSS-Pixel groß, damit Safari beim Fokussieren nicht selbst hineinzoomt.
- Auf Touch-Geräten bleiben zentrale Bedienelemente mindestens 44 CSS-Pixel hoch.

## Speicherung

Die Anzeigegröße bleibt eine Geräteeinstellung in `localStorage` und wird nicht mit Charakter-Backups synchronisiert.

## Android

Der optionale Android-Leistungsmodus bleibt getrennt von der Skalierung bestehen und reduziert ausschließlich aufwendige Paint-Effekte.
