# IndexedDB-Migration

Die Anwendung verwendet IndexedDB als primären lokalen Speicher.

## Schema v2

Ab dieser Version werden Charaktere einzeln im Object Store `characters` gespeichert. Der Store `app-state` enthält nur noch kleine Metadaten wie die ID des aktiven Charakters. Portraits bleiben separat als Blob im Store `portraits`.

Dadurch muss bei einer kleinen Änderung an einem Charakter nicht mehr der komplette Datenbestand aller Charaktere neu serialisiert und geschrieben werden.

## Automatische Übernahme

1. Existiert bereits die vorherige IndexedDB-v1-Datenbank, migriert das Browser-Upgrade deren Charaktere automatisch in den neuen `characters`-Store.
2. Existiert noch keine IndexedDB-Datenbank, sucht die App weiterhin nach den bisherigen localStorage-Versionen v9 bis v1 und übernimmt sie einmalig.
3. Portraits aus der bisherigen IndexedDB bleiben erhalten.
4. Alte localStorage-Daten werden bei einer Migration nicht automatisch gelöscht.

Ein durch einen noch geöffneten alten App-Tab blockiertes Datenbank-Upgrade wird absichtlich **nicht** auf einen möglicherweise veralteten localStorage-Stand umgeleitet. Die App fordert stattdessen dazu auf, die anderen Tabs/Fenster zu schließen und neu zu laden.

## Backups

Das externe Charakter-Backupformat bleibt Version 8. Export und Import funktionieren weiterhin zwischen iPad/iPhone, Android, Windows und macOS.
