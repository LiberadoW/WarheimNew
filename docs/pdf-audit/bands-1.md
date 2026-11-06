# PDF audit: bands-1

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), band pages 64–111.

Scope: each band's own 4 PDF pages. I compared the overview (gold, model limits, nature, army rules, caps, either/or choices, hired swords, starting exp), every unit profile (cap, cost, both stat rows, mount/vehicle rows, starting gear, rules), the skill tables and the equipment lists. Priest and mage gear, and the skills that the band page defers to chapters 22/23, are left to the magic group. Army-specific "UMIEJĘTNOŚCI SPECJALNE" are not modelled in the data, so I didn't compare them.

Skill tables: `pdftotext -layout` shifts the diamond columns, which can put a diamond under the wrong column. I re-read every table with `-lineprinter` and mapped each ♦ to its header column by character position. Every bands-1 hero skill set matches the app.

Hired-sword names, unit-name casing (`Strażnik Miejski`, `Wybrany Syn`) and armour aliases (Lekki/Średni/Ciężki) differ only in spelling or casing, so per the brief they aren't listed.

## Bractwo Rycerskie

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Flagelant | rules | Fanatyk, Furia | FANATYK, FURIA, MĘCZENNIK | changed |
| Półgryfon | rules | (no Dzikie squigi) | includes DZIKIE SQUIGI | decision needed: the owner removed it in the PR #5 review (`army-data-audit.md`), but the new PDF still prints it |
| Machines heading | either/or | Bitewny ołtarz albo Rydwan | the overview and unit header say "BITEWNY OŁTARZ albo RYDWAN", but the machines section heading on p.67 says "ZAPRZĘG albo RYDWAN" | decision needed: the PDF contradicts itself (there is no Zaprzęg profile). App unchanged |

## Cyrkowcy z Ligii Ostermarku

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Mecenas | rules | Dowódca | DOWÓDCA, STRACHLIWY | changed |
| Cyrkowiec | number | 7 | overview: any number up to 15. Profile: 0-7 | decision needed: the owner already confirmed cap 7. The PDF still contradicts itself. App unchanged |

## Gang przemytników

No differences.

## Łowcy czarownic

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Flagelant | rules | Fanatyk, Furia | FANATYK, FURIA, MĘCZENNIK | changed |
| Inkwizytor | equipmentList | band Bohaterowie list (`heroEquipment["Łowcy czarownic"].Bohaterowie`) | "oręż i pancerz odpowiedni dla Prezbitera Sigmara (zobacz paragraf PREZBITER SIGMARA w ROZDZIALE 23)" | decision needed: re-checked on p.81 and still printed this way. Switching to the Prezbiter list would drop the Kusza, pistols, Mizerykordia and Kadzielnica ognia. Known open item |

## Muszkieterzy z Nuln

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Magister Magii | equipmentList (colleges) | all 8 Tradycje | "MAGISTER MAGII (KOLEGIUM METALU albo OGNIA)", and the overview says the same | changed: now only Tradycja Metalu and Tradycja Ognia, the same way Middenheim models its Metal/Niebios restriction |
| Wóz bojowy, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" below |

## Piechota Morska z Marienburga

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Rydwan | id | 11 (same as Zaprzęg) | – | changed: now 12. IDs must be unique within a band. The id only sets the sort order |
| Bukanier | number | 5 | overview: "maksymalnie trzech Przepatrywaczy albo trzech Bukanierów". Profile: 0-5 | decision needed: the PDF contradicts itself. App keeps 5 |
| Zaprzęg, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" |

## Gladiatorzy z Jałowej Krainy

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Mecenas | rules | Dowódca, Handlarz niewolników | DOWÓDCA, HANDLARZ NIEWOLNIKÓW, STRACHLIWY | changed |
| Więźniarka, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" |

## Siostry Sigmara

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Pokutnica | rules | Fanatyk, Furia, Nienawiść | FANATYK, FURIA, MĘCZENNIK, NIENAWIŚĆ | changed |
| Rydwan | stats row label | `Powóz` (5/5/8) | `Rydwan` (5/5/8) | changed: values unchanged. The altar test only checks units named Bitewny ołtarz |
| Bitewny ołtarz, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" |

## Strażnicy dróg z Averlandu

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Zaprzęg, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" |

Otherwise no differences. The PDF has no band-level ZASADY SPECJALNE, and the app's `armyRules: []` matches.

## Zbrojna kompania z Ostlandu

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Więźniarka, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" |

Otherwise no differences.

## Zbrojni z Middenheim

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Pierworodny | rules | Dowódca | DOWÓDCA, ZA MNĄ! | changed: the rule text already exists in SiteRules |
| Zaprzęg, Rydwan | stat row labels | `Koń`, `Koń ` | Koń bojowy | decision needed: see "Machine horse labels" |

Kapłan Ulryka's starting młot bojowy matches this band page, which agrees with the owner's earlier decision.

## Machine horse labels (cross-band)

The draught-horse rows of machines are named `Koń` / `Koń ` in 15 band files across several audit groups. The PDF and the newer bands use `Koń bojowy` / `Koń bojowy `. Only the row label differs; the values (8/3/0/3/–/–/3/1/5) match. I didn't rename them in only my bands, because that would make the label inconsistent across the app. Decision needed: rename app-wide or keep.

## Follow-ups outside my scope

- **Męczennik**: this new rule (chapter 8, p.44) is now on 3 bands-1 units, but it has no text in `SiteRules.js`, `Rules.js` or `RulebookRules.js`, so `getRuleText` returns "" for it. It needs adding by whoever owns the rule texts. The rule also refers to ŻYWY ŚWIĘTY, which has no text either.
- Mage and priest skill lists and gear for Magister Magii, Czarownik and the priests are left to the magic group. Several Magister Magii entries have `skills: []` (Nuln, Averland, Ostland, Middenheim).

## Tests

`CI=true npx react-scripts test --watchAll=false`: 5 suites and 187 tests passed. No test changes were needed.
