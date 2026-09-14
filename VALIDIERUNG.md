# Validierung – Kompatibilität, Performance und Datenspeicher

Stand: 13.09.2026

## 1. Statische Prüfungen

Bestanden:

- `node --check app.js`
- `node --check wfrp1e-data.js`
- `node --check sw.js`
- CSS mit `tinycss2` geparst: **0 Parse-Fehler**
- `index.html` geparst: keine doppelten statischen IDs
- WFRP-Datenbank geladen und geprüft:
  - 14 Charakteristika
  - 129 Karriere-Presets / 129 Detaildatensätze
  - 133 Skills
  - 155 Zauber
  - 55 Waffen-Presets
  - 19 Rüstungs-Presets
  - 85 allgemeine Ausrüstungs-Presets
  - 0 fehlende Karriere-Detaildatensätze

## 2. Browser-Smoke-Test

Die UI wurde zusätzlich in echtem Headless-Chromium gerendert. Da die Build-Umgebung Navigation zu lokalen/externen HTTP-Origins per Organisationsrichtlinie blockiert, wurde für diesen UI-Test die Anwendung in ein isoliertes Browserdokument eingebettet und der Speicheradapter auf einen Test-localStorage umgebogen. Dadurch lassen sich Rendering, Touch-Ziele, Formulare und JavaScript-UI testen; die echte IndexedDB-Implementierung des Browsers ist in diesem speziellen Testaufbau nicht erreichbar.

Getestete Viewports:

- Android-artig: **390 × 844 CSS px**
- iPad-artig: **820 × 1180 CSS px**
- Windows/Edge-artig bei ungefähr 125-%-Skalierung: **1093 × 614 CSS px**
- Windows/Edge-artig bei ungefähr 150-%-Skalierung: **910 × 512 CSS px**
- Desktop: **1440 × 900 CSS px**

Ergebnisse:

- kein horizontaler Root-Overflow,
- kein horizontaler Overflow im Charakterbogen,
- Android: Advance-Kaufknöpfe sichtbar, ca. 46 px hoch und anklickbar,
- iPad/Desktop: Advance-Kaufknöpfe anklickbar,
- Advance-Kauf verändert den gekauften Wert im UI,
- unter 1400 CSS px werden Profilkarten verwendet,
- ab 1400 CSS px wird die klassische Profiltabelle verwendet,
- Profil-/Karriere-/Kampf-/Skills-/Magie-Tabs rendern ohne JavaScript-Fehler,
- Textfelder erhalten auf Android-/iPad-/Edge-Testprofilen korrekt Fokus,
- Portrait-Upload mit PNG erfolgreich; Bild wird aufbereitet und angezeigt.

## 3. Performance

Behobene Engpässe:

- `render()` schreibt nicht mehr bei jeder reinen UI-Neuzeichnung in den Speicher.
- Charaktere werden in IndexedDB einzeln gespeichert; eine kleine Änderung schreibt nicht mehr den vollständigen Datenbestand aller Charaktere.
- Portraits werden nur bei tatsächlicher Änderung neu als Blob geschrieben.
- Beim Start wird nur das Portrait des aktiven Charakters aus IndexedDB geladen.
- Der aktive Charakter wird bei Render/Tabwechsel nicht mehr vollständig neu sanitisiert/kopiert.
- `Intl.DateTimeFormat` wird für das Münzbuch nur einmal erzeugt.
- Das Münzbuch rendert zunächst maximal 250 Buchungen.

Performance-Stresstest im Headless-Browser:

- Testdaten: **10.000 Buchungen**
- Initial gerenderte DOM-Zeilen: **250**
- Nach „Weitere anzeigen“: **500**
- Initialer Testaufbau/Render in der Build-Umgebung: ca. **0,33 s**

Der Zeitwert ist kein Geräte-Benchmark, bestätigt aber, dass nicht mehr 10.000 DOM-Zeilen gleichzeitig erzeugt werden.

