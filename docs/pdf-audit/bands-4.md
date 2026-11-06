# PDF audit: bands-4

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), pages 204–247.
Fields checked for every unit: cost, count, stats (all rows), starting gear, equipment list and prices, rules, exp and skills. Band-level checks covered gold, model limits, nature, army rules, mercenaries and either/or choices.
Skill tables were read from glyph coordinates (pdfjs), because plain text extraction loses the column positions of the ♦ marks.

Summary: 6 changed, 0 added, 11 decision needed.

## Krasnoludowie Chaosu z Zorn Uzkul (pp. 204–207)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wilczy jeździec | equipmentList | `heroEquipment[...].Stronnicy` (Broń wielka, Bagnet, firearms, Średni…) | List "HOBGOBLIN I WILCZY JEŹDZIEC" | changed (now `heroEquipment[...].Hobgoblin`, which matches that list exactly) |
| Hobgoblin | recruitment cap | no limit beyond the model limit | "na jednego wojownika klanowego nie mogą przypadać więcej niż dwa hobgobliny" | changed (added `unitRatios: [{ unit: "Hobgoblin", required: "Wojownik klanowy", ratio: 2 }]`, plus a test in `ArmyData.test.js`) |
| Zagan | equipment | `equipmentList: {}` | "…ale mogą zostać wyekwipowane w kropierz" | decision needed: kropierz is special equipment (ch. 14, 30 zk, Dost. 8), and the app offers it only in Bractwo Rycerskie. Do we add `Kropierz: [30, 3]` to Zagan? |

## Jeźdźcy Wilków (pp. 208–211)

No differences. (The heroes' wolf option, "+55 zk wielki wilk", is already modelled as `Wielki wilk: [55, 3]` in the heroes list. The app's Hobgoblin list matches the PDF STRONNICY list, and the Ogr list from Gang przemytników matches the PDF OGR list.)

## Zwiadowcza kompania z Królestw Ogrów (pp. 212–215)

No differences.
Notes, which are not PDF differences:
- `Zbrojny (Gnoblar)` and `Byk (ogr)` both have `id: 5`. The id is used only for sort order, so I left it unchanged.
- The `Ogniobrzuchy` and `Rzeźnik` lists in `HeroEquipment.js` contain the misspelled key `"Cep bojowcy"`. Those lists are caster gear deferred to ch. 22/23 and belong to the magic group, so I did not touch them.

## Łupieżcza kompania Fimirów (pp. 216–219)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Bagienna Bestia | rules | "Stygmaty nurgla (rój much)" | STYGMATY NURGLA (rój much) | changed (fixed casing to "Stygmaty Nurgla (rój much)", as everywhere else in the app) |

## Kult Ducha Chaosu (pp. 220–223)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wtajemniczony | equipmentList | Bohaterowie list including armour (Lekki, Średni, Zbroja Chaosu, Puklerz, Tarcza, Hełm) | "może wyposażyć postać w dodatkowy oręż z LISTY EKWIPUNKU" (weapons only, no "i pancerz") | decision needed: a weapons-only rule for casters; the earlier audit deliberately keeps casters' armour options |

## Kult Karmazynowej Czaszki (pp. 224–227)

No differences.

## Kult Dzieci Zagłady (pp. 228–231)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wtajemniczony | equipmentList | Bohaterowie list including armour | "dodatkowy oręż" only | decision needed (same as Kult Ducha Chaosu) |

## Kult Sybarytów (pp. 232–235)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Army | armyRules | "Znak chaosu (wyznawcy slaanesha)" | ZNAK CHAOSU (WYZNAWCY SLAANESHA) | changed (fixed casing to "Znak Chaosu (Wyznawcy Slaanesha)", matching the other cults) |
| Wtajemniczony | equipmentList | Bohaterowie list including armour | "dodatkowy oręż" only | decision needed (same as Kult Ducha Chaosu) |

## Kult Purpurowej Dłoni (pp. 236–239)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wtajemniczony | equipmentList | Bohaterowie list including armour | "dodatkowy oręż" only | decision needed (same as Kult Ducha Chaosu) |

## Grasanci Chaosu (pp. 240–243)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Troll Chaosu | rules | "Żywiołak chaosu" | ŻYWIOŁAK CHAOSU | changed (fixed casing to "Żywiołak Chaosu") |
| Czarnoksiężnik Chaosu | equipmentList | Bohaterowie list including armour | "dodatkowy oręż" only | decision needed (same as Kult Ducha Chaosu) |
| Grasant Chaosu | equipmentList | Stronnicy list including armour (Lekki, Średni, Tarcza, Hełm) | "może wyposażyć stronnika w dodatkowy oręż z LISTY EKWIPUNKU" (no "i pancerz") | decision needed: a deliberate no-armour rule or an omission? Berserk does not forbid armour |
| Troll Chaosu | stats (Maksymalna A) | 4 (same as PDF) | 4 here, but 3 for Troll Chaosu in every other band | decision needed: the PDF contradicts itself. The app matches this page and was left unchanged |

## Karnawał Chaosu (pp. 244–247)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Mistrz karnawału | rules | Czarnoksięstwo, Dowódca, Mag (Dziedzina Chaosu), Stygmat Chaosu | …, STRACHLIWY, … | changed (added "Strachliwy") |
| Furia Chaosu / Piekielny ogar / Nurgling / Bólożądna pieszczota / Różowy strachulec | recruitment condition | one of the five, freely (ArmyChoices) | each is tied to the chosen Znak Chaosu ("tylko Niewolnicy Ciemności", "tylko Wojownicy Khorna", "tylko Potworny lud Nurgla", "tylko Wyznawcy Slaanesha", "tylko Uczniowie Tzeentcha") | decision needed: the app models this differently, because it has no Znak Chaosu selection |
| Troll Chaosu | stats (Maksymalna A) | 4 (same as PDF) | 4 here, 3 elsewhere | decision needed: the PDF contradicts itself (as in Grasanci) |
| `heroEquipment["Karnawał Chaosu"].Ogr` | equipment list | an unused Ogr list (it also has the misspelled `"Cep bojowcy"`) | the band has no Ogr | decision needed: remove the unused list? |

## Not recorded (per brief rule 3)

- Bólożądna pieszczota: the PDF says "STYGMAT SLAANESHA (…)" on both pages, while the app has "Stygmaty Slaanesha (…)". This is a spelling-only difference, and the rule texts belong to the rules-text agent.

## Files changed

- `src/Data.js/Armies/KrasnoludyChaosu.js`
- `src/Data.js/Armies/Fimirowie.js`
- `src/Data.js/Armies/Sybaryci.js`
- `src/Data.js/Armies/Grasanci.js`
- `src/Data.js/Armies/Karnawał.js`
- `src/Data.js/ArmyData.test.js`: added the test "Zorn Uzkul allows at most two hobgoblins per clan warrior".

Test run: `CI=true npx react-scripts test --watchAll=false` gives Test Suites: 5 passed, 5 total; Tests: 188 passed, 188 total.
