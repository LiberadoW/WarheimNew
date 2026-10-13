# Army data audit

Source: the user-supplied `Warheim.docx`, SHA-256 `1f6137e245e787ae1836711a4320682355ed95cfce1b77fc17dd1007d1f8509f`.
Repository baseline: `48b1a008c6d43df3dbd391ea6e23b3561cf6863b` (master after Gang przemytników was merged).

## Coverage

The supplied document contains 63 army lists and 705 recruitment entries. Of these, 704 have explicit stat tables; Bractwo Rycerskie's generic Kapłan refers to seven patrons in chapter 23. The application previously contained 55 armies.

This change adds eight armies with recruitment costs, caps, starting and maximum stats, secondary mount/vehicle profiles, starting gear, purchasable equipment, experience, skills, nature, army rules, eligible hired swords, and exclusive recruitment choices. Bractwo's seven priest choices and two heavy-weapon crews bring the additions to 96 app profiles. The catalog now contains 719 profiles, including seven helper crew profiles and one retired profile kept for old saves; 718 are recruitable.

The existing 55 lists were compared against their corresponding recruitment sections. The audit covers those fields, the chapter 22/23 cross-references needed by their casters/priests, and the equipment tables. Following the owner’s PR #5 review, the catalog now uses the rulebook’s army and unit names, including `Giermek` instead of `Dreg` in the Krwawego Smoka roster. The [complete name-change list](rulebook-name-changes.md) records six army names and 133 unit names (including capitalization). Numeric IDs are unchanged. Opening an old saved roster translates its names while preserving custom names, stats, gear, experience and battle history; it does not overwrite saved data until the user saves.

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

- Corrected recruitment costs, numeric profiles and caps using each army's detailed profile, with the owner-approved source corrections below.
- Corrected rule labels and omissions, starting equipment, experience and skill categories. Kept separately described rules such as Konny, Towarzysz Graala, Ślubowanie, Mistrzowie koni and Magia Krwi.
- Reconciled equipment prices and lists, fixed misspelled item keys, connected Tancerz Wojny and Wiedźma Khaina to their dedicated lists, removed prohibited armour from Fanatyk profiles, and supplied the missing equipment list for Burszuj Dzikich Orków.
- Corrected the missing and misspelled exclusive-choice mappings. The validator now catches conflicting choices in loaded rosters as well as disabling options during recruitment. Nippon's Samuraj count cannot exceed Ashigaru.
- Added the already referenced hired swords Czarny Ork and Grzybowar. Split the malformed combined mercenary name in Plemię Leśnych Goblinów.
- Added Yin/Yang choices, Dao's two six-spell traditions and missing priest prayer lists. Replaced the old Sigmar prayer table, whose duplicated key silently discarded a prayer. Added the new roster-specific rule descriptions and Nippon weapon descriptions needed by the new entries.
- Each recruited model gets its own equipment list, so changing one model cannot change the catalog or another model. Selecting a magic tradition keeps the caster’s ordinary weapon and armour options. Buying a Bractwo horse adds 40 zk and the horse’s stat row; removing it reverses both. A Norski or Kraka Drak heavy-weapon crew pays 50 zk for one shared harpoon, rather than paying 50 zk for each crew member.
- Kult Ducha Chaosu no longer offers Rydwan Chaosu: both its overview and detailed list now allow only Zaprzęg. The old entry remains marked retired so existing saves can still display it; validation reports it as invalid for a new list.

## Source contradictions and explicit decisions

The owner’s PR #5 review (13 October 2026) resolves the first nine cases below. Remaining source discrepancies retain the documented decisions. Tests keep the original printed numeric fixture and explicitly apply the approved corrections, rather than rewriting source evidence.

