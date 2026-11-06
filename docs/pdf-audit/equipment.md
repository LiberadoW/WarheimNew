# PDF audit: equipment (ROZDZIAŁ 14 Ekwipunek, 14b Magiczne przedmioty)

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15), PDF pages 426–448 (ch. 14) and 449+ (magic items).
Files touched: `src/Data.js/EquipmentStats.js`, `src/Data.js/Items.js`, `src/Functions/getItemText.js`.
No band list, `WeaponList.js` or `equipmentSelection.js` was changed.

How the UI uses these files: `WeaponList` shows the `EquipmentStats` profile when one exists and falls back to `getItemText` / `Items.js` only for names without a profile. Rules in a profile's `rules` string are split on `,`/`;` and a `prefix:` is stripped, so text like `walka wręcz: broń ręczna, ogłuszający` adds known rules (Broń ręczna, Ogłuszający) to the printed rules appendix and ignores the rest.

## Earlier doubts, settled

| Unit/item | Field | App (old) | PDF | Status |
|---|---|---|---|---|
| Pika | rules | drzewcowa, uderza jako pierwszy, zasięgowa (tylko piechota) | The ZASADY line (p. 429) says `drzewcowa, uderza jako pierwszy, zasięgowa`. The body text says `DRZEWCOWA, WYMAGA OBU RĄK, ZASIĘGOWA`, gives *uderza jako pierwszy* only when holding against a charge (trzymać pozycję) by DUŻY CEL/POTWÓR/WIELKOLUD, and lets a second-rank pike fight | decision needed: the PDF contradicts itself (summary line vs body). The profile stays as the ZASADY line; the Items text records the body rules |
| Muszkiet dubeltowy | price | 40 zk (Muszkieterzy z Nuln lists) | price table p. 432: 35 zk / 11; entry p. 433: CENA 40 zk / 11 | decision needed: the PDF contradicts itself. The band list was not touched |
| Bagnet | rules | drzewcowa, ogłuszający, parowanie, uderza jako pierwszy, wymaga obu rąk, zasięgowa | same | No difference |
| Duża dźgacz | rules | drzewcowa, limitowany (1), uderza jako pierwszy, zasięgowa, bycza szarża | The ZASADY line has no *bycza szarża*. The body says a charging team gets BYCZA SZARŻA and that every unsaved wound costs K3 ŻW. Only for models with the DUŻA DŹGACZ rule | Kept *bycza szarża* (the body supports it) |
| Duża dźgacz | strength | +2 w czasie szarży | +2 w czasie szarży, each unsaved wound costs K3 ŻW | changed → `+2 w czasie szarży (Obrażenia K3)` |

## Foot and mounted profiles (how the PDF splits them)

| Weapon | PDF split | App |
|---|---|---|
| Włócznia | Two entries. **Piechota**: drzewcowa, uderza jako pierwszy, zasięgowa. **Kawaleria** (all cavalry, monster riders and chariot crews): premia +1 do SIŁY w czasie szarży, drzewcowa, uderza jako pierwszy, zasięgowa. 10 zk, Powszechna | One profile: strength `Użytkownika (kawaleria: +1 w czasie szarży)`, which matches. In `getItemText` the special case (3 stats rows = mounted/vehicle) was **kept**. Its texts lacked *zasięgowa*, so the status is **changed**; it is also null-safe now |
| Kopia | Only "(tylko kawaleria)" | `zasięgowa (tylko kawaleria)`, which matches |
| Pika | Only "(tylko piechota)" | `zasięgowa (tylko piechota)`, which matches |
| Walka dwoma broniami ręcznymi / bronią ręczną & tarczą | Only for PIESZY models (general rule, p. 427) | Not modelled per weapon. No change |
| Pistolety / muszkiety in melee | The PDF gives a melee use (p. 429): pistols = `broń ręczna, ogłuszający`; muskets & spaczmuszkiet = `drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa` | Added to the profiles (see below) |

## EquipmentStats.js (profiles)

