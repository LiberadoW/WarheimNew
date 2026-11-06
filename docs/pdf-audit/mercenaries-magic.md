# PDF audit: mercenaries and magic

Source: `Warheim_FS_RULEBooK by QC Wicht (4).pdf` (AD2026.04.15). Chapters 15 (Najemne Ostrza), 15b (Postaci dramatu), 22 (Magia) and 23 (Modlitwy).

Files changed: `src/Data.js/Mercenaries.js`, `src/Data.js/Magic.js` (two small edits), new `src/Data.js/PdfMagic.js`, `src/Data.js/MageEquipmentList.js`, `src/Functions/getMagicLore.js`, `src/Data.js/HeroEquipment.js` (small edits), `src/Data.js/ArmyData.test.js` (one test updated).

## 1. Najemne Ostrza (`Mercenaries.js`)

All 44 PDF mercenaries exist in the app, and the app has no mercenaries that the PDF lacks. Cost, pay, prestige, both stat rows and rules were checked by script against the PDF. Starting gear and skills were checked by hand.

General findings:
- The PDF lists **NAJEMNIK** for every mercenary. Before this audit, only Czarny Ork and Grzybowar had it. It is now added to all of them, and each "rules" row below includes that change.
- Several app rules were simply the mercenary's own name ("Balistyk", "Bombardier", "Goniec", "Kanonier", "Mekaniak", "Ogniomistrz", "Szczelec", "Latarnik", "Rozbójnik"). They have no rule text and are not in the PDF, so they were removed.
- In the skills field, index 5 (Specjalne) means the mercenary can learn the special rules listed in its PDF entry.

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Balistyk | rules | Drużyna obsługi, Balistyk | Drużyna obsługi, Najemnik | changed |
| Balistyk z Czarnej Arki | rules | Drużyna obsługi, Przyboczny, Szósty zmysł, Balistyk | Drużyna obsługi, Najemnik, Przyboczny, Szósty zmysł | changed |
| Bombardier | rules | Drużyna obsługi, Bombardier | Drużyna obsługi, Najemnik | changed |
| Bombardier | equipmentList | Piekelnik | Piekielnik | changed (clear typo) |
| Czarownica | rules | Pomiot kniei, Warzenie trucizn, Wzgardzony, Uroki | Najemnik, Ranger, Uroki, Warzenie trucizn, Wzgardzony | changed |
| Gladiator | rules | Szermierz, Mistrz walki | Mistrz walki, Najemnik, Szermierz | changed |
| Goniec | rules | Krzepki, Nieustępliwość, Odporność na magię (2), Pomiot podmroku, Rankor, Trudny do zabicia, Uporczywość, Wojownik podziemny, Zabobonny lęk, Goniec | Adiutant, Krzepki, Najemnik, Nieustępliwy, Odporność na magię (2), Rankor, Trudny do zabicia, Uporczywość, Wspinaczka, Zabobonny lęk | changed |
| Gwardzista | rules | (no Najemnik) | + Najemnik | changed |
| Hiena cmentarna | prestige | 27 | 17 | changed |
| Hiena cmentarna | rules | Kamuflarz, Wzgardzony, Hiena cmentarna | Hiena cmentarna, Kamuflaż, Najemnik, Wzgardzony | changed |
| Hiena cmentarna | skills | [1,4,5] | Walki, Szybkościowe, Specjalne [0,4,5] | changed |
| Kanonier | rules | …Nieustępliwość…, Kanonier | Drużyna obsługi, Krzepki, Najemnik, Nieustępliwy, Szaniec, Trudny do zabicia, Uporczywość, Zawiść | changed |
| Kanonier | equipmentList | Piekelnik | Piekielnik | changed (clear typo) |
| Kartograf | rules | Mapy kartografa | Mapy kartografa, Najemnik | changed |
| Kartograf | skills | [1,4,5] | Walki, Szybkościowe, Specjalne [0,4,5] | changed |
| Kupiec | rules | Ekonom, Handlarz | Ekonom, Handlarz, Mieszczanin, Najemnik | changed |
| Łowca czarownic | rules | Rajtar, Spalić wiedźmę! | + Najemnik | changed |
| Latarnik | rules | Latarnik | Najemnik | changed |
| Latarnik | skills | [1,4,5] | Walki, Szybkościowe, Specjalne [0,4,5] | changed |
| Łowca nagród | startingEquipment | Sztylet, Miecz, Pisolet, Kusza, Ciężki | + Pistolet (typo fixed), Lina & hak, Latarnia sztormowa | changed |
| Łowca nagród | rules | Krzepki, List gończy | + Najemnik | changed |
| Magus | rules | Warzenie trucizn, Wzgardzony, Receptury | + Najemnik | changed |
| Medyk | rules | Felczer | Felczer, Najemnik | changed |
| Mekaniak | rules | Drużyna obsługi, Mekaniak | Drużyna obsługi, Najemnik | changed |
| Minstrel | rules | Pomiot kniei, Szósty zmysł, Sztuka łucznicza | Nadrzewni drapieżcy, Najemnik, Pieśni Loeca, Ranger, Szósty zmysł, Sztuka łucznicza | changed (Pieśni Loeca has no rule text in the app) |
| Miotacz ołowiu | rules | (no Najemnik) | + Najemnik (Gnoblar-pochodnia kept; the PDF describes it inline) | changed |
| Miotacz ołowiu | skills | [1,3,5] | Walki, Siłowe, Specjalne [0,3,5] | changed |
| Ochroniarz | rules | …Tempty… | Tempy (typo fixed), + Najemnik | changed |
| Ochroniarz | skills | [1,3,5] | [0,3,5] | changed |
| Ogniomistrz | rules | …Nieustępliwość, Pomiot podmroku, Wojownik podziemny, Ogniomistrz… | Drużyna obsługi, Krzepki, Inżynier, Najemnik, Nieustępliwy, Odporność na magię (2), Rankor, Szaniec, Trudny do zabicia, Uporczywość, Wspinaczka, Zabobonny lęk | changed |
| Ordynans | rules | Żywa tarcza, Opiekun, Ordynans | + Najemnik | changed |
| Pogromca Trolli | rules | …Nieustępliwość, Pomiot podmroku, Wojownik podziemny… | Fanatyk, Krzepki, Ochronne tatuaże, Najemnik, Nieustępliwy, Odporność na magię (2), Rankor, Pogromca, Topory pogromcy, Trudny do zabicia, Uporczywość, Wspinaczka, Zabobonny lęk | changed |
| Pogromca Trolli | skills | [0,3] | Walki, Siłowe, Specjalne [0,3,5] | changed |
| Porywacz zwłok | pay | 10 | 15 | changed |
| Porywacz zwłok | rules | Kamuflaż, Wzgardzony, Porywacz zwłok | + Najemnik | changed |
| Poszukiwacz złota | rules | …Nieustępliwość, Pomiot podmroku, Pogromca, Wojownik podziemny… | Krzepki, Najemnik, Nieustępliwy, Mapa skarbów, Odporność na magię (2), Rankor, Trudny do zabicia, Uporczywość, Wspinaczka, Zabobonny lęk | changed |
| Poszukiwacz złota | skills | [1,3] | Walki, Siłowe [0,3] | changed |
| Rozbójnik | rules | Kawalerzysta, Lekka jazda, Rajtar, Celny strzał, Rozbójnik | Celny strzał, Kawalerzysta, Lekka jazda, Najemnik, Rabuś, Rajtar | changed |
| Rycerz najemny | rules | Duży cel (wierzchem), Kawalerzysta, Krzepki | + Najemnik | changed |
| Rycerz na Zimnokrwistym | stats (Zimnokrwisty) | 7,3,0,4,4,1,2,1,3 | 7,3,0,4,–,–,2,1,3 | changed (same as the band profiles) |
| Rycerz na Zimnokrwistym | rules | (no Najemnik) | + Najemnik | changed |
| Skryba | rules | Zwoje skryby | Najemnik, Zwoje skryby | changed |
| Strażnik dróg | startingEquipment | …Młot ulrykański, Topór bojowy, Broń miotana (topory)… | Topór bojowy is not in the PDF; removed | changed |
| Strażnik dróg | rules | Duży cel (wierzchem), Kawalerzysta, Bystry wzrok, Celny strzał | + Najemnik | changed |
| Strażnik Morski z Lothern | rules | Drużyna obsługi, Przyboczny, Szósty zmysł | + Najemnik | changed |
| Szczelec | stats (Maksymalna CP) | 9 | 7 | changed |
| Szczelec | rules | Drużyna obsługi, Szczelec | Drużyna obsługi, Najemnik | changed |
| Szczurogr | stats (US) | Początkowa 3, Maksymalna 0 | 1 / 1 | changed |
| Szczurogr | rules | …Uwarunkowany | + Konstrukt, Najemnik; Uwarunkowany removed | changed |
| Szczurołap | rules | Kamuflaż, Ranger, Zastawianie pułapek, Zwiadowca | Kamuflaż, Najemnik, Pułapkarz, Ranger, Zwiadowca | changed (Pułapkarz has rule text; "Zastawianie pułapek" had none) |
| Szczurołap | startingEquipment | no dog | "…oraz psa bojowego" | decision needed (the app has no war-dog companion profile for mercenaries) |
| Szpieg | rules | Infiltracja, Ranger, Zatruty atak, Zwiadowca | + Najemnik | changed |
| Tileański kusznik | rules | Celny stzał, Pewny strzał | Celny strzał (typo fixed), Najemnik, Pewny strzał | changed |
| Trefniś | pay | "Specjalne" | 15 | changed |
| Trefniś | rules | Akrobata, Niepokojący, Podżegacz, Szczęście, Wiarus, Wzgardzony, Żołd | Akrobata, Najemnik, Niepokojący, Podżeganie, Rabuś, Szczęście, Wiarus, Wzgardzony | changed |
| Woźnica | rules | Woźnica, Cieśla | Bałaguła, Najemnik, Woźnica | changed |
| Wróżbita | pay | "Specjalne" | 15 | changed |
| Wróżbita | rules | Szczęście, Światowiec, Tarot, Wzgardzony, Żołd | Najemnik, Rabuś, Szczęście, Światowiec, Tarot, Wzgardzony | changed |
| Złodziej | pay | "Specjalne" | 15 | changed |
| Złodziej | rules | Kamuflaż, Kieszonkowiec, Odporność na magię (2), Śmigły, Kucharz, Żołd | Kamuflaż, Kucharz, Najemnik, Odporność na magię (2), Rabuś, Rewelator, Śmigły | changed |
| Zwadźca | startingEquipment | no Miecz | PDF adds a miecz | changed (added Miecz) |
| Zwadźca | startingEquipment | Płaszcz (puklerz) | płaszcz z Estalii | decision needed (item rename) |
| Zwadźca | rules | Szermierz, Zabójczy cios, Kult miecza & walki | Najemnik, Niezłomny, Szermierz, Zabójczy cios, Zawadiaka | changed (Zawadiaka has no rule text in the app) |
| Zwiadowca | rules | (no Najemnik, W nogi!) | + Najemnik, W nogi! | changed |

