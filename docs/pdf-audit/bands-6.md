# PDF audit: bands-6

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), pages 288–327.
Scope: Poganiacze klanu Moulder, Kult Zarazy klanu Pestilens, Harcownicy klanu Skryre, Zbrojne stado klanu Mors, Łowcze plemię Dzikich Orków, Plemię Leśnych Goblinów, Orkowie & Gobliny, Nocne Gobliny, Załoga Zielonoskórych Kaprów, Jaszczuroludzie z Lustrii.

Method notes:
- I checked costs, counts, both stat rows, mount and vehicle rows, rules, starting gear, equipment lists and prices, exp, skills, nature, army rules, gold, model limits, mercenaries and either/or choices against each band's 4 pages.
- The hero skill tables were read with `pdftotext -layout -fixed 2`. In that mode every ♦ lands on one of six fixed columns (Walki/Strzeleckie/Akademickie/Siłowe/Szybkościowe/Specjalne). Every hero's skills in all 10 bands match the app. Caster skill lists that the page defers to chapter 22 (Kapłan skinków) were left to the magic group.
- The per-band "Lista magicznych przedmiotów" tables are not modelled per band in the app, so they were not compared.
- The PDF's "na jednego X nie mogą przypadać więcej niż N Y" limits were missing from the app. I added them with the existing `unitRatios` mechanism, which `getErrors.js` already uses for Nippon.

## Poganiacze klanu Moulder

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Army | unitRatios | none | Wielki szczur: max 2 per Klanbrat | added |

## Kult Zarazy klanu Pestilens

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Zarazowóz | stats row label | Rydwan | Powóz (values unchanged, rules already list Powóz) | changed |
| Diakon zarazy | equipmentList | Bohaterowie list incl. armour (Lekki/Średni/Ciężki/Hełm) | "dodatkowy oręż" only, no pancerz | decision needed: the earlier audit kept casters' armour options on purpose; the fix would need a separate weapons-only list |

## Harcownicy klanu Skryre

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Drużyna ciężkich broni (Ciężcy list) | equipmentList | has both `Spaczrusznica` [50, special, Choice] and `Spaczrusznica i pawęża` [50, ranged] | only "Spaczrusznica i pawęża 50 zk" | decision needed: duplicate entry removal (the crew-pricing code in WeaponList.js keys on "Spaczrusznica") |
| Drużyna ciężkich broni | unit | separate helper profile (60 zk, 0–2) | crew is formed from Harcownik via rule DRUŻYNA CIĘŻKICH BRONI | decision needed: intentional helper crew profile, left as is |

## Zbrojne stado klanu Mors

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wóz bojowy | stats row label | Rydwan | Powóz (values unchanged) | changed |
| Army | unitRatios | none | Wielki szczur: max 2 per Klanbrat | added |

## Łowcze plemię Dzikich Orków

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Burszuj dzikich orków | startingEquipment | [] | sztylet + (rembak lub łuk) | changed → ["Sztylet"] |
| Burszuj dzikich orków | equipmentList | Bohaterowie | same items, with Rembak and Łuk tagged `Startowy` (first one free, one required) | added list `heroEquipment["Łowcze plemię Dzikich Orków"].Burszuj` |
| Army | unitRatios | none | Leśny goblin ≤ 2 per Dziki ork; Snotling ≤ 2 per Leśny goblin; Pajonk ≤ Leśny goblin | added (note: "Duże Dźgacze" crew models are not counted as Dziki ork) |
| Herszt Dzikich Orków | name (casing) | Herszt Dzikich Orków | herszt dzikich orków | decision needed: rename (casing only, affects saves) |
| Wielki Pajonk | name (casing) | Wielki Pajonk | wielki pajonk (Leśne Gobliny app uses "Wielki pajonk") | decision needed: rename (casing only, affects saves and the ArmyChoices entry) |
| Duże Dźgacze | unit | helper crew profile (100 zk, 0–2) | crew is formed from Dziki ork via DRUŻYNA CIĘŻKICH BRONI (duża dźgacz 30 zk) | decision needed: intentional helper crew profile, left as is |

## Plemię Leśnych Goblinów

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Army | unitRatios | none | Snotling ≤ 2 per Leśny goblin; Pajonk ≤ 2 per Leśny goblin | added |

## Orkowie & Gobliny

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Burszuj orków | startingEquipment | [] | sztylet + (rembak lub łuk) | changed → ["Sztylet"] |
| Burszuj orków | equipmentList | Bohaterowie | same items, with Rembak and Łuk tagged `Startowy` | added list `heroEquipment["Orkowie & Gobliny"].Burszuj` |
| Army | unitRatios | none | Goblin ≤ 2 per Ork; Snotling ≤ 2 per Goblin; Squig ≤ Goblin | added |

## Nocne Gobliny

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Army | unitRatios | none | Snotling ≤ 2 per Nocny goblin; Squig ≤ Nocny goblin | added |

## Załoga Zielonoskórych Kaprów

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Drużyna ciężkich broni (Ciężcy list) | equipmentList | no Miecz, no Włócznia | Miecz 10 zk, Włócznia 10 zk | added |
| Army | unitRatios | none | Snotling ≤ 2 per Goblin pirat; Squig ≤ Goblin pirat | added |
| Kaper | name | Kaper | heading "KAPER", but the overview and stat table say "GOBLIN KAPER" | decision needed: the PDF contradicts itself; app matches the heading |
| Drużyna ciężkich broni | unit | helper crew profile (30 zk, 0–2) | crew formed from Goblin pirat | decision needed: intentional helper crew profile, left as is |

## Jaszczuroludzie z Lustrii

No differences. Kapłan skinków's gear and skills are deferred to chapter 22 and belong to the magic group.

## Files changed

- `src/Data.js/Armies/Moulder.js`, `Pestilens.js`, `Mors.js`, `DzikieOrki.js`, `LeśneGobliny.js`, `Orkowie.js`, `NocneGobliny.js`, `Kapry.js`
- `src/Data.js/HeroEquipment.js`: new `Burszuj` lists for Dzikie Orki and Orkowie & Gobliny; Miecz and Włócznia added to the Kapry `Ciężcy` list.

Tests: `CI=true npx react-scripts test --watchAll=false` → Test Suites: 5 passed, 5 total; Tests: 188 passed, 188 total. No tests needed updating.
