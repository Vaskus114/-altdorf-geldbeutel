# Altdorfer Geldbeutel – WFRP 1E Core Character Manager

Dieses Update erweitert den bestehenden **Altdorfer Geldbeutel** um einen offline nutzbaren Charaktermanager für **Warhammer Fantasy Roleplay, 1. Edition**. Die eingebauten Karriere-, Skill-, Ausrüstungs- und Magiedaten verwenden als Regelgrundlage ausschließlich das vorhandene **First Edition Core Rulebook**.

## Neu in dieser Version

- **63 Basic Careers** mit fest hinterlegtem Advance Scheme und Karriere-Skills.
- **40 Advanced-Career-Gruppen** aus dem Grundregelwerk.
- Mehrstufige Advanced Careers werden einzeln auswählbar gemacht, z. B. **Alchemist, Cleric, Druidic Priest, Wizard, Demonologist, Elementalist, Illusionist und Necromancer jeweils Level 1–4**.
- **Mercenary** wird als **Sergeant** und **Captain** geführt.
- **Sea Captain** wird als **Mate** und **Captain** geführt.
- Insgesamt stehen dadurch **129 konkrete Core-Karriere-/Stufen-Presets** zur Auswahl.
- Das ausgewählte **Advance Scheme erscheint sofort** im Karriere-Tab.
- Die **Skills der aktuellen Karriere** werden unmittelbar darunter angezeigt und können direkt gelernt werden.
- Frühere Karrieren werden in einer echten **Karriere-Historie** gespeichert; ihre Schemata bleiben erhalten und werden in Kurzform angezeigt.
- Der Skill-Picker priorisiert Skills aus **aktueller und früheren Karrieren**.
- **Movement (M)** wird jetzt korrekt als steigerbarer Scheme-Wert unterstützt, sofern eine Karriere wie der Runner dies vorsieht.
- Backup-Format **v7**; ältere Backups v1–v6 werden weiter importiert.

## Bereits enthalten

- Geldbeutel, Münzbuch, Truhen und Lager
- vollständiges WFRP-1E-Profil: M, WS, BS, S, T, W, I, A, Dex, Ld, Int, Cl, WP, Fel
- Charakterbogen mit Profil, Karriere, Kampf, Skills und Magie
- 133 Core-Skills plus Specialist-Weapon-Kategorien
- Core-Rüstungen mit Trefferzonen-Automatik
- Core-Waffen-/Fernkampf-Presets
- allgemeine Core-Ausrüstung
- 155 Core-Zaubereinträge
- EP-Abzug für neue Karriere-Skills; Charakteristik-Werte werden im Profil frei über Start/Advanced geführt
- automatisierte Rüstungs- und Magie-Wechselwirkungen
- frei editierbare Felder für Hausregeln und Sonderfälle

## Karriere-Logik

Advance Schemes werden als **Advanced-Zeile der aktuell aktiven Karriere** behandelt. Beim Karrierewechsel wird das Scheme der neuen Karriere in Advanced geladen; frühere Schemata werden nicht aufaddiert, sondern bleiben in der Karriere-Historie erhalten.

Bei einer Core-Karriere sind die Scheme-Felder weiterhin manuell editierbar. Das ist absichtlich so, damit Hausregeln oder individuelle Korrekturen möglich bleiben, ohne die hinterlegten Core-Daten zu verlieren.

## Installation in das bestehende Repository

Die Dateien aus diesem Ordner in das Wurzelverzeichnis des bestehenden Repositories kopieren und die gleichnamigen Dateien ersetzen:

- `index.html`
- `styles.css`
- `app.js`
- `wfrp1e-data.js`
- `sw.js`
- `manifest.webmanifest`

Die bereits vorhandenen Grafik- und Fontdateien des Repositories **nicht löschen**. `styles.css` und `sw.js` verwenden sie weiterhin.

Nach dem Update einer bereits installierten PWA kann ein vollständiges Neuladen nötig sein, damit der neue Service-Worker-Cache übernommen wird.


## Charakteristika: Start / Advanced / Current
Die Profilwerte folgen jetzt dieser Logik:

- **Start**: frei eingetragene Werte aus der Charaktererschaffung.
- **Advanced**: das **Advance Scheme der aktuell ausgewählten Karriere**. Es zeigt nur das Potential, das in dieser Karriere gekauft werden kann, und bleibt frei editierbar.
- **Current**: `Start + tatsächlich gekaufte Advances + Profilboni aus Skills/Talenten`.

Ein Wert aus **Advanced** erhöht Current also **nicht automatisch**. Jeder reguläre Characteristic-Advance kostet 100 EP. Im Karriere-Tab wird pro Wert angezeigt, wie viel das aktuelle Scheme erlaubt und wie viel davon bereits gekauft wurde.

Profilverändernde Core-Skills/Talente werden automatisch berücksichtigt. Hinterlegt sind insbesondere **Fleet Footed (M +1)**, **Lightning Reflexes (I +10)**, **Very Resilient (T +1)** und **Very Strong (S +1)**. **Strongman** gibt automatisch S +1; der variable D4-Wundenbonus kann im Skill-Editor beim W-Bonus eingetragen werden. Sobald ein Skill/Talent in Current eingerechnet wird, erscheint am betreffenden Current-Wert ein `*`.

Beim Karrierewechsel bleibt die Summe der bereits gekauften Advances erhalten. Das neue Advanced-Schema bestimmt nur, ob noch weitere Advances gekauft werden dürfen; die Schemata werden nicht aufeinander addiert.


## Responsive Profilanzeige
Der Profilbereich passt sich jetzt an Desktop, Tablet und Smartphone an. Auf breiten Bildschirmen bleibt die klassische Tabellenansicht erhalten; auf kleineren Displays werden die Charakteristika automatisch als kompakte Start/Advanced/Current-Karten dargestellt.


## Profilboni und Trefferzonen

- Profilverändernde Skills/Talente werden jetzt in **Start** eingerechnet und dort mit `*` markiert.
- **Current** zeigt die Gesamtsumme aus effektivem Startwert und tatsächlich gekauften Advances, ohne eigenen Stern.
- Der frei eingegebene Roh-Startwert bleibt im Editor erhalten; die effektive Start-Anzeige wird separat darunter gezeigt.
- Die Rüstungsansicht zeigt die humanoiden Trefferzonen des WFRP-1E-Grundregelwerks: **Kopf 01-15, rechter Arm 16-35, linker Arm 36-55, Körper 56-80, rechtes Bein 81-90, linkes Bein 91-00**.
- Zur Trefferzonenermittlung werden bei einem erfolgreichen Angriff die beiden Ziffern des Angriffswurfs vertauscht (z. B. 27 -> 72).

## Beschreibungen für Skills und Zauber
Die Core-Datenbank enthält jetzt Beschreibungen für alle **133 Skills** und alle **155 Zauber** des WFRP-1E-Grundregelwerks. Im Charakterbogen bleiben die Listen kompakt; über den aufklappbaren Bereich **Beschreibung & Regelwirkung** bzw. **Beschreibung & Wirkung** lässt sich der Regeltext direkt am Eintrag anzeigen. Bereits vorhandene Core-Einträge werden beim Laden automatisch ergänzt, sofern ihre Beschreibung bisher leer war.

Die Zauberbeschreibungen sind bewusst kompakt auf die wesentliche Wirkung ausgerichtet. MP, Reichweite, Dauer und Zutaten bleiben weiterhin in ihren eigenen Feldern und können wie alle Charakterdaten manuell angepasst werden.