## 4. IndexedDB Schema v2

Interne Stores:

- `app-state`: kleine Metadaten wie aktive Charakter-ID,
- `characters`: ein Datensatz pro Charakter,
- `portraits`: Portraits separat als Blob.

Migration:

- vorhandene IndexedDB-v1-Daten werden beim Datenbank-Upgrade aus dem alten vollständigen `state`-Datensatz in einzelne Charakterdatensätze übertragen,
- vorhandene Portrait-Blobs bleiben im bisherigen Portrait-Store,
- falls noch keine IndexedDB-Daten existieren, werden weiterhin localStorage v9 sowie v1-v8 erkannt und einmalig übernommen,
- alte localStorage-Daten werden nicht automatisch gelöscht,
- Backupformat bleibt Version 8 und Restore akzeptiert Version 1-8.

Sicherheitsentscheidung: Ein durch einen noch geöffneten älteren App-Tab blockiertes IndexedDB-Upgrade fällt **nicht** still auf möglicherweise veraltete localStorage-Daten zurück. Die App weist stattdessen darauf hin, andere Tabs/Fenster zu schließen. Das verhindert auseinanderlaufende Datenstände.

Falls ein Browser IndexedDB tatsächlich überhaupt nicht unterstützt, bleibt der bisherige localStorage-Fallback bestehen.

## 5. Portrait-Verarbeitung

- nur Bilddateien,
- Eingangsdatei maximal 15 MB,
- maximal 900 px längste Kante,
- JPEG-Ausgabe mit Qualität 0,82,
- komprimierte Data-URL wird zusätzlich auf maximal 8 MiB begrenzt,
- Quelldatei wird über `URL.createObjectURL()` dekodiert; dadurch entsteht beim Einlesen keine zusätzliche vollständige Base64-Kopie der Originaldatei,
- Fehler bei Canvas/Image-Verarbeitung werden sauber abgefangen,
- in IndexedDB wird das fertige Portrait als Blob getrennt vom Charakterdatensatz gespeichert.

## 6. Service Worker / Offline

Korrigiert:

- Cache-Version erhöht,
- Core-Dateien werden mit `cache: reload` vorgecached,
- Versions-Querystrings (`app.js?v=...`) werden beim Offline-Match ignoriert,
- Navigation erhält ausschließlich einen HTML-Fallback,
- fehlende Bilder/Fonts werden nicht mehr fälschlich mit `index.html` beantwortet,
- optionale Design-Assets dürfen die komplette Service-Worker-Installation nicht mehr abbrechen,
- alte Cache-Versionen werden bei Aktivierung entfernt.

## 7. Plattformhinweise

Die App verwendet nur APIs, die in aktuellen Safari/iPadOS/macOS, Chrome/Android, Edge/Windows und Firefox vorhanden sind. Ein physischer Geräte-Test auf jedem einzelnen Betriebssystem ist in dieser Build-Umgebung nicht möglich; die problematischen Layoutbreiten und Touch-Interaktionen wurden deshalb zusätzlich in Chromium mit entsprechenden Viewports/User-Agents geprüft.

## Advance-Cap Regressionstest

Geprüfte Logik:

- gekauft +0, Schema A +1 -> 1 Kauf möglich
- gekauft +1, Schema A +1 -> kein weiterer Kauf
- gekauft +1, Schema A +2 -> genau 1 weiterer Kauf möglich
- gekauft +2, Schema A +2 -> kein weiterer Kauf; Kaufbutton deaktiviert
- gekauft +2, Schema A +3 -> genau 1 weiterer Kauf möglich
- gekauft +10, Schema WS +20 -> genau 1 weiterer +10-Kauf möglich
- gekauft +20, Schema WS +20 -> kein weiterer Kauf

Skill-, Talent- und Magieboni werden bei dieser Grenze absichtlich nicht mitgerechnet, da sie keine gekauften Career Advances sind.

## Anzeigegröße / UI-Scale