| Unit/item | Field | App (old) | PDF | Status |
|---|---|---|---|---|
| Mizerykordia | rules | "" (empty) | MIZERYKORDIA/WAKIZASHI share one entry: broń ręczna, lekki, wyważony | changed |
| Wakizashi / Mizerykordia | rules | Wakizashi: broń ręczna, **cios łaski**, lekki, wyważony | ZASADY line: broń ręczna, lekki, wyważony. The body: "Wakizashi posiada … BROŃ RĘCZNA, CIOS ŁASKI, LEKKI oraz WYWAŻONY" | decision needed: the PDF contradicts itself on *cios łaski*, and it's unclear whether it also applies to Mizerykordia. Wakizashi keeps it; Mizerykordia gets only the common rules |
| Kostur Rykowca | rules | styl defensywny … +2 do Ochrony Pancerza | … +2 do Ochrony Pancerza **lub Ochrona Pancerza 5+ bez pancerza** | changed |
| Saearath | rules | styl ofensywny: drzewcowa, uderza jako pierwszy, wymaga obu rąk, zasięgowa; styl defensywny: … +2 do OP | The offensive style also means the model fights as if it had two hand weapons; defensive +2 to OP **or 5+** without armour | changed |
| Halabarda | rules | drzewcowa, wymaga obu rąk, zasięgowa | Also: with a black-powder weapon, ignores WYMAGA FORKIETU and gets PEWNY STRZAŁ | changed (`; z bronią prochową: pewny strzał, ignoruje wymaga forkietu`) |
| Spaczhalabarda | rules | … zasięgowa | Same forkiet/pewny strzał clause | changed |
| Pistolet, Pistolet dubeltowy, Pistolet pojedynkowy, Spaczpistolet | rules | shooting rules only | In melee: uznawany za broń ręczną, ogłuszający | changed (×4, `; walka wręcz: broń ręczna, ogłuszający`) |
| Muszkiet, Muszkiet dubeltowy, Muszkiet hochlandzki, Muszkiet krasnoludzki, Spaczmuszkiet | rules | shooting rules only | In melee: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa | changed (×5) |
| Zbroja Chaosu | rules | ignoruje efekty ciężkiego pancerza; mag może rzucać zaklęcia | Also: can't be taken off (not even by GRABIEŻ/OGRABIONY); CP test after each game, a failure means a Stygmat; only for 7 Chaos bands | changed (`; nie można jej zdjąć`, full text in Items) |
| Tarcza | rules | bez OP w walce wręcz z bronią wymagającą obu rąk | Also: a model with a shield can't use the puklerz's PAROWANIE | changed |
| Buława, Młot bojowy | (new key) | none (used as starting equipment in `Mercenaries.js`) | = BUŁAWA/MACZUGA/MŁOT BOJOWY | added (alias profile) |
| Ładunki wybuchowe | (new key) | none (used in `Mercenaries.js`) | = Broń miotana – ładunki wybuchowe, 8", K6 | added (alias profile) |
| Łuk długi, Łuk elfów, Arkebuz, muszkiety | strength | split by range (3/4, 5/6, 4/5) | The ZASADY lines give only the long-range value; the body gives both | No change (the app follows the body) |
| Broń miotana (topory/młoty) | strength | Użytkownika +1 | SIŁA: użytkownika; ZASADY: broń miotana, premia +1 do SIŁY | No change (same meaning) |
| all other weapons and armour | range/strength/rules/armour | | match ch. 14 | No differences |

## Items.js (descriptions)

The file was rewritten from the PDF ZASADY lines. Most weapon texts are hidden in the UI behind the profile, but they now match the PDF.

