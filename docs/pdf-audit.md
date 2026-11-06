# PDF audit

Source of truth: `Warheim_FS_RULEBooK by QC Wicht (4).pdf`, version AD2026.04.15, 614 pages. The PDF is newer than warheimer.netlify.app (which is based on it) and than the Warheim.docx the app data came from. Where they differ, the PDF wins.

Every difference found is listed row by row in the group reports in [pdf-audit/](pdf-audit/). This page summarises them and collects everything that **needs your decision**. Nothing in that list has been changed in the app yet.

## Summary

| Area | Report | Changed | Added | Decision needed |
| --- | --- | ---: | ---: | ---: |
| Bractwo Rycerskie … Zbrojni z Middenheim (11 bands) | [bands-1](pdf-audit/bands-1.md) | 9 | 0 | 9 |
| Żołnierze z Reiklandu … Berserkerzy z Norski (11) | [bands-2](pdf-audit/bands-2.md) | 7 | 3 | 11 |
| Niziołki … Szkutnicy z Barak Varr (10) | [bands-3](pdf-audit/bands-3.md) | 7 | 1 | 6 |
| Krasnoludowie Chaosu … Karnawał Chaosu (11) | [bands-4](pdf-audit/bands-4.md) | 6 | 0 | 11 |
| Zwierzoludzie … Zwiadowcze stado klanu Eshin (10) | [bands-5](pdf-audit/bands-5.md) | 15 | 1 | 4 |
| Poganiacze klanu Moulder … Jaszczuroludzie (10) | [bands-6](pdf-audit/bands-6.md) | 6 | 11 | 8 |
| Weapons, armour, item descriptions | [equipment](pdf-audit/equipment.md) | 32 | 15 | 14 |
| Mercenaries, spells, prayers, caster gear | [mercenaries-magic](pdf-audit/mercenaries-magic.md) | 99 | 7 | 18 |
| Special-rule texts | [rule-texts](pdf-audit/rule-texts.md) | 59 | 22 | 1 |

Counts come from each helper's report. Some decisions appear in more than one report and are listed once below.

**Not in the app at all:**
- the bands Kult Męczenników (p. 76), Szermierze z Estalii (p. 132) and Wojownicy Burzy (p. 160);
- Postaci dramatu (49 characters);
- Magia Runiczna;
- magic items (chapter 14b);
- band-specific skills ("Umiejętności specjalne").

## Owner decisions (applied)

- **Pika:** strikes first only against large targets (trzymać pozycję vs DUŻY CEL, POTWÓR, WIELKOLUD).
- **Cios łaski:** applies to both Wakizashi and Mizerykordia.
- **Muszkiet dubeltowy:** 40 zk.
- **Renamed:** Cep bojowy, Pawęża, Płaszcz z łusek smoka, and the lores Dziedzina Chaosu, Domena Nehekhary and Nekromancja. The duplicate "Dziedzina Chaosu Niepodzielonego" spell list is removed. Saved rosters are translated on load (`normalizeRosterNames`).
- **Prices:**
  - Korbacz 5 zk and Średni pancerz 15 zk in every band. Wielkolud armour stays doubled, per the PDF's ×2 rule.
  - Broń miotana (noże) 10 zk everywhere.
  - Rumak and Wielki wilk stay 55 zk.
- **Kept as they are:**
  - Spaczmagia keeps spell 13 (special rules).
  - The Nuln Magister keeps Metal/Ogień.
  - Bukanier and Krasnoludzki ranger stay 0–5.
  - Szaman zwierzoludzi: later refactor.
