# Army data audit

Source: the user-supplied `Warheim.docx`, SHA-256 `1f6137e245e787ae1836711a4320682355ed95cfce1b77fc17dd1007d1f8509f`.
Repository baseline: `48b1a008c6d43df3dbd391ea6e23b3561cf6863b` (master after Gang przemytników was merged).

## Coverage

The supplied document contains 63 army lists and 705 recruitment entries. Of these, 704 have explicit stat tables; Bractwo Rycerskie's generic Kapłan refers to seven patrons in chapter 23. The application previously contained 55 armies.

This change adds eight armies with recruitment costs, caps, starting and maximum stats, secondary mount/vehicle profiles, starting gear, purchasable equipment, experience, skills, nature, army rules, eligible hired swords, and exclusive recruitment choices. Bractwo's seven priest choices and two heavy-weapon crews bring the additions to 96 app profiles. The catalog now contains 719 profiles, including seven helper crew profiles and one retired profile kept for old saves; 718 are recruitable.

The existing 55 lists were compared against their corresponding recruitment sections. The audit covers those fields, the chapter 22/23 cross-references needed by their casters/priests, and the equipment tables. Existing stable army and unit identifiers were retained, including historical spellings such as `Dreg` (the document calls this Krwawy Smok retainer `Giermek`). This does not retroactively rewrite the stats or gear inside existing saved rosters.

This is an audit of army recruitment data against this document, not a claim that every campaign rule, combat interaction, existing spell description, or magic-item table has been implemented or independently reconciled. The app remains a roster builder, not a complete rules engine. Army-specific skills remain represented by the existing skill-category system.

## Added armies

| Army | App profiles | Budget | Model limit |
| --- | ---: | ---: | ---: |
| Bractwo Rycerskie | 17 | 600 | 3–12 |
| Emisariusze Smoczego Cesarza | 12 | 500 | 3–15 |
| Klan wojowników z Nipponu | 12 | 500 | 3–15 |
| Berserkerzy z Norski | 13 | 500 | 3–12 |
| Konwent magów Wieży Hoeth | 9 | 500 | 3–12 |
| Bestiobójcy z Kraka Drak | 12 | 500 | 3–12 |
| Łupieżcza kompania Fimirów | 11 | 500 | 3–15 |
| Eteryczny dwór Króla kurhanów | 10 | 500 | 3–12 |

## Data and integration fixes

- Corrected recruitment costs, numeric profiles and caps using each army's detailed profile, with the explicitly documented altar exception below.
- Corrected rule labels and omissions, starting equipment, experience and skill categories. Kept separately described rules such as Konny, Towarzysz Graala, Ślubowanie, Mistrzowie koni and Magia Krwi.
- Reconciled equipment prices and lists, fixed misspelled item keys, connected Tancerz Wojny and Wiedźma Khaina to their dedicated lists, removed prohibited armour from Fanatyk profiles, and supplied the missing equipment list for Burszuj Dzikich Orków.
- Corrected the missing and misspelled exclusive-choice mappings. The validator now catches conflicting choices in loaded rosters as well as disabling options during recruitment. Nippon's Samuraj count cannot exceed Ashigaru.
- Added the already referenced hired swords Czarny Ork and Grzybowar. Split the malformed combined mercenary name in Plemię Leśnych Goblinów.
- Added Yin/Yang choices, Dao's two six-spell traditions and missing priest prayer lists. Replaced the old Sigmar prayer table, whose duplicated key silently discarded a prayer. Added the new roster-specific rule descriptions and Nippon weapon descriptions needed by the new entries.
- Made equipment lists independent for recruited units. Selecting a lore no longer removes a caster's fixed roster equipment, and optional Bractwo horses update their cost and profile. The new heavy-weapon crews charge the shared harpoon once.
- Kult Ducha Chaosu no longer offers Rydwan Chaosu: both its overview and detailed list now allow only Zaprzęg. The old entry remains marked retired so existing saves can still display it; validation reports it as invalid for a new list.

## Source contradictions and explicit decisions

These are not silently treated as verified corrections to the rulebook:

