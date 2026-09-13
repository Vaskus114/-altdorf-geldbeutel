# Android-Leistungsmodus & Skalierung v4

Die Skalierung selbst ist nicht mehr Android-spezifisch. Sie läuft auf allen Plattformen über dieselbe REM-basierte Methode.

Der Android-Leistungsmodus bleibt optional aktiv und reduziert ausschließlich teure visuelle Effekte (große Schatten, Filter, Blur, Clip-Paths und einige permanente Dekorationsebenen). Regeln, Daten, IndexedDB und Bedienlogik werden dadurch nicht verändert.

Das ist besonders für installierte Chrome-PWAs auf Mittelklasse-Geräten sinnvoll.
