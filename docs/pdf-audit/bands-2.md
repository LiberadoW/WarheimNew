# PDF audit: bands-2

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), pages 112–159.
Checked per band: cost, cap, all stat rows, rules, starting gear, every equipment list (item and price), exp, skill tables, band gold/limits/nature/rules, hired swords and either/or choices. Costs, caps and stat rows were also compared by script against the PDF text. Skill tables were re-read in `-table` and `-lineprinter` modes.
Caster gear and skills that the band page defers to chapters 22 and 23 were left to the magic group.

Totals: **changed 7, added 3, decision needed 11**.

## Żołnierze z Reiklandu

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Flagelant | rules | Fanatyk, Furia | Fanatyk, Furia, Męczennik | added |
| Rydwan | stats (Rydwan Żw) | 8 | 4 | decision needed: the owner decided Żw8 (army-data-audit.md) |

## Rycerze Graala

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Rycerz Graala | rules | Dowódca, Duży cel (wierzchem), Kawalerzysta, Konny, Towarzysz Graala | + Niezłomny | added |
| Rycerz Graala (list `Rycerz`) | equipmentList | no Mizerykordia | Mizerykordia 5 zk (BOHATEROWIE list) | added |
| Panna Graala | equipmentList | only the 3 traditions + Rumak | "oręż i pancerz z LISTY EKWIPUNKU drużyny": now BOHATEROWIE list (incl. Rumak 55) + the 3 traditions | changed |
| Pegaz | equipmentList | {} | "może zostać wyekwipowane w kropierz": Kropierz 30 zk (price from ch. 14) | changed |
| Zbrojny (list `Zbrojny`) | Korbacz price | 10 | 5 | changed |
| Zbrojny | name | Zbrojny | ZBROJNY GRAALA (stat table header says ZBROJNY) | decision needed: rename; the owner had chosen "Zbrojny" |
| Rycerz Graala | Towarzysz Graala / PRZYMIOT choices | Cnota doskonałości/dyscypliny/męstwa/pobożności/wiary/wyszkolenia | PRZYMIOT (ch. 8): Dzierzba, Filar, Naczynie Chaosu (tylko MAG), Pobożny, Pogromca, Żniwiarz | decision needed: replacing the item names breaks saved rosters |
| Bitewny ołtarz | stats | Powóz 4/8/8 | Rydwan 5/5/8 (rules still list POWÓZ) | decision needed: the owner decided Powóz 4/8/8 |
| Bitewny ołtarz | name | Bitewny ołtarz | Overview: "RYDWAN GRAALA"; profile: "BITEWNY OŁTARZ" | decision needed: the PDF contradicts itself; app unchanged |

## Zbrojna chorągiew z Kisleva

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Magister Lodu | rules | Mag (Tradycja Lodu) | MAG (Tradycja Magii Lodu) | decision needed: the label feeds lore lookup (magic group); app unchanged |

## Piraci z Sartosy

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Żołnierz Okrętowy | name | Żołnierz Okrętowy | "Żołnierz okrętowy" (body text) | decision needed: casing rename; the owner had chosen "Okrętowy" |

Note (not a PDF difference): Niewolnik and Pirat both have `id: 6`. Not changed because of saved rosters.

## Psy Wojny

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Either/or (ArmyChoices.js) | group | [Lansjer, Ogr, Ptasznik z Catrazzy] | Lansjer is separate (0-3); only "OGR albo PTASZNIK Z CATRAZZY" | changed |
| Oblężnik | name | Oblężnik | OBLĘŻNIK Z REMAS (stat header: OBLĘŻNIK) | decision needed: rename; the owner had chosen "Oblężnik" |

## Raubritterzy z Księstw Granicznych

No differences. (Rozbójnik points at `heroEquipment["Gang przemytników"].Rozbójnik`, which has the same contents as this band's own Rozbójnik list.)

## Emisariusze Smoczego Cesarza

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Strzelec | number | 7 | Overview: "pięciu"; profile: 0-7 | decision needed: the PDF contradicts itself; the owner had chosen 7 |

PDF-internal slips with no app impact: the Kirin stat table is headed "PEGAZ", and the machines header reads "BALON BOJOWY albo RYDWAN" (overview and profile say Bitewny ołtarz). The Nomada's Topór bojowy/Nadziak price is still blank (the owner set 5 zk).

## Klan wojowników z Nipponu

No differences.

## Kupiecka karawana z Arabii

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Wezyr | rules | "Mag(Tradycja Metalu albo Magia Żywiołów)" (missing space, our typo) | MAG (Tradycja Metalu albo Magia Żywiołów) | changed |
| Nomada | starting gear / stats | Koń bojowy 8/3/0/3/–/–/3/1/5 | Rumak elfów 9/3/0/3/3/1/4/1/5 | decision needed: the owner decided on a normal horse |

## Amazonki z Lustrii

No differences. (Walkiria's Oszczep price is still blank in the PDF; the owner set 15 zk.)

## Berserkerzy z Norski

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Bitewny ołtarz | stats | Powóz 4/8/8 | Rydwan 5/5/8 (rules list POWÓZ); machines header "WIĘŹNIARKA albo RYDWAN" vs overview "albo BITEWNY OŁTARZ" | decision needed: the owner decided Powóz 4/8/8 |
| Zniewolony Troll | name | Zniewolony Troll | Zniewolony troll | decision needed: casing rename (also used in ArmyChoices.js) |

## Files touched

- `src/Data.js/Armies/Reikland.js`, `RycerzeGraala.js`, `Arabia.js` (CRLF kept)
- `src/Data.js/HeroEquipment.js`: Rycerze Graala `Rycerz` +Mizerykordia; `Zbrojny` Korbacz 10 → 5
- `src/Data.js/ArmyChoices.js`: Psy Wojny group

No tests needed updating. `CI=true npx react-scripts test --watchAll=false`: 5 suites, 188 tests passed.