| Case | Source conflict / omission | App decision |
| --- | --- | --- |
| Cyrkowcy / Cyrkowiec | Overview allows any number up to the army limit; detailed profile says 0–7. | Retained detailed cap 7. |
| Emisariusze / Strzelec | Overview says five; detailed profile says 0–7. | Uses detailed cap 7; needs author clarification. |
| Rycerze Graala / Bitewny ołtarz | Stat row is labelled Rydwan with S5/Wt5/Żw8, but the unit's rules identify it as Powóz. | Retained existing Powóz S4/Wt8/Żw8. The fixture preserves the printed data and the test names this exception. |
| Emisariusze / Nomada's Topór bojowy/Nadziak | Price cell is blank in both duplicated equipment tables. | Omitted this purchase option pending a price; did not invent a cost. |
| Amazonki / Walkiria's Oszczep | Price cell is blank. | Retained the existing 15 zk option pending clarification. |
| Reikland / Rydwan; Nekrarch / Czarna Karoca and Ścierwowóz | These detailed tables give Żw4, while comparable vehicles elsewhere give Żw8. | Uses the army-specific printed Żw4; needs consistency review. |
| Arabia / Nomada | Detailed equipment and stat table both specify an elven steed, despite the army theme. | Uses the printed elven steed, replacing the app's horse. |
| Bractwo / Półgryfon | Its printed rules include Dzikie squigi. | Preserved that explicit source rule; needs author review. |
| Bractwo / Kapłan Morra | Chapter 23's profile incorrectly labels its prayers as Mananna; its heading and prayer list are Morra. | Corrected the deity label to Morra. |
| Middenheim / Kapłan Ulryka | Army profile gives a hammer; generic chapter 23 profile gives an axe. | Army-specific starting hammer retained; Bractwo uses chapter 23's axe. |
| Tengu | Rule list is missing a comma between Zimnokrwisty and Zwiadowca. | Split into the two existing rules. |
| Bestiobójcy | Army overview writes Podatki while the global rule is Podatek. | Uses canonical Podatek. |
| Kult Pogromców equipment | Hero equipment table includes armour although individual slayers are Fanatyk. | Kept the shared table for non-fanatics; applied chapter 8's explicit armour prohibition to the slayers. |
| Dao spell text | Summoned Terakotowy żołnierz includes apparent copied wolf flavour text; one Yang spell's threshold heading and condition also differ. | Preserved supplied spell mechanics/thresholds without inventing an erratum. |

## Validation

- `CI=true npm test -- --watchAll=false --runInBand`: 166 tests passed.
- The independent fixture `src/Data.js/__fixtures__/rulebook-profiles.json` covers all 704 explicit army profiles: cost, cap and every stat row. Unlimited caps retain equivalent legacy values (for example 99 with an army limit of 15).
- Tests cover all 63 registered armies, resolved hired-sword references, every exclusive-choice group, recruitment through the existing UI for all eight additions, catalog immutability, optional horses, crew pricing, lore selection, seven priest prayer lists and retired-save handling.
- Production build passes with pre-existing lint warnings. No deployment or alteration of saved user lists is performed.

## Existing army audit results

Every army below was compared to the supplied source. “Matched” means no recruitment-data edit was needed in that army object; shared equipment and validation improvements still apply.