- **Prezbiter Sigmara:** "Przepastne trzewia" removed in every band.
- **Towarzysz Graala:** the six "Cnota …" choices are replaced by Przymiot: Dzierzba, Filar, Pobożny, Pogromca and Żniwiarz. Naczynie Chaosu is left out because it is for mages only. Old saves drop their Cnota choice and get the new list.
- **New bands added:** Kult Męczenników, Szermierze z Estalii and Wojownicy Burzy.
- **Tradycja Yin:** the copy-paste errors in "Uśpienie smoczego oddechu" and "Cień zapomnienia" are corrected.
- **Inkwizytor:** the PDF line is a printing error; he keeps the band hero list.
- **Dzikie squigi:** restored on the Półgryfon in Bractwo Rycerskie and Wojownicy Burzy. This reverses the PR #5 decision.
- **Vehicles:** Rydwan S5 Wt5 Żw8, Czarna karoca S4 Wt8 Żw8, Ścierwowóz S5 Wt5 Żw8. The app already matched.
- **Wojownik:** Łucznik is renamed Wojownik in Elfowie Wysokiego Rodu and Konwent Hoeth. Saved rosters are translated.
- **Zwadźca:** his cloak is now "Płaszcz z Estalii". The Rozbójnik mercenary keeps "Płaszcz (puklerz)", which the PDF describes as a different item.
- **Casters and armour:** casters and the Grasant Chaosu keep their armour options (option b). A Mag in armour simply can't cast.
- **Przepastne trzewia:** checked unit by unit. Every unit the PDF gives it to already has it.

## Decisions needed

### 1. Your earlier decisions that the PDF contradicts
These are from `docs/army-data-audit.md` and earlier reviews. They stay as they are unless you say otherwise.

| Where | App now | PDF |
| --- | --- | --- |
| Bractwo Rycerskie / Półgryfon | no Dzikie squigi | still lists DZIKIE SQUIGI |
| Machine Żw (Nekrarch Czarna karoca and Ścierwowóz, Reikland Rydwan) | 8 | 4 |
| Bitewny ołtarz (Rycerze Graala, Norska) | Powóz profile 4/8/8 | Rydwan profile 5/5/8 |
| Cyrkowcy / Cyrkowiec | max 7 | overview: any number; profile: 0–7 |
| Emisariusze / Strzelec | max 7 | overview: 5; profile: 0–7 |
| Arabia / Nomada | ordinary horse | Rumak elfów |
| Names you chose earlier | Zbrojny (Graal), Oblężnik (Psy Wojny), Żołnierz Okrętowy (Piraci) | Zbrojny Graala, Oblężnik z Remas, Żołnierz okrętowy |
| Casters' armour (Wtajemniczony in Duch Chaosu, Dzieci Zagłady, Sybaryci and Purpurowa Dłoń; Czarnoksiężnik Chaosu; Diakon zarazy) | weapons and armour | "dodatkowy oręż" (weapons only) |
| Kult Pogromców / Pogromca trolli | hero weapons without armour | the band's Stronnicy list, which would drop Sztylet, Kusza, Muszkiet krasnoludzki and two pistols |

### 2. The PDF contradicts itself or looks copy-pasted

| Where | Conflict | App keeps |
| --- | --- | --- |
| Łowcy czarownic / Inkwizytor | gear "odpowiedni dla Prezbitera Sigmara", the Prezbiter's own sentence | band hero list |
| Bractwo Rycerskie machines | heading says "Zaprzęg albo Rydwan"; units are Bitewny ołtarz / Rydwan | Bitewny ołtarz |
| Rycerze Graala / Bitewny ołtarz | overview says "Rydwan Graala" | Bitewny ołtarz |
| Marienburg / Bukanier | overview max 3, profile 0–5 | 5 |
| Piwowarzy / Krasnoludzki ranger | overview max 3, profile 0–5 | 5 |
| Troll Chaosu (Grasanci, Karnawał) | Maksymalna A 4 here, 3 in every other band | 4 |
| Kapry / Kaper | heading "Kaper"; overview and table "Goblin kaper" | Kaper |
| Zwierzoludzie / Grabieżcy | heading plural; overview and profile "Grabieżca" | Grabieżcy |
| Muszkiet dubeltowy | price table 35 zk, entry 40 zk | 40 |
| Pika | summary line: uderza jako pierwszy; body: only against large targets | summary line |
| Wakizashi / Mizerykordia | "cios łaski" in the body, not in the summary; unclear for Mizerykordia | without |
| Muszkieterzy z Nuln / Magister | band page: Metal or Ogień only; chapter 22: any of the 8 colleges | Metal/Ogień |
| Spaczmagia | seven spells numbered 7–13; 13 can't be rolled on 2K6 | as printed |
| Tradycja Yin | "Uśpienie smoczego oddechu" and "Cień zapomnienia" contain other spells' text | as printed |
| Kapłan Vereny | prayers printed under "MODLITWY DO MANANNA" | as printed |
| Prezbiter Sigmara | has "Przepastne trzewia" (looks copied from the Rzeźnik) | as printed |
| Ogry / Rzeźnik | app has "Wielkolud"; chapter 23 profile doesn't | Wielkolud |
| Marienburg and Piraci Kapłan | app offers Hełm; chapter 23 doesn't list it | Hełm |
| Klątwa księcia grobowców | body text says "KLĄTWA KSIĘGA GROBOWCÓW" | as printed |

