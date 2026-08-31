# Altdorfer Geldbeutel – WFRP 1E Core Update

Dieses Update erweitert den bestehenden **Altdorfer Geldbeutel** um einen offline nutzbaren Charaktermanager für **Warhammer Fantasy Roleplay, 1. Edition**. Regelgrundlage der eingebauten Presets ist ausschließlich das vorhandene First-Edition-Core-Rulebook.

## Enthalten

- Geldbeutel, Münzbuch, Truhen und Lager wie bisher
- vollständiges WFRP-1E-Profil (M, WS, BS, S, T, W, I, A, Dex, Ld, Int, Cl, WP, Fel)
- Charakterbogen mit Profil, Karriere, Kampf, Skills und Magie
- 63 Basic Careers und 40 Advanced/Specialist Careers aus dem Core
- 133 Core-Skills plus Specialist-Weapon-Kategorien
- Core-Rüstungen mit Trefferzonen-Automatik und zulässigen Schichtungen
- Core-Waffen-/Fernkampf-Presets mit Modifikatoren, Reichweite, ENC und Werten aus der Ausrüstungstabelle, soweit eindeutig lesbar
- allgemeine Core-Ausrüstung mit ENC/Wert für häufige Gegenstände
- 155 Zaubernamen aus der Core-Zauberübersicht (Petty, Battle, Demonology, Elemental, Illusionist, Necromantic und Druidic)
- EP-Automatik: 100 EP je Charakteristik-Advance, Prozentwerte +10, S/T/W/A +1
- einmaliger freier Anfangs-Advance
- optionaler 100-EP-Abzug beim Lernen eines neuen Karriere-Skills
- Spezialwaffen-Hinweis: ohne passende Specialist-Weapon-Kategorie gilt WS/BS 10
- Magie/Rüstung: +2 MP je relevantem Rüstungspunkt; Meditation wird bei Rüstung/Schild als blockiert angezeigt
- Backup-Format v4; ältere v1-v3-Backups werden weiter importiert
- sämtliche Felder bleiben frei bearbeitbar und manuell überschreibbar

## Wichtiger Grundsatz bei den Core-Daten

Es werden **keine unsicheren OCR-Werte geraten**. Die Career-Namen, Skill-Liste, Rüstungs-/Waffendaten und Zaubernamen sind aus dem Core übernommen. Bei Zaubern, deren Detailfelder (MP, Reichweite, Dauer oder Zutaten) in der PDF-Auslesung nicht zuverlässig genug zugeordnet werden konnten, bleiben diese Details im Preset bewusst unbestätigt. Der Zauber kann erst über den automatischen „Wirken“-Knopf MP abziehen, nachdem die MP-Kosten im Editor bestätigt wurden.

Das gleiche gilt für **Career Advance Schemes**: Die Karriereauswahl ist vollständig vorhanden, das jeweilige Schema wird bewusst frei eingetragen/bestätigt, statt einen möglicherweise falsch erkannten Tabellenwert zu automatisieren. Sobald ein Schema eingetragen ist, prüft die App Steigerungen und EP-Kosten automatisch.

## Installation ins bestehende Repository

Die Dateien aus diesem Ordner in das Wurzelverzeichnis des bestehenden Repositories kopieren und die gleichnamigen Dateien ersetzen. Die bereits vorhandenen Grafik- und Fontdateien des Repositories **nicht löschen**; `styles.css` und `sw.js` nutzen diese weiterhin für die Offline-Darstellung.

Zu ersetzen/ergänzen sind insbesondere:

- `index.html`
- `styles.css`
- `app.js`
- `wfrp1e-data.js`
- `sw.js`
- `manifest.webmanifest`

Nach einem Update einer bereits installierten PWA kann ein einmaliges vollständiges Neuladen nötig sein, damit der neue Service-Worker-Cache aktiv wird.