| Army | Changed fields / units |
| --- | --- |
| Łowcy Czarownic | Inkwizytor: equipmentList; Łowca czarownic: equipmentList; Flagelant: equipmentList; Pies bojowy: startingEquipment; Rycerz zakonny: equipmentList; Pokutnik: stats |
| Cyrkowcy z Ligii Ostermarku | Kapłan Ranalda: rules; Szarlatan: rules; Ogr: equipmentList |
| Gang przemytników | Matched |
| Muszkieterzy z Nuln | Milicjant: equipmentList; Muszkieter: equipmentList; Strażnik miejski: equipmentList; Krasnoludzki Ranger: equipmentList |
| Piechota Morska z Marienburga | Kapłan Mannana: cost, rules; Harpunnik: rules |
| Strażnicy dróg z Averlandu | Strażnik dróg: equipmentList; Myśliwy: equipmentList; Pikinier: equipmentList; Rajtar: equipmentList; Pogromca Trolli: rules |
| Zbrojna kompania z Ostlandu | Myśliwy: cost |
| Zbrojni z Middenheim | Kapłan Ulryka: startingEquipment; Krewniak: cost; Przepatrywacz: stats |
| Rycerze Graala | Panna Graala: exp, rules; Rycerz Królestwa: stats; Piechur: equipmentList; Zbrojny Graala: number; Pielgrzym Graala: equipmentList |
| Zbrojna chorągiew z Kisleva | Matched |
| Piraci z Sartosy | Kapłan Mannana: rules; Łowca niewolników: number; Mat: number; Pirat: rules; Ogr: equipmentList |
| Psy Wojny | Kapłan Myrmidii: stats, rules; Najemnik: cost |
| Raubritterzy z Księstw Granicznych | Rozbójnik: equipmentList |
| Kupiecka karawana z Arabii | Emir: equipmentList; Wezyr: equipmentList, skills; Handlarz niewolników: stats, equipmentList; Wieszcz: stats, equipmentList; Strażnik: equipmentList; Nomada: stats, startingEquipment, equipmentList; Ifryt: rules |
| Amazonki z Lustrii | Memroda: cost; Więźniarka: stats; Rydwan: stats; Army: armyRules |
| Gladiatorzy z Jałowej Krainy | Matched |
| Siostry Sigmara | Przeorysza: rules; Nowicjuszka: equipmentList; Siostra Sigmara: equipmentList |
| Niziołki z Krainy Zgromadzenia | Starszy: equipmentList; Sierżant: equipmentList; Zwiadowca: equipmentList; Pasterz: equipmentList; Milicjant: equipmentList; Przepatrywacz: equipmentList; Ogr: equipmentList |
| Leśni Elfowie z Athel Loren | Tancerz Wojny: rules, equipmentList; Jeździec Polany: equipmentList; Drzewoduch: startingEquipment |
| Elfowie Wysokiego Rodu z Ulthuan | Matched |
| Mroczni Elfowie z Naggaroth | Szlachcic: equipmentList; Korsarz: equipmentList; Egzekutor: equipmentList; Wiedźma Khaina: rules, equipmentList; Jeździec Mroku: equipmentList; Harpia: rules |
| Khazadzi z Gór Krańca Świata | Kowal Run: rules; Żyrokopter: stats, equipmentList |
| Kompania Krasnoludzkich Piwowarów | Kowal Run: rules; Krasnoludzki Ranger: startingEquipment; Zaprzęg: stats |
| Kult Pogromców z Karak Kadrin | Kowal Run: rules; Pogromca Smoków: equipmentList; Pogromca Gigantów: cost, equipmentList; Pogromca Trolli: equipmentList; Żyrokopter: equipmentList |
| Szkutnicy z Barak Varr | Ogr: equipmentList; Balon bojowy: equipmentList; Żyrokopter: equipmentList |
| Krasnoludowie Chaosu z Zorn Uzkul | Czarnoksiężnik: rules; Mistrz Inżynier: equipmentList; Łowca niewolników: equipmentList; Bykocentaur: equipmentList; Zagan: startingEquipment, rules |
| Jeźdzcy Wilków | Ogr: equipmentList |
| Zwiadowcza kompania z Królestw Ogrów | Łowca: equipmentList; Żelazobrzuchy: equipmentList; Byk: equipmentList |
| Kult Ducha Chaosu | Wtajemniczony: equipmentList; Akolita: equipmentList, rules; Opętany: rules; Kultysta: equipmentList; Furia Chaosu: stats; Zwierzoczłek: equipmentList; Ogr Chaosu: equipmentList; Troll Chaosu: rules; Zaprzęg: stats; Rydwan Chaosu: retired |
| Kult Karmazynowej Czaszki | Wtajemniczony: equipmentList; Akolita: equipmentList; Kultysta: startingEquipment, equipmentList; Piekielny Ogar: number; Khorngor: equipmentList; Ogr Chaosu: equipmentList |
| Kult Dzieci Zagłady | Wtajemniczony: equipmentList; Akolita: equipmentList; Kultysta: equipmentList; Plagogor: equipmentList; Ogr Chaosu: startingEquipment, equipmentList |
| Kult Purpurowej Dłoni | Akolita: stats; Kultysta: stats, cost; Smoczy Ogr: equipmentList; Zaprzęg: stats |
| Grasanci Chaosu | Wybraniec Chaosu: equipmentList; Czarnoksiężnik Chaosu: equipmentList; Wojownik Chaosu: equipmentList; Łowca niewolników: equipmentList; Grasant Chaosu: stats; Odrzucony: stats; Zwierzoczłek: stats; Kawalerzysta Chaosu: startingEquipment; Ogr Chaosu: equipmentList; Smoczy Ogr: equipmentList; Troll Chaosu: stats; Army: armyRules |
| Karnawał Chaosu | Mistrz Karnawału: equipmentList; Poskramiacz: equipmentList; Harlekin: equipmentList; Mocarz: equipmentList; Furia Chaosu: stats; Bólożądna Pieszczota: startingEquipment; Tyralier: stats, startingEquipment, equipmentList; Troll Chaosu: stats; Karawan: stats |
| Zbrojne stado Zwierzoludzi | Grabieżcy: startingEquipment; Minotaur: equipmentList |
| Nieumarła świta Hrabiego Von Carstein | Matched |
| Nieumarły orszak księżnej Lahmi | Szkielet: rules; Graveir: rules |
| Nieumarły poczet Krwawych Smoków | Szkielet: equipmentList; Wicht: stats, equipmentList; Graveir: rules |
| Nieumarły sabat rodu Nekrarch | Wicht: stats; Czarna Karoca: stats; Ścierwowóz: stats |
| Nieumarły tabor ludu Strigosu | Ghast: skills; Strigan: exp; Graveir: rules |
| Nieumarły zastęp z Nehekhary | Licz: rules |
| Zwiadowcze stado klanu Eshin | Rynsztokowiec: rules, equipmentList |
| Poganiacze klanu Moulder | Matched |
| Kult Zarazy klanu Pestilens | Diakon Zarazy: equipmentList, rules; Mnich Zarazy: equipmentList; Kadzielnik: equipmentList; Łowca niewolników: equipmentList; Czerw Zarazy: number |
| Harcownicy klanu Skryre | Łowca niewolników: stats; Harcownik: rules; Drużyna ciężkich broni: equipmentList; Szczurogr klanu Skryre: rules |
| Zbrojne stado klanu Mors | Szary Prorok: exp; Szturmoszczur: number |
| Łowcze plemię Dzikich Orków | Szaman Dzikich Orków: rules; Burszuj Dzikich Orków: equipmentList, rules; Dziki Ork: rules; Leśny Goblin: rules; Pajonk: rules; Dziki Ork na Dziku: rules; Troll: rules; Wielki Pajonk: rules; Army: mercenaries |
| Plemię Leśnych Goblinów | Troll: rules; Army: mercenaries |
| Orkowie & Gobliny | Herszt Orków: stats; Troll: rules |
| Załoga Zielonoskórych Kaprów | Łowca niewolników: stats; Goblin Pirat: rules; Kaper: startingEquipment; Troll: rules; Ośmiornica Bagienna: rules |
| Jaszczuroludzie z Lustrii | Matched |
| Nieumarła horda Liczmistrza | Szkielet: rules; Wicht: stats |
| Żołnierze z Reiklandu | Flagelant: equipmentList; Rydwan: stats |
| Nocne Gobliny | Nocny Hop-Goblin: stats; Troll: rules; Wielki Squig: startingEquipment; Rydwan: stats; Więźniarka: stats |
| Kult Sybarytów | Wtajemniczony: equipmentList; Akolita: equipmentList; Bólożądna Pieszczota: number, startingEquipment, rules; Ogr Chaosu: equipmentList; Zaprzęg: stats; Army: armyRules |