| Unit/item | Field | App (old) | PDF | Status |
|---|---|---|---|---|
| Bicz, Bosak, Halabarda, Kopia, Kostur, Łapacz, Pika, Trójząb, Duża dźgacz | text | no *zasięgowa* | zasięgowa | changed |
| Saerath (key) | key | `Saerath` (typo; the app uses `Saearath`) | Saearath | changed (key fixed; text adds the dual-weapon and 5+ clauses) |
| Kostur Rykowca | text | "dostępny wyłącznie dla … Szamanów"; no 5+ in the offensive clause | for MAGÓW in the Zbrojne stado Zwierzoludzi; defensive +2 or 5+ | changed |
| Kadzielnica ognia / zarazy | text | profile only | also: if the model is Oszołomiony!/Powalony/Wyłączony, the weapon goes out and counts as a cep bojowy | changed |
| Broń miotana (młoty/topory) | text | S użytkownika +1 | S użytkownika; broń miotana, premia +1 do SIŁY | changed |
| Dmuchawka | text | "skrytobójczy" | mistrz skrytobójstwa | changed |
| Harpun | text | "2x - wymaga przygotowania" | wymaga przygotowania (2); only for WIELKOLUD / DRUŻYNA CIĘŻKICH BRONI | changed |
| Łuk długi, Łuk elfów | text | SIŁA 3 (Łuk elfów 3/4) | 3 daleki / 4 krótki | changed |
| Pistolet strzałkowy | text | no broń miotana | bezpośredni strzał, broń miotana, może zawsze stać & strzelać | changed |
| Arkebuz | text | SIŁA 5 | 5 daleki / 6 krótki | changed |
| Broń miotana (ładunki wybuchowe) | range | 6" | 8" | changed |
| Miotacz spaczognia | rules | limitowany (1), płonący atak, **przebicie pancerza** | eksperymentalny, limitowany (1), płonący atak (hits ignore OP) | changed |
| Muszkiet, Muszkiet dubeltowy, Muszkiet krasnoludzki, Spaczmuszkiet | text | SIŁA 4 / K6 | 4/5 (K6 / K6 druzgoczący); plus melee use | changed |
| Muszkiet hochlandzki | text | no mistrzowskie wykonanie | mistrzowskie wykonanie | changed |
| Pistolet, Pistolet dubeltowy, Pistolet pojedynkowy, Spaczpistolet | text | no broń miotana (Pistolet dubeltowy, Pistolet) | broń miotana; melee use | changed |
| Spaczrusznica | text | SIŁA K6 | K6 without OP; a two-model team with a pawęża | changed |
| Kropierz | text | only the POTWÓR clause | non-monster mount: +1 OP or 6+, no LEKKA JAZDA/RANGER, przebicie pancerza when charging; POTWÓR: +2 or 5+; mount +1 S to TRAFIENIE Z UDERZENIA, przebicie pancerza, uderza jako ostatni | changed |
| Tarcza, Puklerz | text | basic | two-handed weapon / shield–puklerz exclusions | changed |
| Pancerz z Gromrilu | text | no AP clause | PRZEBICIE PANCERZA doesn't apply | changed |
| Zbroja Chaosu | text | no permanence or stigmata | can't be taken off; CP test → Stygmat | changed |
| Lekki / Średni / Ciężki | text | | names the PDF armour (skórzany/ćwiekowany, kolczy/łuskowa, płytowa) | changed |
| Mizerykordia, Bagnet, Pancerz z Ithilmaru | text | missing | PDF ZASADY | added |
| Broń improwizowana (22 starting lists) | text | missing | ch. 14 p. 427: melee lekki, uderza jako ostatni; ranged 6", S użytkownika, broń miotana, lekki | added |
| Pawęż (Psy Wojny) | text | missing | PAWĘŻA p. 439 | added |
| Siodło & uprząż (37 lists) | text | missing | +1 to the jeździectwo test | added |
| Mechaniczne skrzydła | text | missing | LOT, limitowany (3), 4 bands | added |
| Płaszcz z łusek morskiego smoka / Płaszcz z łusek smoka | text | missing | p. 439 | added (both names) |
| Płaszcz z wilczej skóry, Płaszcz ze skóry lwa | text | missing | p. 439 | added |
| Koń bojowy, Kuc, Dzik, Jaskiniowy squig, Nieumarły koń, Obmierzły pajonk, Rumak, Rumak chaosu, Rumak elfów, Rumak Elfów, Terradon, Wielki wilk, Zimnokrwisty | text | missing | ZWIERZĘTA p. 444–446: profile + special rules (+ Twarda skóra where given) | added (13) |
| Broń naturalna and its 8 variants (drzewcowa, płonący atak, precyzyjne uderzenie, przebicie pancerza, szybki, wspinaczka, zabójczy cios, zatruty atak) | text | missing | ch. 8 BROŃ NATURALNA (X) | added (9) |
| Kula na łańcuchu (Gobliński fanatyk) | text | missing | band page + ch. 8 GOBLIŃSKI FANATYK | added |
| Spaczostrza | text | missing | ch. 8 SPACZOSTRZA | added |
| Wybuchowe zarodniki | text | missing | ch. 8 WYBUCHOWE ZARODNIKI | added |
| Kaganek, Latarnia sztormowa, Luneta, Karty Tarota, Bat (starting gear in `Mercenaries.js`) | text | missing | p. 438–439 | added (5) |
| Cnota doskonałości/dyscypliny/męstwa/pobożności/wiary/wyszkolenia (Rycerze Graala list) | text | missing | **not in the PDF at all** | decision needed: no PDF source, so no description added (band agent's call: keep or drop) |
| Dziedzina … / Tradycja Śmierci, Tradycja Światła (cat. 4) | text | missing | magic schools | Out of scope (magic agent) |

## Name check: band-list names with no chapter 14 match

| Unit/item | Field | App (old) | PDF | Status |
|---|---|---|---|---|
| Cep bojowcy (3 lists) | name | `Cep bojowcy` (it has an alias profile) | Cep bojowy | decision needed: typo; renaming affects saved rosters |
| Pawęż (Psy Wojny starting equipment) | name | `Pawęż` | Pawęża | decision needed: typo |
| Płaszcz z łusek morskiego smoka (Mroczni Elfowie Korsarz, Bestiobójcy z Kraka Drak Łowczy, `getPrestige.js`) | name | `Płaszcz z łusek morskiego smoka` | **Settled: the PDF name is "Płaszcz z łusek smoka".** That is the entry heading and body (p. 439), both band pages (Kraka Drak Łowczy, Mroczni Elfowie) and the SMOKOBÓJCA rule. Only the price table on p. 438 says "morskiego smoka" | decision needed: rename to `Płaszcz z łusek smoka` (with a RulebookNames translation and the getPrestige key). Items.js already describes both names |
| Broń miotana (8 uses incl. mage lists) | name | generic `Broń miotana` (= knives profile) | ch. 14 only has Gwiazdki/Noże (10 zk) and Młoty/Topory (15 zk) | decision needed: ambiguous name, priced as Gwiazdki/Noże |
| Pisolet (`Mercenaries.js`) | name | `Pisolet` | Pistolet | decision needed: typo in the mercenary data (not my file) |
| Kula na łańcuchu, Spaczostrza, Wybuchowe zarodniki, Broń naturalna (…) | name | | Not ch. 14 items; defined in ch. 8 / band pages | No change (descriptions added) |
| Broń Wielka, Kadzielnica Ognia, Rumak Elfów | name | casing variants | | No change (case only, rule 3) |

## Prices that differ from ch. 14 (band lists not changed)

Armour doubled for WIELKOLUD models (Ogr, Minotaur, Ushabti, Kroxigor; the Ogrów band's Lekki 10, Średni 30, Ciężki 60) matches "Pancerz dla WIELKOLUDA: koszt ×2" and is not listed.

| Unit/item | Field | App (old) | PDF | Status |
|---|---|---|---|---|
| Broń miotana (noże) | price | 15 zk (Kupiecka karawana z Arabii: Bohaterowie, Stronnicy) | Gwiazdki/Noże 10 zk | decision needed (band agent; check the band page) |
| Korbacz | price | 10 zk (Rycerze Graala: Zbrojny; Nekrarch: Bohaterowie; Liczmistrz: Bohaterowie) | 5 zk | decision needed (band agent) |
| Średni | price | 20 zk (Gang przemytników: Rozbójnik; Muszkieterzy z Nuln: Ranger; Averland: Rajtar; Raubritterzy: Rozbójnik) | 15 zk | decision needed (band agent) |
| Muszkiet dubeltowy | price | 40 zk (Muszkieterzy z Nuln) | 35 (table) / 40 (entry) | decision needed (the PDF contradicts itself) |
| Rumak | price | 55 zk (Rycerze Graala: Bohaterowie, Rycerz) | 65+2K6 zk, dostępność 7 (table: 9) | decision needed (band agent) |
| Wielki wilk | price | 55 zk (Jeźdźcy Wilków: Bohaterowie) | 65+2K6 zk, dostępność 9 | decision needed (band agent) |

The app stores no rarity (dostępność), so rarity can't be compared. These spots in ch. 14 contradict themselves (table vs entry) and would matter if rarity is ever added: Spaczhalabarda 11/12, Dzik 9/8, Lew bojowy 11/8, Rumak 9/7, Klucz nastawny 8/6, Fluid węża morskiego 8/9, Płaszcz elfów 12/8, Stanowisko strzeleckie 25+K6/25+2K6, and Krasnoludzki proch (tools table 10 zk/11 vs ammo entry 5+2K6/10).

## 14b Magiczne przedmioty

No magic, runic or mechanical item from ch. 14b appears in any band equipment list, mage list or band starting equipment, and the app holds no magic item data. Nothing to compare. No differences.

## Tests

`CI=true npx react-scripts test --watchAll=false`: 5 suites, 188 tests passed.
