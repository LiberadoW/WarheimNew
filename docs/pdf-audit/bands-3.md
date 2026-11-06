# PDF audit: bands-3

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), PDF pages 164–203.
I checked costs, caps, stats (including mount and vehicle rows), rules, starting gear, equipment lists and prices, exp, skill tables, band gold, model limits, nature, army rules, mercenaries and either/or choices.
I read the skill tables from a fixed-pitch re-extraction (`pdftotext -layout -fixed 2`), because the plain text loses the diamond columns.
Out of scope: the caster equipment and skill lists that the band pages defer to chapter 22 (magic group). Per-band magic item lists are also out of scope, because the app does not model them.

Unit-name differences that are only capitalisation are not recorded (the PDF prints names in caps). Examples: Wieczny Strażnik, Srebrny Hełm, Biały Lew, Kowal Run, Pogromca Trolli, Rumak Elfów.

Summary: 7 changed, 1 added, 6 decision needed.

## Niziołki z Krainy Zgromadzenia (pp. 164–167)

No differences.

## Leśni Elfowie z Athel Loren (pp. 168–171)

No differences.

## Elfowie Wysokiego Rodu z Ulthuanu (pp. 172–175)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Łucznik | name | Łucznik | Wojownik (same slot: 0+, 45 zk, same profile and rules) | decision needed (rename affects saved rosters) |
| Łucznik | startingEquipment | Sztylet, Łuk długi | Sztylet + "miecz lub łuk" | changed: starting gear is now Sztylet. The unit got its own list: band Stronnicy list with Miecz [10,0,"Startowy"] and Łuk [10,1,"Startowy"], so the first pick is free and at least one is required |

## Konwent magów Wieży Hoeth (pp. 176–179)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Łucznik | name | Łucznik | Wojownik (same slot: 0+, 45 zk, same profile and rules) | decision needed (rename affects saved rosters) |
| Łucznik | startingEquipment | Sztylet, Łuk długi | Sztylet + "miecz lub łuk" | changed: starting gear is now Sztylet. Miecz and Łuk are tagged "Startowy" (first pick free, at least one required) |
| Mistrz miecza Hoeth | equipmentList: Pancerz z Ithilmaru | [50, 2] (no group tag) | Pancerz z Ithilmaru 50 zk (body armour) | changed: added the "Zbroja" group tag so it is mutually exclusive with Lekki/Średni/Ciężki, as in the other elf bands |

## Mroczni Elfowie z Naggaroth (pp. 180–183)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Mroczny pegaz | equipmentList | {} | "...ale mogą zostać wyekwipowane w kropierz" | added: Kropierz [30, 3] (30 zk per ch. 14, same as the Graal Pegaz) |
| Korsarz | startingEquipment | Płaszcz z łusek morskiego smoka | płaszcz z łusek smoka | decision needed (item rename; the PDF uses both names: the ch. 14 price table says "morskiego smoka", while the item heading and index say "z łusek smoka") |

## Bestiobójcy z Kraka Drak (pp. 184–187)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Pawężnik | rules | (no Pawężnik) | ... ODPORNOŚĆ NA MAGIĘ (2), PAWĘŻNIK, RANKOR ... | changed: added "Pawężnik" |
| Oblężnik z Kraka Drak | rules | (no Pawężnik) | ... NA MAGIĘ (2), PAWĘŻNIK, RANGER ... | changed: added "Pawężnik" |
| Łowczy | startingEquipment | Płaszcz z łusek morskiego smoka | płaszcz z łusek smoka | decision needed (same item-name question as Korsarz) |

Note: the army rule is printed as PODATKI. The app keeps Podatek per the owner's earlier decision, so this is not a new difference.

## Khazadzi z Gór Krańca Świata (pp. 188–191)

No differences.

## Kompania krasnoludzkich Piwowarów (pp. 192–195)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Krasnoludzki ranger | number | 5 | Overview: "maksymalnie trzema"; detailed profile: 0-5 | decision needed (PDF contradicts itself; app matches the detailed profile) |
| Powóz piwny | stats row label | Powóz: –/–/–/5/5/8 | Rydwan – – – 5 5 8 (unit has the RYDWAN rule) | changed: row key renamed to Rydwan, values unchanged |

## Kult Pogromców z Karak Kadrin (pp. 196–199)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Pogromca trolli | equipmentList | Hero weapons without armour: Broń wielka, Buława/Maczuga/Młot bojowy, Cep bojowy, Sztylet, Topór bojowy/Nadziak, Topór krasnoludów, Broń miotana (ładunki wybuchowe), Kusza, Muszkiet krasnoludzki, Pistolet dubeltowy, Pistolet pojedynkowy | STRONNICY list: Broń wielka, Buława/Maczuga/Młot bojowy, Cep bojowy, Topór bojowy/Nadziak, Topór krasnoludów, Broń miotana (ładunki wybuchowe); no armour | decision needed: switching to `heroEquipment["Kult Pogromców z Karak Kadrin"].Stronnicy` (which already matches the PDF) would remove Sztylet, Kusza, Muszkiet krasnoludzki, Pistolet dubeltowy and Pistolet pojedynkowy. That is an item removal, and the current table came from the earlier slayer-equipment decision in `army-data-audit.md` |

## Szkutnicy z Barak Varr (pp. 200–203)

No differences.

## Tests

`CI=true npx react-scripts test --watchAll=false`: 5 suites passed, 188 of 188 tests passed. No test changes were needed.
