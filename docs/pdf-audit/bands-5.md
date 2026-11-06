# PDF audit: bands-5

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), PDF pages 248-287.
I checked costs, counts, stats (every row), starting gear, rules, exp, skill tables, equipment lists and prices, band gold, model limits, nature, band rules, mercenaries and either/or choices against the app data.

The skill tables were read from the column positions in the PDF (`pdftotext -layout -fixed 2`), not from the flattened text. I did not check what the PDF does not model (Dostępność, base sizes, the special-skill lists, the magic-item lists). Caster lore and caster gear that the PDF sends to chapters 22/23 belong to the magic group (see the notes at the end).

Totals: **15 changed, 1 added, 4 decision needed.**

## Cross-band: vehicle stat-row labels

The PDF labels the vehicle row of Czarna karoca as `Powóz` and the row of every Rydwan/Ścierwowóz as `Rydwan`, as other app bands already do. Several app rows used the vehicle's own name instead, and two Rydwan rows were labelled "Czarna Karoca". The values were unchanged. Only the row label is displayed, and the fixture compares row values by position.

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| von Carstein / Czarna Karoca | stats row label | Czarna Karoca | Powóz | changed |
| von Carstein / Ścierwowóz | stats row label | Ścierwowóz | Rydwan | changed |
| Lahmia / Czarna Karoca | stats row label | Czarna Karoca | Powóz | changed |
| Lahmia / Ścierwowóz | stats row label | Ścierwowóz | Rydwan | changed |
| Krwawy Smok / Rydwan | stats row label | Czarna Karoca | Rydwan | changed |
| Krwawy Smok / Ścierwowóz | stats row label | Ścierwowóz | Rydwan | changed |
| Nekrarch / Czarna karoca | stats row label | Czarna Karoca | Powóz | changed |
| Nekrarch / Ścierwowóz | stats row label | Ścierwowóz | Rydwan | changed |
| Strigos / Czarna karoca | stats row label | Czarna Karoca | Powóz | changed |
| Strigos / Ścierwowóz | stats row label | Ścierwowóz | Rydwan | changed |
| Liczmistrz / Rydwan | stats row label | Czarna Karoca | Rydwan | changed |
| Liczmistrz / Ścierwowóz | stats row label | Ścierwowóz | Rydwan | changed |
| Nehekhara / Rydwan | stats row label | Ścierwowóz | Rydwan | changed |

## Zbrojne stado Zwierzoludzi

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Grabieżcy | name | Grabieżcy | GRABIEŻCA (overview "GRABIEŻCA albo HARPIA", profile "GRABIEŻCA"); the section heading is plural "GRABIEŻCY" | decision needed: rename (affects saved rosters), and the PDF is inconsistent |

Everything else matches, including the Grabieżca/Harpia either/or choice and the skills (Herszt 0,3,4,5; Szaman 0,4,5; Bestigor 0,3,5; Centigor 0,3,5).

## Nieumarła świta hrabiego von Carstein

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Hrabia von Carstein | rules | no Magia Krwi | MAGIA KRWI block (Aura majestatu, Klątwa, Redan, Wezwanie Vanhela) under the profile | changed: added "Magia Krwi", the same way the other four vampire leaders list it |

There are also the row-label changes above. Everything else matches.

## Nieumarły orszak księżnej Lahmi

The only changes are the row labels above. Everything else matches.

## Nieumarły poczet Krwawego Smoka

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Giermek | rules | Przyboczny, Żywa tarcza | OPRYCH, ŻYWA TARCZA (Przyboczny is only a special skill the giermek can learn) | changed |

There are also the row-label changes above. Everything else matches.

## Nieumarły sabat rodu Nekrarch

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Czarna karoca, Ścierwowóz | stats Żw | 8 | 4 | decision needed: the owner already decided Żw8 (army-data-audit.md), and the PDF still prints 4; left at 8 |

There are also the row-label changes above. Everything else matches.

## Nieumarły tabor ludu Strigosu

The only changes are the row labels above. Everything else matches.

## Nieumarła horda Liczmistrza

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Czarny rycerz list (`Rycerz`) | Chopesz | missing | Chopesz 10 zk | added |
| Czarny rycerz list (`Rycerz`) | Miecz | Miecz 10 zk | not listed (Chopesz takes its place; the knight starts with a chopesz) | decision needed: removing an item; kept |

There are also the row-label changes above. Everything else matches. The PDF overview typo "GHOUL albo WIGHT" is ignored.

## Nieumarły zastęp z Nehekhary

The only change is the row label above. Everything else matches. "Książe grobowców" matches the PDF unit heading; the overview spells it "KSIĄŻĘ", which is a PDF inconsistency and was not recorded.

## Eteryczny dwór Króla kurhanów

No differences.

## Zwiadowcze stado klanu Eshin

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wielki szczur | recruitment limit | 0+ (capped only by the 15-model limit) | at most two wielkie szczury for each posłaniec nocy | changed: added `unitRatios: [{ unit: "Wielki szczur", required: "Posłaniec nocy", ratio: 2 }]`, the same mechanism Moulder uses (validated in `getErrors.js`) |

Everything else matches.

## Notes for the magic group (not changed here)

- Zwierzoludzie / Szaman: the PDF says MAG (Dziedzina Chaosu albo Dziedzina Dziczy). The app list offers Dziedzina Dziczy, Chaosu, Nurgla, Slaneesha and Tzeentcha, and `Magic.js` has no "Dziedzina Chaosu" key (it has "Dziedzina Chaosu Niepodzielonego").
- Nehekhara / Licz: the PDF says MAG (Domena Nehekhary albo Tradycja Śmierci albo Tradycja Światła) and gear from the Domena Nehekhary list (chapter 22). The app Licz list has only the Tradycja Światła/Śmierci choices, and `Magic.js` has no Domena Nehekhary.

## Tests

`CI=true npx react-scripts test --watchAll=false`: 5 suites, 187 tests passed. No test changes were needed.
