# Validierung

Vor dem Packen wurden folgende Prüfungen ausgeführt:

- `app.js`: JavaScript-Syntaxprüfung erfolgreich
- `wfrp1e-data.js`: JavaScript-Syntaxprüfung erfolgreich
- Karriereoptionen: 129
- Detaildatensätze: 129
- fehlende Detaildatensätze: 0
- doppelte Karriere-IDs: 0
- Scheme-Datensätze ohne vollständige Characteristic-Schlüssel: 0

## Profil- und EP-Logik

- **Start** wird frei eingetragen.
- **Advanced** zeigt ausschließlich das Scheme der aktiven Karriere und bleibt frei editierbar.
- Advanced wird **nicht** direkt auf Current addiert.
- Tatsächlich erworbene Steigerungen werden separat als `purchased` gespeichert.
- Ein regulärer Advance kostet 100 EP.
- Prozentwerte steigen pro Kauf um +10; M, S, T, W und A um +1.
- Ein weiterer Kauf ist nur möglich, solange `purchased + Schritt <= Advanced` gilt.
- **Current = Start + purchased + Profilboni aus Skills/Talenten**.
- Bei einem Karrierewechsel bleiben gekaufte Advances erhalten; nur das Advanced-Schema wechselt.

## Profilverändernde Skills/Talente

Automatisch hinterlegt:

- Fleet Footed → M +1
- Lightning Reflexes → I +10
- Very Resilient → T +1
- Very Strong → S +1
- Strongman → S +1

Bei Strongman kann der variable D4-Wundenbonus im Skill-Editor als W-Profilbonus eingetragen werden.
Jeder Current-Wert mit eingerechnetem Skill-/Talentbonus erhält ein `*`.

## Migration

- LocalStorage-Key: `altdorf-geldbeutel-v9`
- Backup-Format: v8
- Backups v1–v8 können eingelesen werden.
- Bei älteren Daten ohne `purchased` wird dieser Wert mit 0 initialisiert; vorhandene Advanced-Werte bleiben als Scheme bestehen.


## Start-Bonus / Trefferzonen Update
- `app.js`: Node Syntaxprüfung bestanden.
- `wfrp1e-data.js`: Node Syntaxprüfung bestanden.
- Statische Prüfung: Stern-Markierung wird im Profil unter **Start** erzeugt; **Current** enthält keinen Stern.
- Statische Prüfung: alle sechs humanoiden Trefferbereiche 01-15 / 16-35 / 36-55 / 56-80 / 81-90 / 91-00 sind in der Rüstungsansicht hinterlegt.
- Ein Chromium-Screenshot-Smoke-Test wurde versucht, ist in dieser Container-Umgebung jedoch wegen des Headless-Browser-Prozesses in ein Timeout gelaufen; deshalb wird kein bestandener Browser-E2E-Test behauptet.