| Case | Source conflict / omission | App decision |
| --- | --- | --- |
| Cyrkowcy / Cyrkowiec | Overview allows any number up to the army limit; detailed profile says 0–7. | Cap 7 confirmed by the owner; unchanged. |
| Emisariusze / Strzelec | Overview says five; detailed profile says 0–7. | Cap 7 confirmed by the owner; unchanged. |
| All five armies with Bitewny ołtarz | Rycerze Graala and Norski print Rydwan S5/Wt5/Żw8 despite the Powóz rule. | Owner confirms Powóz S4/Wt8/Żw8 in every army. Norski changed from Rydwan 5/5/8 to Powóz 4/8/8; Bractwo, Emisariusze, Graal and Siostry already match. |
| Emisariusze / Nomada's Topór bojowy/Nadziak | Price cell is blank in both duplicated equipment tables. | Owner supplies 5 zk: Topór bojowy/Nadziak added to Nomada’s equipment options. |
| Amazonki / Walkiria's Oszczep | Price cell is blank. | 15 zk confirmed by the owner; unchanged. |
| Reikland / Rydwan; Nekrarch / Czarna Karoca and Ścierwowóz | These detailed tables give Żw4, while comparable vehicles elsewhere give Żw8. | Owner confirms Żw8: all three changed from 4 to 8; other stats unchanged. |
| Arabia / Nomada | Detailed equipment and stat table both specify an elven steed, despite the army theme. | Owner confirms a normal horse: starting equipment and profile changed to Koń bojowy. Sz9 → 8, I4 → 3; Wt3/Żw1 → –/– as in the mounted horse profile. Full profile: 8/3/0/3/–/–/3/1/5. |
| Bractwo / Półgryfon | Its printed rules include Dzikie squigi. | Removed Dzikie squigi as requested by the owner; other rules unchanged. |
| Bractwo / Kapłan Morra | Chapter 23's profile incorrectly labels its prayers as Mananna; its heading and prayer list are Morra. | Morra confirmed by the owner; retained the corrected prayer label. |
| Middenheim / Kapłan Ulryka | Army profile gives a hammer; generic chapter 23 profile gives an axe. | Army-specific starting hammer retained; Bractwo uses chapter 23's axe. |
| Tengu | Rule list is missing a comma between Zimnokrwisty and Zwiadowca. | Split into the two existing rules. |
| Bestiobójcy | Army overview writes Podatki while the global rule is Podatek. | Uses canonical Podatek. |
| Kult Pogromców equipment | Hero equipment table includes armour although individual slayers are Fanatyk. | Kept the shared table for non-fanatics; applied chapter 8's explicit armour prohibition to the slayers. |
| Dao spell text | Summoned Terakotowy żołnierz includes apparent copied wolf flavour text; one Yang spell's threshold heading and condition also differ. | Preserved supplied spell mechanics/thresholds without inventing an erratum. |

## Validation

- `CI=true npm test -- --watchAll=false --runInBand`: 170 tests passed.
- The independent fixture `src/Data.js/__fixtures__/rulebook-profiles.json` covers all 704 explicit army profiles: cost, cap and every stat row. Unlimited caps retain equivalent legacy values (for example 99 with an army limit of 15).
- Tests cover all 63 registered armies, resolved hired-sword references, every exclusive-choice group, recruitment through the existing UI for all eight additions, catalog immutability, optional horses, crew pricing, lore selection, seven priest prayer lists and retired-save handling.
- Review regression checks cover all five altars, approved prices and caps, the normal horse, Półgryfon’s rules, all renamed entries, and preservation of saved campaign data.
- Production build passes with pre-existing lint warnings. Existing database records are not bulk-edited; old roster names are normalized when opened and persisted only through the existing save flow.

## Existing army audit results

Every army below was compared to the supplied source. Names shown are current names. “Matched” means no army-object change was needed; shared equipment and validation improvements still apply. Each listed field differs from the repository baseline.