Geprüft:
- `app.js`, `wfrp1e-data.js` und `sw.js` bestehen `node --check`.
- Bereich ist auf 75–140 % begrenzt und wird auf 5-%-Schritte gerundet.
- Speicherung verwendet ausschließlich `localStorage` (`altdorf-geldbeutel-ui-scale-v1`); das IndexedDB-Schema bleibt unverändert.
- Profilansicht nutzt zusätzlich die effektive Breite `Viewport / Skalierungsfaktor`, damit die Desktop-Tabelle bei großer Anzeigegröße nicht in einen zu kleinen Layoutbereich gedrückt wird.
- Für effektive Breiten 900/760/560/520 px werden zentrale Responsive-Regeln zusätzlich per Klasse erzwungen.
- Druckansicht setzt den App-Zoom auf 100 % zurück.
- Service-Worker-Cache wurde auf `altdorf-geldbeutel-core-v20-ui-scale` erhöht.

Hinweis: Ein echter Geräte-Test auf Safari/iPadOS, Android Chrome und Windows Edge ist in dieser Umgebung nicht möglich. Die Skalierung verwendet bewusst CSS `zoom`, das auf den Zielbrowsern Layout und Hit-Testing gemeinsam skaliert; `transform: scale()` wird nicht verwendet.

## Skalierung v3 – Zusatzprüfung 13.09.2026

- `app.js`: `node --check` bestanden.
- `sw.js`: `node --check` bestanden.
- keine dynamische Aenderung des `meta[name=viewport]` mehr in `app.js` oder `index.html`.
- Android-PWA verwendet dieselbe Oberflaechenskalierung wie Browserbetrieb; Performance-Modus bleibt separat aktivierbar.
- `html` selbst bleibt immer bei `zoom: 1`; fixed Modals bleiben damit im echten Viewport.
- effektive Breite/Hoehe werden aus `visualViewport` (Fallback `innerWidth/innerHeight`) berechnet.
- `visualViewport.resize` aktualisiert die Grenzen bei Rotation, Safari-Leisten und Bildschirmtastatur.
- Service-Worker-Cache auf `v22-scale-performance-v3` angehoben.

## Skalierung v4 – statische Kompatibilitätsprüfung

Geprüft:
- `app.js`: `node --check` bestanden.
- `sw.js`: `node --check` bestanden.
- `styles.css`: Parsing mit `tinycss2` ohne Syntaxfehler.
- Media-Query-Breakpoints bleiben in CSS-Pixeln; UI-Deklarationen sind rem-basiert.
- Kein App-weites CSS `zoom` oder `transform: scale()` mehr aktiv.
- iOS-Eingabefelder besitzen eine 16px-Untergrenze.
- zentrale Touch-Ziele besitzen auf `pointer: coarse` eine 44px-Untergrenze.
- Skalierungswert wird vor CSS-Ladung angewendet und später von `app.js` konsistent übernommen.
- Android-Leistungsmodus bleibt unabhängig von der Skalierung.

Hinweis: Ein echter Gerätepark-Test auf physischem iPhone/iPad/Android/Windows/macOS ist in dieser Umgebung nicht möglich. Die v4-Lösung reduziert deshalb bewusst plattformspezifische Sonderwege und nutzt Standard-CSS (`rem`, normale Viewportgrößen, Overflow) als gemeinsame Basis.
- VisualViewport-Listener reagiert nur auf Breitenänderungen; Tastatur-Höhenanimationen verursachen keinen Skalierungs-Reflow.

## iOS Backup / Lifecycle

Geprüft: Die Anwendung speichert fachliche Änderungen weiterhin an den bestehenden `persist()`-Aufrufstellen. `visibilitychange` und `pagehide` starten keine zusätzliche IndexedDB-Transaktion mehr. Dadurch kann der iOS-Download-/Teilen-Dialog keine falsche lokale Speicherwarnung auslösen. `app.js` und `sw.js` wurden syntaktisch geprüft.