No differences for Czarny Ork or Grzybowar.

Not modelled in the app, so not changed:
- DOSTĘPNOŚĆ (availability roll).
- The rule that a dwarf mercenary's pay doubles when the band has an Elf (Goniec, Pogromca Trolli, Poszukiwacz złota).
- The "never joins a band with a DUCHOWNY / MAG" restrictions (Czarownica, Hiena cmentarna, Trefniś, Wróżbita, Łowca czarownic).

Saved rosters: mercenary data is re-created from the catalog, so the typo fixes (Pisolet, Piekelnik) are safe. A saved Bombardier or Kanonier with "Piekelnik" selected just loses that choice name.

## 2. Postaci dramatu (`15b_postaci_dramatu.txt`)

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Postaci dramatu (whole chapter) | data | not represented | 48 special characters plus Powóz piwny (Abdul Alhazred, Albrecht Waldner, Arca Chaotis, Ärgera Zorngottes, Barney, Błędny ognik, Brokk Tryggson, Caradryan, Drezyna bojowa snotlingów, Durgaluk Krzywousty, Festus Medyk, Grukk Treboosh, Hans Wasser, Hash-Ashin, Johann Schweinepulver, Kayanora Nocna Ćma, Khalida Neferher, Kheelk Lepkopalcy, Klaus Reinwald, Książę Złodziei, Lisaart, Ludwig Schwarzhelm, Luxuria, Meduza, Monstrum Meistera Bergholtza, O-Sayumi, Ostrze Cienia, Podarge Czerwona, Ramhotep Wizjoner, Relikwiarz Graala, Ruben van Dijk, Rycerz Śmierci, Sarutori Hanzo, Scyla Anfingrimm, Silevran, Solveig Rothaarige, Tehenhauin, Tiktaq'to, Truagg Trzypalce, Ulther Harginsson, Vilitch Przeklęty, Xǔwen, Wilhelm Schwarz, Wolfgar Rzeźnik, Wulfryk Wędrowiec, Victor Strain, Yavandir Aravar, Zhatan Czarny) | decision needed (not added, per instructions; only a "Drezyna Bojowa Snotlingów" rule text exists) |

## 3. Magic (chapter 22) — spell lists (`Magic.js` / new `PdfMagic.js`)

**Structural change in the PDF.** The rulebook now has a common list, MAGIA POWSZECHNA:
- 1-2 Magiczne żądło (5+)
- 3 Wiedźmi lot (7+)
- 4 Pancerz eteru (7+, pozostaje w grze)
- 5 Ręka młot (8+, pozostaje w grze)
- 6 Zionięcie (10+)

Each tradition or domain now has only six spells of its own, numbered 7-12. The rules say: "Zaklęcia na listach zaklęć ponumerowano od 1 do 12… rzut 2K6 … na liście zaklęć magii powszechnej lub praktykowanej… dziedziny". The old app lists were 11 lore-specific spells (1-2 to 12) from the docx. Many of those spells no longer exist, and many casting values changed.

How it was applied: each lore in the app now shows the five common spells (1-6) followed by its six PDF spells (7-12). That is 11 entries, as before. The UI can only show one list per caster, so the common spells are repeated in every lore.
- The data is in the new file `src/Data.js/PdfMagic.js`, generated from the PDF text. Spacing was repaired from a second extraction, flavour (italic) text was dropped, and mechanics are verbatim.
- `Magic.js` spreads it last (`...pdfMagic`), the same pattern as the existing `...rulebookMagic`.
- The old lore entries still in `Magic.js` are now overridden dead data and can be deleted later.

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| All 33 spell lores | spell list | 11 lore spells per lore (docx) | Magia powszechna 1-6 + 6 lore spells 7-12 | changed |
| Tradycja Bestii | spells 7-12 | Władca bestii (auto), Rączy jeleń, Skrzydła sokoła, Szpony orła, Skóra dzika, Klątwa Ghur, Tchnienie Ghur, Uczta kruków, Zbroja Ghur, Ostrze Ghur, Gniew niedźwiedzia | Władca bestii (przed rozgrywką), Rączy jeleń 7+, Skóra dzika 9+, Klątwa Ghur 10+, Uczta kruków 11+, Dzika postać Wissana 13+ (new) | changed |
| Tradycja Cienia | spells | 11 (incl. Klątwa tańca rozpaczy, Skrzydła/Sztylety z cienia, Taniec cieni, Zbroja/Ostrze Ulgu) | Sobowtór, Całun niewidzialności 8+ (new), Widmowy ruch 9+, Klątwa Ulgu 10+, Zamęt Ulgu 13+ (was 11+), Negacja ataku 15+ | changed |
| Tradycja Metalu | spells | 11 | Kuźnia Chamonu, Klątwa ołowiu 7+, Metoda prób & błędów 9+, Klątwa Chamon 10+, Srebrzyste strzały Arha 12+ (was 11+), Duch kuźni 14+ | changed |
| Tradycja Niebios | spells | 11 | Zwiastun przyszłości, Szafirowy portal 7+, Błyskawica 7+, Klątwa Azyr 10+, Piorun Uranona 11+, Klątwa fatum 15+ | changed |
| Tradycja Ognia | spells | 11 | Gorejący miecz Rhuin, Płomienna klątwa 7+, Ogień U'Zhul 7+, Tchnienie Aqshy 11+, Ognista kula 11+, Ogniste odrodzenie feniksa 14+ | changed |
| Tradycja Śmierci | spells | 11 (Śmiech żniwiarza was 7+) | Śmiech żniwiarza (przed rozgrywką), Posłaniec śmierci 7+, Klątwa Shyish 10+, Krąg śmierci 11+, Kosa żniwiarza 11+, Klątwa czarnego humoru 13+ | changed |
| Tradycja Światła | spells | 11 (incl. Sieć Amynthoka) | Jasność umysłu, Płonące wejrzenie 7+, Klątwa Amynthoka 9+ (new name), Ochrona Pha 11+, Kolumna światłości 11+, Święta tarcza Ignatusa 15+ | changed |
| Tradycja Życia | spells | 11 | Uzdrowienie, Wrota ziemi 7+, Zwierciadło bólu 9+, Klątwa Ghyran 10+, Grad kamieni 11+, Dar życia 14+ | changed |
| Tradycja Lodu | spells | 11 | Egida Miski, Tarcza Miski 8+, Zawodzący wiatr 9+, Klątwa Miski 10+, Lodowy wiatr 11+, Gniew Ursuna 13+ | changed |
| Tradycja Yin / Yang | spells | 6 (docx; the Terakotowy żołnierz text had copied wolf data and a prose profile) | 5 common + the same 6 spells; PDF text with corrected Terakotowy żołnierz profile; Stąpanie poza czasem text now present (was empty) | changed (supersedes the docx-era "Dao spell text" note in army-data-audit.md, because the PDF now supplies the text) |
| Magia Żywiołów | spells | 11 | Pierwsze życzenie Ibn Jellaba (przed rozgrywką, was auto), Wrota Dao 7+, Miraż Maridy 9+, Drugie życzenie Al Muktara 10+, Pięść Maridy 11+, Trzecie życzenie sułtana Jaffara 15+ | changed |
| Magia Asrai | spells | 11 | Ukryta ścieżka 5+, Plemię półmroku 7+, Widmowy ruch 9+, Klątwa kniei 10+, Ptaki ciernistych krzewów 11+, Furia kniei 13+ | changed |
| Wysoka Magia | spells | 11 | Szafirowy portal 7+, Wyssanie magii 6+, Tarcza Saphery 9+, Klątwa Qhaysh 10+, Ogień feniksa 11+, Płomienie Qhaysh 12+ | changed |
| Mroczna Magia | spells | 11 | Piekielny wrzask 8+, Potęga mroku 6+, Fantasmagoria 10+, Klątwa Pana Węży 10+, Sectumsempra 11+ (new), Poświęcenie 12+ | changed |
| Magia Ognistej Paszczy | spells | 11 | Ognista paszcza, Wrota Trzewiodołu, Płomienna klątwa (7+), Skóra nosorożnika 9+, Tchnienie Trzewiodołu 11+, Klątwa Trzewiodołu 15+ | changed |
| Magia Demonów | spells | 11 (Mgła 7+) | Mgielny opar 6+ (renamed), Piekielny wrzask 8+, Pandemonium 9+, Klątwa mroku 10+, Oko ciemności 11+, Stworzenia mgły 15+ (new) | changed |
| Dziedzina Chaosu Niepodzielonego | spells | 11 | PDF "Dziedzina Chaosu": Cięta riposta 6+, Wizja męki 6+, Paląca krew 7+, Klątwa Ducha Chaosu 10+, Łańcuchy męki 11+, Sztorm Chaosu 13+ (new) | changed |
| Dziedzina Chaosu | lore | missing (Grasanci, Karnawał and Zwierzoludzie use "Mag (Dziedzina Chaosu)" and showed no spells) | same list as above | added (data key + `getMagicLore` path) |
| Dziedzina Nurgla | spells | 11 | Wyborne wrzody, Doskonała limfa, Wyśmienite czyraki, Klątwa Nurgla, Przednia zgnilizna, Klątwa czarnego humoru 13+ | changed |
| Dziedzina Slaanesha | spells | 11 | Błoga agonia, Klątwa tańca rozkoszy, Cudowne męki, Piekielny krzyk 11+, Pieszczota Slaanesha, Zachwycające spazmy 15+ (was 12+) | changed |
| Dziedzina Tzeentcha | spells | 11 | Wewnętrzny ogień, Pomarańczowy ogień, Pandemonium, Ogniste tchnienie, Różowy ogień, Pokusa Tzeentcha 15+ (was 12+) | changed |
| Dziedzina Hashuta | spells | 11 | Wola Hashuta, Byczy pęd, Wezwanie mocy, Tchnienie Ojca Ciemności, Ogień Hashuta, Poświecenie 12+ | changed |
| Dziedzina Dziczy | spells | 11 | Władca bestii, Zwierzęcy pęd, Skóra razorgora, Klątwa dziczy, Chmara insektów, Zew zdrady 13+ (new) | changed |
| Dziedzina Nekromancji | spells | 11 | Inwokacja Nehek, Eteryczna iskra, Zew Vanhela, Klątwa starości, Wskrzeszenie, Cielesna eksplozja | changed |
| Dziedzina Nehekary | spells | 11 | Inkantacja Khepry, Usiriana, Khsara, Usekpha, Sakhmety, Soktha | changed |
| Tradycja Skrytości | spells | 11 | Rozmycie postaci, Spaczportal, Oddech śmierci, Widmowy marsz, Klątwa skrytobójcy, Tarcza skrytobójców | changed |
| Tradycja Spaczmagii | spells | 11 | Potęga spaczmagii, Spaczportal, Spaczbłyskawica, Klątwa niemocy, Tchnienie śmierci, Burza spaczbłyskawic 13+, **13** Apoklęstwo 13+ | changed; see the decision row below |
| Tradycja Zarazy | spells | 11 | Wola Rogatego Szczura, Plugawa witalność, Potęga Rogatego Szczura, Klątwa Rogatego Szczura, Tchnienie zarazy, Klątwa fatum 12+ | changed |
| Dziedzina Boga-Pajonka | spells | 11 | Władca pajonków, Goblin-pajonk (new), Chitynowa skóra, Klontwa Boga-Pajonka, Tchnienie pajonka, Wybraniec Boga-Pajonka (new) | changed |
| Magia Małego / Dużego Łooomotu! | spells | 11 each | 6 each, per the PDF sub-lists | changed |
| Magia Pradawnych | spells | 11 | Wyssanie magii, Gwiezdny portal, Trzecie proroctwo, Klątwa Qhaysh, Ogień salamandry, Ogniste odrodzenie salamandry | changed |
| ArmyData.test.js "Dao resolves…" | test | expects 6 Yin/Yang spells | 11 (5 common + 6) | changed (test updated) |
| Tradycja Spaczmagii | numbering | — | PDF lists 7 own spells numbered 7-13; "13 Apoklęstwo" cannot be rolled on 2K6 | decision needed (PDF inconsistent; both kept as printed) |
| Tradycja Yin, 8 Uśpienie smoczego oddechu | text | — | the mechanic says "w czasie trwania Wyssania Magii" (copied from Wyssanie magii) | decision needed (looks copy-pasted; kept as printed) |
| Tradycja Yin, 12 Cień zapomnienia | text | — | the text starts "Negacja ataku jest zaklęciem wyjątkowym…" (copied from Tradycja Cienia) | decision needed (kept as printed) |
| Magia Runiczna (PDF p. 581+) | lore | not in app | runic magic for Kowal run | decision needed (not modelled; out of scope) |

### Lore names (`getMagicLore.js`)
Lores were not renamed. Two additive fixes were made: "Dziedzina Chaosu" was added to the path list (before "…Niepodzielonego", so that lore still wins for Duch Chaosu), and the band rule spelling "Dziedzina Boga Pajonka" is now normalised to "Dziedzina Boga-Pajonka". Before this, the Leśne Gobliny shaman never resolved to a lore.

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Dziedzina Chaosu Niepodzielonego | lore name | Dziedzina Chaosu Niepodzielonego (Kult Ducha Chaosu) | DZIEDZINA CHAOSU | decision needed (rename; the content is now identical to the new "Dziedzina Chaosu" key) |
| Dziedzina Nehekary | lore name | Dziedzina Nehekary | DOMENA NEHEKHARY | decision needed (rename; "Domena Nehekhary" already maps to it) |
| Dziedzina Nekromancji | lore name | Dziedzina Nekromancji | NEKROMANCJA (section heading) | decision needed (rename) |
| Leśne Gobliny shaman rule | rule | Mag (Dziedzina Boga Pajonka) | DZIEDZINA BOGA-PAJONKA | decision needed (band rule label; lookup fixed in getMagicLore) |
| Unused paths | getMagicLore | "Spaczmagia", "Magia Chaosu" in PATHS_OF_MAGIC have no data | — | decision needed (harmless leftovers) |

### Coordinator items
| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Zwierzoludzie / Szaman | lore | "Mag (Dziedzina Chaosu …)" showed no spells (no such key) | Dziedzina Chaosu | changed (key added, see above) |
| Zwierzoludzie / Szaman | equipmentList lores | Dziedzina Dziczy, Chaosu, Nurgla, Slaneesha, Tzeentcha | only Dziedzina Chaosu or Dziedzina Dziczy | decision needed (removing Nurgla, Slaneesha and Tzeentcha removes items; "Dziedzina Slaneesha" is also misspelt and never resolves) |
| Nehekhara / Licz | equipmentList | Tradycja Światła, Tradycja Śmierci | + Domena Nehekhary | added ("Domena Nehekhary": [0,4,"Choice"]; resolves via the existing mapping) |
| Muszkieterzy z Nuln / Magister Magii | lores | now Tradycja Metalu / Ognia only (bands-1) | ch. 22: MAG (Kolegia Magii) may pick any of the 8 colleges; the band page restricts him | decision needed (left as bands-1 set it; band page vs general rule) |

## 4. Caster gear and skills by tradition (`MageEquipmentList.js`)

Skill tables were read with `pdftotext -table` to get the column of each ♦.

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Tradycja Bestii | equipment | no Łuk długi | Łuk długi 20 zk | added |
| Tradycja Bestii | skills | [0,2,3,5] Walki, Akademickie, Siłowe, Specjalne | Walki, Strzeleckie, Akademickie, Specjalne [0,1,2,5] | changed |
| Magia Żywiołów | Broń miotana (noże) | 10 zk | 15 zk | changed |
| Tradycja Bestii … Życia | Broń miotana | "Broń miotana" | "Broń miotana (noże)" | no change (naming only) |

No differences for Cienia, Metalu, Niebios, Ognia, Śmierci, Światła or Życia (gear and skills match).

Information for the band agents (other lores' gear and skills live in band data). PDF skill tables:
- Lodu [0,2,3,5]
- Asrai [0,1,2,4,5]
- Wysoka [0,2,4,5]
- Mroczna (Wieszczka) [0,2,4,5]
- Ognista Paszcza (Ogniobrzuchy) [0,3,5]
- Domena Nehekhary (Licz) [0,2,5]
- Pradawni (Kapłan) [2,4,5]

The Domena Nehekhary gear list is Kostur 5, Chopesz 10, Sztylet 2, Włócznia 10, Broń miotana (noże) 10.

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Ogry / Ogniobrzuchy list | Cep bojowcy | "Cep bojowcy" | Cep bojowy | changed (typo; price unchanged, and the EquipmentStats alias keeps old saves readable) |
| Ogry / Rzeźnik list | Cep bojowcy | "Cep bojowcy" | Cep bojowy | changed (same) |
| HeroEquipment "Ogr" list (~line 2578) | Cep bojowcy | "Cep bojowcy" | — | not changed (a band's non-caster list; for the band agent) |

## 5. Prayers (chapter 23) and priests

All seven existing prayer lists (Mananna, Morra, Myrmidii, Ranalda, Ulryka, Ursuna, Sigmara) were compared by script: titles, types and texts, after normalising whitespace, case and punctuation. **No differences.**

| Unit/item | Field | App (old) | PDF | Status |
| --- | --- | --- | --- | --- |
| Duchowny (Magia Jelit) | prayer list | missing (Ogry Rzeźnik has this rule and showed no prayers) | 7 prayers: Sok z demona … Jelita trolla górskiego | added (PdfMagic.js + getMagicLore path) |
| Duchowny (modlitwy do Vereny) | prayer list | missing | 7 prayers (Kapłan Vereny) | added (data and path only; no app unit uses it) |
| Kapłan Vereny prayers | heading | — | printed as "MODLITWY DO MANANNA" | decision needed (PDF copy-paste; stored as Vereny) |
| Piechota Morska z Marienburga / Kapłan | equipmentList | no Ciężki | Zbroja płytowa 30 zk (ch. 23 Mananna list; the band page defers to ch. 23) | added |
| Piraci z Sartosy / Kapłan | equipmentList | no Ciężki | Zbroja płytowa 30 zk | added |
| Marienburg and Piraci / Kapłan | equipmentList | Hełm 5 | not in the ch. 23 Mananna list | decision needed (item removal) |
| Prezbiter Sigmara (all bands) | rules | Przepastne trzewia | the PDF also lists PRZEPASTNE TRZEWIA | decision needed (matches the PDF, but looks copied from the Rzeźnik) |
| Ogry / Rzeźnik (ogr) | rules | includes Wielkolud | the ch. 23 profile has no WIELKOLUD | decision needed (band data; the band page may differ) |

Priest lists, starting gear, stats (both rows) and skill tables match chapter 23 for:
- Bractwo (all 7 priests)
- Gang przemytników
- Cyrkowcy
- Psy Wojny
- Kislev
- Middenheim (hammer kept per the owner's decision)
- the Sigmar Prezbiters of Averland, Nuln, Ostland, Reikland, Siostry and Łowcy
- Ogry Rzeźnik

PDF skill tables:
- Mananna [0,2,3,5]
- Morra [0,2,4,5]
- Myrmidii [0,2,4,5]
- Ranalda [0,2,4,5]
- Ulryka [0,2,3,5]
- Ursuna [0,2,3,5]
- Vereny [0,2,5]
- Sigmara [0,2,3,5]
- Rzeźnik [0,3,5]

## Test run
`CI=true npx react-scripts test --watchAll=false`: Test Suites: 5 passed, 5 total; Tests: 193 passed, 193 total.