| Army | Changed fields / units |
| --- | --- |
| Łowcy czarownic | Inkwizytor: equipmentList; Łowca czarownic: equipmentList; Flagelant: equipmentList; Pies bojowy: startingEquipment; Rycerz zakonny: equipmentList; Pokutnik: stats; Army: name |
| Cyrkowcy z Ligii Ostermarku | Magister Magii: name; Kapłan Ranalda: rules; Szarlatan: rules; Ogr: equipmentList |
| Gang przemytników | Matched |
| Muszkieterzy z Nuln | Magister Magii: name; Milicjant: equipmentList; Muszkieter: equipmentList; Strażnik Miejski: name, equipmentList; Krasnoludzki ranger: name, equipmentList |
| Piechota Morska z Marienburga | Kapłan Mananna: name, cost, rules; Harpunnik: rules |
| Strażnicy dróg z Averlandu | Magister Magii: name; Strażnik dróg: equipmentList; Myśliwy: equipmentList; Pikinier: equipmentList; Rajtar: equipmentList; Pogromca trolli: name, rules |
| Zbrojna kompania z Ostlandu | Magister Magii: name; Myśliwy: cost |
| Zbrojni z Middenheim | Magister Magii: name; Kapłan Ulryka: startingEquipment; Krewniak: cost; Przepatrywacz: stats |
| Rycerze Graala | Panna Graala: rules, exp; Rycerz próby: name; Rycerz królestwa: name, stats; Piechur: equipmentList; Zbrojny: name, number; Pielgrzym Graala: equipmentList; Błędny rycerz: name |
| Zbrojna chorągiew z Kisleva | Matched |
| Piraci z Sartosy | Kapitan piratów: name; Kapłan Mananna: name, rules; Łowca niewolników: number; Mat: number; Pirat: rules; Żołnierz Okrętowy: name; Ogr: equipmentList |
| Psy Wojny | Kapłan Myrmidii: stats, rules; Najemnik: cost; Oblężnik: name |
| Raubritterzy z Księstw Granicznych | Herszt raubritterów: name; Rozbójnik: equipmentList |
| Kupiecka karawana z Arabii | Emir: equipmentList; Wezyr: equipmentList, skills; Handlarz niewolników: equipmentList, stats; Wieszcz: equipmentList, stats; Strażnik: equipmentList; Nomada: equipmentList; Ifryt: rules |
| Amazonki z Lustrii | Memroda: cost; Więźniarka: stats; Rydwan: stats; Army: armyRules |
| Gladiatorzy z Jałowej Krainy | Pogromca trolli: name |
| Siostry Sigmara | Przeorysza: rules; Siostra bitwy: name; Nowicjuszka: equipmentList; Siostra Sigmara: equipmentList; Bitewny ołtarz: name |
| Niziołki z Krainy Zgromadzenia | Starszy: equipmentList; Magister Magii: name; Sierżant: equipmentList; Zwiadowca: equipmentList; Pasterz: equipmentList; Milicjant: equipmentList; Przepatrywacz: equipmentList; Ogr: equipmentList |
| Leśni Elfowie z Athel Loren | Mag elfów: name; Strażnik ścieżek: name; Strażnik polany: name; Tancerz wojny: name, equipmentList, rules; Jeździec polany: name, equipmentList; Drzewoduch: startingEquipment |
| Elfowie Wysokiego Rodu z Ulthuanu | Mag elfów: name; Mistrz Miecza Hoeth: name; Army: name |
| Mroczni Elfowie z Naggaroth | Szlachcic: equipmentList; Korsarz: equipmentList; Egzekutor: equipmentList; Wiedźma Khaina: equipmentList, rules; Jeździec Mroku: equipmentList; Harpia: rules; Mroczny pegaz: name |
| Khazadzi z Gór Krańca Świata | Kowal run: name, rules; Mistrz inżynier: name; Łamacz żelaza: name; Wojownik klanowy: name; Pogromca trolli: name; Żyrokopter: equipmentList, stats |
| Kompania krasnoludzkich Piwowarów | Mistrz piwowar: name; Kowal run: name, rules; Mistrz inżynier: name; Wojownik klanowy: name; Krasnoludzki ranger: name, startingEquipment; Krasnoludzki przepatrywacz: name; Pogromca trolli: name; Zaprzęg: stats; Army: name |
| Kult Pogromców z Karak Kadrin | Tan pogromców: name; Kowal run: name, rules; Mistrz inżynier: name; Pogromca smoków: name, equipmentList; Pogromca gigantów: name, cost, equipmentList; Pogromca trolli: name, equipmentList; Żyrokopter: equipmentList |
| Szkutnicy z Barak Varr | Mistrz szkutnik: name; Kowal run: name; Mistrz inżynier: name; Wojownik klanowy: name; Ogr: equipmentList; Balon bojowy: equipmentList; Żyrokopter: equipmentList |
| Krasnoludowie Chaosu z Zorn Uzkul | Czarnoksiężnik: rules; Mistrz inżynier: name, equipmentList; Łowca niewolników: equipmentList; Bykocentaur: equipmentList; Wojownik klanowy: name; Zagan: startingEquipment, rules |
| Jeźdźcy Wilków | Herszt hobgoblinów: name; Szaman hobgoblinów: name; Siepacz hobgoblinów: name; Ogr: equipmentList; Army: name |
| Zwiadowcza kompania z Królestw Ogrów | Łowca (ogr): name, equipmentList; Ogniobrzuchy (ogr): name; Rzeźnik (ogr): name; Żelazobrzuchy (ogr): name, equipmentList; Traper (gnoblar): name; Zbrojny (Gnoblar): name; Byk (ogr): name, equipmentList |
| Kult Ducha Chaosu | Wtajemniczony: equipmentList; Akolita: equipmentList, rules; Opętany: rules; Kultysta: equipmentList; Furia Chaosu: stats; Zwierzoczłek: equipmentList; Ogr Chaosu: equipmentList; Troll Chaosu: rules; Zaprzęg: stats; Rydwan Chaosu: retired |
| Kult Karmazynowej Czaszki | Wtajemniczony: equipmentList; Akolita: equipmentList; Kultysta: startingEquipment, equipmentList; Piekielny ogar: name, number; Khorngor: equipmentList; Ogr Chaosu: equipmentList |
| Kult Dzieci Zagłady | Wtajemniczony: equipmentList; Akolita: equipmentList; Kultysta: equipmentList; Plagogor: equipmentList; Ogr Chaosu: startingEquipment, equipmentList |
| Kult Purpurowej Dłoni | Akolita: stats; Kultysta: cost, stats; Różowy strachulec: name; Smoczy ogr: name, equipmentList; Zaprzęg: stats |
| Grasanci Chaosu | Wybraniec Chaosu: equipmentList; Czarnoksiężnik Chaosu: equipmentList; Wojownik Chaosu: equipmentList; Łowca niewolników: equipmentList; Grasant Chaosu: stats; Odrzucony: stats; Zwierzoczłek: stats; Kawalerzysta Chaosu: startingEquipment; Ogr Chaosu: equipmentList; Smoczy ogr: name, equipmentList; Troll Chaosu: stats; Rydwan: name; Army: armyRules |
| Karnawał Chaosu | Mistrz karnawału: name, equipmentList; Poskramiacz: equipmentList; Harlekin: equipmentList; Mocarz: equipmentList; Furia Chaosu: stats; Piekielny ogar: name; Nurgling: name; Bólożądna pieszczota: name, startingEquipment; Różowy strachulec: name; Tyralier: startingEquipment, equipmentList, stats; Troll Chaosu: stats; Karawan: stats |
| Zbrojne stado Zwierzoludzi | Herszt zwierzoludzi: name; Szaman zwierzoludzi: name; Grabieżcy: startingEquipment; Minotaur: equipmentList |
| Nieumarła świta hrabiego von Carstein | Hrabia von Carstein: name; Army: name |
| Nieumarły orszak księżnej Lahmi | Szkielet: rules; Graveir: rules |
| Nieumarły poczet Krwawego Smoka | Krwawy smok: name; Giermek: name; Szkielet: equipmentList; Wicht: equipmentList, stats; Czarny rycerz: name; Graveir: rules; Army: name |
| Nieumarły sabat rodu Nekrarch | Wicht: stats; Czarna karoca: name |
| Nieumarły tabor ludu Strigosu | Ghast: skills; Strigan: exp; Graveir: rules; Czarna karoca: name |
| Nieumarły zastęp z Nehekhary | Książe grobowców: name; Licz: rules; Strażnik grobowców: name; Nieumarły nomada: name; Grobowy skorpion: name |
| Zwiadowcze stado klanu Eshin | Rynsztokowiec: equipmentList, rules |
| Poganiacze klanu Moulder | Mistrz mutator: name; Mistrz ciałokształtowania: name |
| Kult Zarazy klanu Pestilens | Diakon zarazy: name, equipmentList, rules; Mnich zarazy: name, equipmentList; Kadzielnik: equipmentList; Łowca niewolników: equipmentList; Czciciel zarazy: name; Siewca zarazy: name; Szczur zarazy: name; Czerw zarazy: name, number |
| Harcownicy klanu Skryre | Łowca niewolników: stats; Harcownik: rules; Drużyna ciężkich broni: equipmentList; Szczurogr klanu Skryre: rules; Koło zagłady: name |
| Zbrojne stado klanu Mors | Szary prorok: name, exp; Szturmoszczur: number |
| Łowcze plemię Dzikich Orków | Szaman dzikich orków: name, rules; Burszuj dzikich orków: name, rules, equipmentList; Dziki ork: name, rules; Leśny goblin: name, rules; Pajonk: rules; Dziki ork na dziku: name, rules; Troll: rules; Wielki Pajonk: rules; Army: mercenaries |
| Plemię Leśnych Goblinów | Herszt leśnych goblinów: name; Szaman leśnych goblinów: name; Traper leśnych goblinów: name; Rembajło leśnych goblinów: name; Leśny goblin: name; Jeździec pajonków: name; Troll: rules; Wielki pajonk: name; Army: mercenaries |
| Orkowie & Gobliny | Herszt orków: name, stats; Szaman orków: name; Burszuj orków: name; Gobliński fanatyk: name; Ork na dziku: name; Troll: rules |
| Załoga Zielonoskórych Kaprów | Kapitan goblinów: name; Szaman goblinów: name; Goblin mat: name; Łowca niewolników: stats; Goblin pirat: name, rules; Kaper: startingEquipment; Troll: rules; Ośmiornica bagienna: name, rules |
| Jaszczuroludzie z Lustrii | Wódz skinków: name; Kapłan skinków: name; Skink kameleon: name; Jeździec zimnokrwistych: name; Jeździec terradonów: name |
| Nieumarła horda Liczmistrza | Szkielet: rules; Wicht: stats; Czarny rycerz: name |
| Żołnierze z Reiklandu | Magister Magii: name; Flagelant: equipmentList |
| Nocne Gobliny | Herszt nocnych goblinów: name; Szaman nocnych goblinów: name; Sieciarz nocnych goblinów: name; Nocny goblin: name; Gobliński fanatyk: name; Nocny hop-goblin: name, stats; Troll: rules; Wielki squig: name, startingEquipment; Rydwan: stats; Więźniarka: stats |
| Kult Sybarytów | Wtajemniczony: equipmentList; Akolita: equipmentList; Bólożądna pieszczota: name, startingEquipment, number, rules; Ogr Chaosu: equipmentList; Zaprzęg: stats; Army: armyRules |