### 3. Renames (they change names in saved rosters)

| Old (app) | New (PDF) |
| --- | --- |
| Łucznik (Elfowie Wysokiego Rodu, Konwent Hoeth) | Wojownik |
| Herszt Dzikich Orków | Herszt dzikich orków |
| Wielki Pajonk (Dzikie Orki) | Wielki pajonk |
| Zniewolony Troll (Norska) | Zniewolony troll |
| Tradycja Lodu (Kislev) | Tradycja Magii Lodu |
| Dziedzina Chaosu Niepodzielonego | Dziedzina Chaosu |
| Dziedzina Nehekary | Domena Nehekhary |
| Dziedzina Nekromancji | Nekromancja |
| Płaszcz z łusek morskiego smoka | Płaszcz z łusek smoka |
| Cep bojowcy | Cep bojowy |
| Pawęż (Psy Wojny) | Pawęża |
| Płaszcz (puklerz) (Zwadźca) | Płaszcz z Estalii |
| Koń (horse rows in 15 bands) | Koń bojowy |
| "Cnota …" ×6 (Towarzysz Graala) | the PDF's Przymiot list: Dzierzba, Filar, Naczynie Chaosu (mages only), Pobożny, Pogromca, Żniwiarz |

### 4. Removals or additions the PDF implies

| Where | Question |
| --- | --- |
| Liczmistrz / Czarny rycerz | remove Miecz? In the PDF, Chopesz replaces it (Chopesz has been added) |
| Zwierzoludzie / Szaman | remove Nurgla, Tzeentcha and "Slaneesha" (misspelt)? The PDF allows only Chaosu or Dziczy |
| Skryre crew | remove plain "Spaczrusznica"? The PDF has only "Spaczrusznica i pawęża", but crew pricing uses the plain name |
| Karnawał Chaosu | delete the unused Ogr equipment list? |
| Krasnoludowie Chaosu / Zagan | add Kropierz (30 zk)? The PDF allows it |
| Karnawał Chaosu demons | the PDF ties each demon to one Znak Chaosu; the app has no Znak selection |
| Szczurołap | the PDF gives him a war dog; the app has no mercenary companions |

### 5. Band prices that differ from the equipment chapter

| Item | Chapter 14 | Band price |
| --- | --- | --- |
| Korbacz | 5 zk | 10 zk: Nekrarch, Liczmistrz (Graal fixed to 5) |
| Średni pancerz | 15 zk | 20 zk: Rozbójnik (Gang przemytników, Raubritterzy), Ranger (Nuln), Rajtar (Averland) |
| Rumak | 65+2K6 zk | 55 zk: Rycerze Graala |
| Wielki wilk | 65+2K6 zk | 55 zk: Jeźdźcy Wilków |
| Broń miotana (noże) | 10 zk | 15 zk: Arabia |
| Generic "Broń miotana" | ambiguous | priced as knives/stars |

## Notes
- **Spell lists changed structure in this edition.** Each lore now has the five common Magia powszechna spells plus six of its own. The new lists are in `src/Data.js/PdfMagic.js` and override the old entries in `Magic.js`, which are now unused.
- **Rule texts now come from the PDF** (`src/Data.js/PdfRules.js`, 453 entries), with warheimer and the older transcriptions as fallbacks. Every unit and mercenary rule has a text.
- **Duplicate ids** (sort order only): Ogry Zbrojny (Gnoblar) and Byk (ogr); Piraci Niewolnik and Pirat. Left alone.
