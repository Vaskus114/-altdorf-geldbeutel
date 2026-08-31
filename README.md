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
- Backup-Format **v5**; ältere Backups v1–v4 werden weiter importiert.

## Bereits enthalten

- Geldbeutel, Münzbuch, Truhen und Lager
- vollständiges WFRP-1E-Profil: M, WS, BS, S, T, W, I, A, Dex, Ld, Int, Cl, WP, Fel
- Charakterbogen mit Profil, Karriere, Kampf, Skills und Magie
- 133 Core-Skills plus Specialist-Weapon-Kategorien
- Core-Rüstungen mit Trefferzonen-Automatik
- Core-Waffen-/Fernkampf-Presets
- allgemeine Core-Ausrüstung
- 155 Core-Zaubereinträge
- EP-Automatik: 100 EP je Charakteristik-Advance bzw. neuem Karriere-Skill
- automatisierte Rüstungs- und Magie-Wechselwirkungen
- frei editierbare Felder für Hausregeln und Sonderfälle

## Karriere-Logik

Advance Schemes werden als **maximale Steigerung gegenüber dem Ausgangsprofil** behandelt. Beim Karrierewechsel werden die Schemata nicht einfach aufeinander addiert. Die bisherige Karriere kann automatisch in die Historie verschoben werden, während die neue Karriere ihr eigenes Core-Schema und ihre Skills lädt.

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
