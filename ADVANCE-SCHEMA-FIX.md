# Advance-Schema-Fix

WFRP 1E behandelt ein Advance Scheme als Maximum gegenüber dem Starterprofil, nicht als zusätzlichen Bonus pro Karriere.

Beispiel:

- Starterprofil: A 1
- Erste Karriere: A +1, dieser Advance wurde gekauft -> gekaufte Advances insgesamt: +1, Current ohne andere Modifikatoren: A 2
- Nächste Karriere: A +2 -> es ist nur noch ein weiterer +1-Advance offen
- Nach diesem Kauf: gekaufte Advances insgesamt: +2, Current ohne andere Modifikatoren: A 3
- Ein dritter Kauf ist nicht möglich, solange die aktuelle Karriere kein A +3-Schema bietet.

Die App verwendet nun dieselbe zentrale Berechnung für Buttonstatus und Kaufvorgang. Dadurch kann ein bereits ausgeschöpftes Schema nicht erneut gekauft werden.
