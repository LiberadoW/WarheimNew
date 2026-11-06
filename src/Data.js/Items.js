// Item descriptions, checked against ROZDZIAŁ 14: EKWIPUNEK of the rulebook
// PDF (AD2026.04.15, pages 426-448). Weapons and armour that have a profile in
// EquipmentStats.js show that profile instead; the texts below are the
// fallback and the only description for special equipment, mounts and
// band-specific gear.
export const items = {
  // Broń do walki wręcz
  Bagnet:
    "Drzewcowa, ogłuszający, parowanie, uderza jako pierwszy, wymaga obu rąk, zasięgowa. Bagnet przytwierdza się do muszkietu dowolnego rodzaju.",
  Bicz: "Broń ręczna, szybki, uderza jako pierwszy, zasięgowa.",
  Bosak:
    "Premia +1 do SIŁY, drzewcowa, uderza jako pierwszy, wymaga obu rąk, zasięgowa.",
  "Broń wielka": "Premia +2 do SIŁY, uderza jako ostatni, wymaga obu rąk.",
  "Buława/Maczuga/Młot bojowy": "Broń ręczna, ogłuszający.",
  "Cep bojowy":
    "Premia +1 do SIŁY w pierwszej turze każdej walki wręcz, korbacz, przebicie pancerza, wymaga obu rąk.",
  Chopesz: "Broń ręczna, parowanie, szybki.",
  Katana: "Broń ręczna, parowanie, szybki.",
  Draich:
    "Premia +1 do SIŁY, limitowany (3), parowanie, precyzyjne uderzenie, przebicie pancerza, wymaga obu rąk.",
  "Duża dźgacz":
    "Premia +2 do SIŁY w czasie szarży, drzewcowa, limitowany (1), uderza jako pierwszy, zasięgowa. Szarżująca drużyna dużych dźgaczy podlega zasadzie specjalnej BYCZA SZARŻA, a każda niewybroniona rana powoduje utratę K3 punktów ŻYWOTNOŚCI. Tylko dla modeli z zasadą specjalną DUŻA DŹGACZ.",
  "Gwiazda zaranna": "Broń ręczna, przebicie pancerza.",
  Halabarda:
    "Premia +1 do SIŁY, drzewcowa, wymaga obu rąk, zasięgowa. Model z halabardą używający broni dystansowej (prochowej) ignoruje zasadę WYMAGA FORKIETU i podlega zasadzie PEWNY STRZAŁ.",
  "Kadzielnica ognia":
    "Premia +1 do SIŁY, korbacz, limitowany (3), płonący atak, przebicie pancerza, wymaga obu rąk. Jeżeli model zostanie Oszołomiony!, Powalony na ziemię! lub Wyłączony z akcji!, broń gaśnie i do końca potyczki jest traktowana jak cep bojowy.",
  "Kadzielnica zarazy":
    "Premia +1 do SIŁY w pierwszej turze każdej walki wręcz, korbacz, limitowany (1), przebicie pancerza, siewca zarazy, wymaga obu rąk. Jeżeli model zostanie Oszołomiony!, Powalony na ziemię! lub Wyłączony z akcji!, broń gaśnie i do końca potyczki jest traktowana jak cep bojowy.",
  "Karwasz bojowy": "Broń ręczna, parowanie, wyważony.",
  Khutar: "Broń ręczna, łamacz, parowanie, wspinaczka, wyważony.",
  "Wachlarz bojowy": "Broń ręczna, łamacz, parowanie, wspinaczka, wyważony.",
  Kopia:
    "Tylko kawaleria. Premia +2 do SIŁY w czasie szarży, drzewcowa, uderza jako pierwszy, zasięgowa.",
  Korbacz: "Korbacz, przebicie pancerza, szybki.",
  Kosa: "Premia +1 do SIŁY, szybki, uderza jako pierwszy, wymaga obu rąk.",
  Kostur: "Drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa.",
  "Kostur Rykowca":
    "Na początku każdej fazy walki wręcz model wybiera styl. Styl ofensywny: premia +2 do SIŁY, drzewcowa, uderza jako ostatni, wymaga obu rąk, zasięgowa. Styl defensywny: ogłuszający, parowanie, wymaga obu rąk, zasięgowa, a model otrzymuje w czasie walki wręcz kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza. Dostępny wyłącznie dla MAGÓW służących w Zbrojnym stadzie Zwierzoludzi.",
  Łamacz: "Broń ręczna, łamacz, parowanie, wyważony.",
  "Łamacz mieczy": "Broń ręczna, łamacz, parowanie, wyważony.",
  Łapacz:
    "Drzewcowa, limitowany (3), unieruchamiający, uderza jako ostatni, wymaga obu rąk, zasięgowa.",
  "Maczuga ogrów": "Broń ręczna, ogłuszający, przebicie pancerza.",
  Miecz: "Broń ręczna, parowanie.",
  Mizerykordia: "Broń ręczna, cios łaski, lekki, wyważony.",
  "Młot ulrykański": "Premia +1 do SIŁY, przebicie pancerza, wymaga obu rąk.",
  Pika: "Tylko piechota. Premia +1 do SIŁY w pierwszej turze każdej walki wręcz, drzewcowa, wymaga obu rąk, zasięgowa. Model, który użyje piki w reakcji na szarżę – trzymać pozycję przeciwko modelowi z zasadą DUŻY CEL, POTWÓR lub WIELKOLUD, uderza jako pierwszy. Model z piką stojący bezpośrednio za innym walczącym modelem z piką może atakować i być atakowany.",
  Rapier: "Broń ręczna, lekki, parowanie, precyzyjne uderzenie.",
  Rembak:
    "Premia +1 do SIŁY w pierwszej turze każdej walki wręcz, broń ręczna.",
  Saearath:
    "Limitowany (3). Na początku każdej fazy walki wręcz model wybiera styl. Styl ofensywny: drzewcowa, uderza jako pierwszy, wymaga obu rąk, zasięgowa, a model walczy tak, jakby miał dwie bronie z zasadą BROŃ RĘCZNA. Styl defensywny: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa, a model otrzymuje w czasie walki wręcz kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza.",
  Spaczhalabarda:
    "Premia +1 do SIŁY, druzgoczący, drzewcowa, eksperymentalny, limitowany (3), przebicie pancerza, wymaga obu rąk, zasięgowa. Model używający broni dystansowej (prochowej) ignoruje zasadę WYMAGA FORKIETU i podlega zasadzie PEWNY STRZAŁ.",
  Spaczkhutar:
    "Premia +1 do SIŁY, broń ręczna, limitowany (3), łamacz, parowanie, wspinaczka, wyważony, zatruty atak.",
  Sztylet: "Broń ręczna, lekki, nie zadaje zranień krytycznych.",
  "Topór bojowy/Nadziak": "Broń ręczna, przebicie pancerza.",
  "Topór z Chrace":
    "Premia +2 do SIŁY, druzgoczący, limitowany (3), uderza jako ostatni, wymaga obu rąk.",
  "Topór krasnoludów": "Broń ręczna, parowanie, przebicie pancerza.",
  Trójząb:
    "Drzewcowa, łamacz, parowanie, uderza jako pierwszy, wymaga obu rąk, zasięgowa.",
  Wakizashi: "Broń ręczna, cios łaski, lekki, wyważony.",
  "Broń improwizowana":
    "Walka wręcz: lekki, uderza jako ostatni; zranienie krytyczne: brak. Jako broń dystansowa: MAKSYMALNY ZASIĘG: 6”; SIŁA: użytkownika; ZASADY: broń miotana, lekki; nie można jej użyć w reakcji na szarżę stać & strzelać.",

  // Broń dystansowa (nieprochowa)
  Arkan:
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: - ; ZASADY: limitowany (3), unieruchamiający. Bez kar za daleki zasięg i strzał po ruchu.",
  Bolas:
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: - ; ZASADY: limitowany (3), unieruchamiający. Bez kar za daleki zasięg i strzał po ruchu.",
  Sieć: "MAKSYMALNY ZASIĘG: 8”; SIŁA: - ; ZASADY: limitowany (3), unieruchamiający. Bez kar za daleki zasięg i strzał po ruchu.",
  "Broń miotana (noże)":
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: użytkownika; ZASADY: broń miotana.",
  "Broń miotana (młoty/topory)":
    "MAKSYMALNY ZASIĘG: 6”; SIŁA: użytkownika; ZASADY: broń miotana, premia +1 do SIŁY.",
  Dmuchawka:
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: 3; ZASADY: broń miotana, mistrz skrytobójstwa, przebicie pancerza, zatruty atak; nie zadaje zranień krytycznych.",
  Harpun:
    "MAKSYMALNY ZASIĘG: 16”; SIŁA: 5; ZASADY: limitowany (1), przebicie pancerza, wymaga przygotowania (2), wymaga obu rąk. Tylko dla modeli z zasadą WIELKOLUD lub DRUŻYNA CIĘŻKICH BRONI (harpun).",
  "Kula trującego wichru":
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: - ; ZASADY: broń miotana, limitowany (1). Trafione modele pod 3” wzornikiem muszą zdać test WT albo zostają Powalone na ziemię!.",
  Kusza:
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: 4; ZASADY: przebicie pancerza, ruch albo strzał, wymaga obu rąk.",
  "Kusza powtarzalna":
    "MAKSYMALNY ZASIĘG: 18”; SIŁA: 3; ZASADY: wielokrotny strzał (2), przebicie pancerza, wymaga obu rąk.",
  "Łuk długi":
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: 3 (daleki zasięg) / 4 (krótki zasięg); ZASADY: wymaga obu rąk.",
  "Łuk elfów":
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: 3 (daleki zasięg) / 4 (krótki zasięg); ZASADY: przebicie pancerza, wymaga obu rąk.",
  "Łuk krótki":
    "MAKSYMALNY ZASIĘG: 12”; SIŁA: 3; ZASADY: wymaga obu rąk. Bez kary za strzał po ruchu.",
  Łuk: "MAKSYMALNY ZASIĘG: 18”; SIŁA: 3; ZASADY: wymaga obu rąk.",
  Oszczep: "MAKSYMALNY ZASIĘG: 12”; SIŁA: użytkownika; ZASADY: broń miotana.",
  "Pistolet strzałkowy":
    "MAKSYMALNY ZASIĘG: 10”; SIŁA: 4; ZASADY: bezpośredni strzał, broń miotana, może zawsze stać & strzelać.",
  "Pistolet strzałkowy powtarzalny":
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: 3; ZASADY: wielokrotny strzał (2), może zawsze stać & strzelać. Bez kar za daleki zasięg i strzał po ruchu.",
  Proca:
    "MAKSYMALNY ZASIĘG: 12”; SIŁA: 3; ZASADY: wielokrotny strzał (2) we wroga w zasięgu 6”.",
  "Wnyk łańcuchowy":
    "MAKSYMALNY ZASIĘG: 10”; SIŁA: K6; ZASADY: limitowany (1), przebicie pancerza.",

  // Broń dystansowa (prochowa)
  Arkebuz:
    "MAKSYMALNY ZASIĘG: 48”; SIŁA: 5 (daleki zasięg) / 6 (krótki zasięg); ZASADY: limitowany (1), przebicie pancerza, ruch albo strzał, wymaga forkietu, wymaga obu rąk, wymaga przygotowania, zawodny.",
  "Broń miotana (ładunki wybuchowe)":
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: K6; ZASADY: broń miotana, płonący atak, zawodny.",
  Falkonet:
    "MAKSYMALNY ZASIĘG: wzornik płomienia; SIŁA: 4; ZASADY: limitowany (1), odłamkowy, przebicie pancerza, ruch albo strzał, wymaga forkietu, wymaga obu rąk, wymaga przygotowania (3), zawodny.",
  Garłacz:
    "MAKSYMALNY ZASIĘG: wzornik płomienia; SIŁA: 3; ZASADY: limitowany (3), odłamkowy, ruch albo strzał, wymaga obu rąk, wymaga przygotowania (2), zawodny.",
  "Gołąb bombardujący":
    "MAKSYMALNY ZASIĘG: 16”; SIŁA: K6; ZASADY: limitowany (3), płonący atak, ruch albo strzał, zawodny.",
  "Granat dymny": "MAKSYMALNY ZASIĘG: 8”; SIŁA: - ; ZASADY: broń miotana.",
  Granatnik:
    "MAKSYMALNY ZASIĘG: 16”; SIŁA: 6; ZASADY: limitowany (1), przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny.",
  Kulomiot:
    "MAKSYMALNY ZASIĘG: wzornik płomienia; SIŁA: K6; ZASADY: eksperymentalny, limitowany (1), przebicie pancerza.",
  "Miotacz spaczognia":
    "MAKSYMALNY ZASIĘG: Kostka Artyleryjska; SIŁA: K6 (OBRAŻENIA: K3); ZASADY: eksperymentalny, limitowany (1), płonący atak. Trafienia bez możliwości skorzystania z Ochrony Pancerza.",
  "Moździerz trującego wichru":
    "MAKSYMALNY ZASIĘG: 8” - 36”; SIŁA: -; ZASADY: limitowany (1).",
  Muszkiet:
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: 4 (daleki zasięg) / 5 (krótki zasięg); ZASADY: przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny. W walce wręcz: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa.",
  "Muszkiet dubeltowy":
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: 4 (daleki zasięg) / 5 (krótki zasięg); ZASADY: limitowany (3), przebicie pancerza, ruch albo strzał, wielokrotny strzał (2), wymaga obu rąk, wymaga przygotowania, zawodny. W walce wręcz: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa.",
  "Muszkiet hochlandzki":
    "MAKSYMALNY ZASIĘG: 36”; SIŁA: 4 (daleki zasięg) / 5 (krótki zasięg); ZASADY: limitowany (1), mistrzowskie wykonanie, przebicie pancerza, ruch albo strzał, strzelec wyborowy, wymaga obu rąk, wymaga przygotowania, zawodny. W walce wręcz: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa.",
  "Muszkiet krasnoludzki":
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: 4 (daleki zasięg) / 5 (krótki zasięg); ZASADY: mistrzowskie wykonanie, przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny. W walce wręcz: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa.",
  Ołowiomiotacz:
    "MAKSYMALNY ZASIĘG: wzornik płomienia; SIŁA: 4; ZASADY: limitowany (1), przebicie pancerza, wymaga obu rąk, wymaga przygotowania (3). WIELKOLUD używa ołowiomiotacza w walce wręcz jako broni wielkiej.",
  Pistolet:
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: 4; ZASADY: bezpośredni strzał, broń miotana, może zawsze stać & strzelać, przebicie pancerza, wymaga przygotowania, zawodny. W walce wręcz: broń ręczna, ogłuszający.",
  "Pistolet dubeltowy":
    "MAKSYMALNY ZASIĘG: 8”; SIŁA: 4; ZASADY: bezpośredni strzał, broń miotana, może zawsze stać & strzelać, limitowany (4), przebicie pancerza, wielokrotny strzał (2), wymaga przygotowania, zawodny. W walce wręcz: broń ręczna, ogłuszający.",
  "Pistolet pojedynkowy":
    "MAKSYMALNY ZASIĘG: 12”; SIŁA: 4; ZASADY: bezpośredni strzał, broń miotana, limitowany (4), mistrzowskie wykonanie, może zawsze stać & strzelać, przebicie pancerza, wymaga przygotowania, zawodny. W walce wręcz: broń ręczna, ogłuszający.",
  Revolvera:
    "MAKSYMALNY ZASIĘG: 18”; SIŁA: 4; ZASADY: limitowany (1), ruch albo strzał, wielokrotny strzał (6), wymaga obu rąk, wymaga przygotowania, zawodny.",
  Spaczmuszkiet:
    "MAKSYMALNY ZASIĘG: 24”; SIŁA: K6 (daleki zasięg) / K6 z zasadą druzgoczący (krótki zasięg); ZASADY: eksperymentalny, przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny. W walce wręcz: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa.",
  Spaczpistolet:
    "MAKSYMALNY ZASIĘG: 8+K6”; SIŁA: K6; ZASADY: bezpośredni strzał, broń miotana, eksperymentalny, limitowany (4), może zawsze stać & strzelać, przebicie pancerza, wymaga przygotowania, zawodny. W walce wręcz: broń ręczna, ogłuszający.",
  Spaczrusznica:
    "MAKSYMALNY ZASIĘG: 48”; SIŁA: K6 bez możliwości skorzystania z Ochrony Pancerza; ZASADY: eksperymentalny, limitowany (1), strzelec wyborowy, wymaga forkietu, wymaga obu rąk, zawodny. Drużyna spaczrusznicy to dwa modele: strzelec i model z pawężą.",

  // Pancerze
  Lekki: "Pancerz skórzany/ćwiekowany. Model odziany w LEKKI PANCERZ otrzymuje Ochronę Pancerza na 6+.",
  Średni: "Pancerz kolczy/zbroja łuskowa. Model odziany w ŚREDNI PANCERZ otrzymuje Ochronę Pancerza na 5+.",
  Ciężki: "Zbroja płytowa. Model odziany w CIĘŻKI PANCERZ otrzymuje Ochronę Pancerza na 4+.",
  Hełm: "Model, który chroni głowę hełmem otrzymuje rzut ochronny 4+ przeciwko efektom Powalenia na ziemię!. Jeżeli rzut zakończy się sukcesem, postać należy traktować jako Oszołomioną!.",
  Tarcza:
    "Model dzierżący TARCZĘ otrzymuje kumulatywny modyfikator +1 do Ochrony Pancerza lub Ochronę Pancerza na 6+, jeśli nie posiada pancerza. Model z dwiema chwytnymi kończynami używający broni z zasadą WYMAGA OBU RĄK nie korzysta w walce wręcz z Ochrony Pancerza tarczy. Model z tarczą nie korzysta z PAROWANIA puklerza.",
  Puklerz:
    "Puklerz posiada zasadę specjalną PAROWANIE. Model z dwiema chwytnymi kończynami używający broni z zasadą WYMAGA OBU RĄK nie może używać puklerza w walce wręcz. Model z puklerzem nie korzysta z Ochrony Pancerza tarczy.",
  "Pancerz z Gromrilu":
    "Ciężki pancerz. Model odziany w PANCERZ Z GROMRILU otrzymuje Ochronę Pancerza na 3+. Wobec modelu odzianego w pancerz z gromrilu nie stosuje się zasady specjalnej PRZEBICIE PANCERZA.",
  "Pancerz z Ithilmaru":
    "Ciężki pancerz. Model odziany w PANCERZ Z ITHILMARU ignoruje efekty TABELI WPŁYW PANCERZA za noszenie CIĘŻKIEGO PANCERZA.",
  "Zbroja Chaosu":
    "Ciężki pancerz. Model odziany w Zbroję Chaosu otrzymuje Ochronę Pancerza na 3+ i ignoruje efekty noszenia CIĘŻKIEGO PANCERZA, a MAG w tej zbroi może rzucać zaklęcia. Raz założonej zbroi nie można zdjąć (także w wyniku GRABIEŻY lub OGRABIENIA). Po każdej rozgrywce bohater w Zbroi Chaosu wykonuje test CP; nieudany test oznacza wylosowanie Stygmatu Mrocznej Potęgi, której służy.",
  Pawęża:
    "Pawęża. Model wyekwipowany w pawężę na potrzeby rzutów na trafienie z broni dystansowej traktowany jest tak, jakby znajdował się za osłoną ciężką, a używając broni dystansowej (prochowej) ignoruje zasadę WYMAGA FORKIETU i podlega zasadzie PEWNY STRZAŁ. W każdej fazie walki wręcz model traktowany jest tak, jakby bronił przeszkody. Sprzymierzony DUŻY CEL w odległości do 1” za pawężą nie może być ostrzelany, jeśli nie jest najbliższym celem, i wróg nie otrzymuje premii +1 za strzelanie do DUŻEGO CELU. Model z pawężą nie może biegać, korzystać z LOTU, z Ochrony Pancerza tarczy ani z puklerza.",

  // Ekwipunek specjalny
  "Siodło & uprząż":
    "KAWALERZYSTA dysponujący siodłem & uprzężą, na potrzeby testu jeździectwa otrzymuje kumulatywny modyfikator +1 do wartości testowanego współczynnika.",
  "Mechaniczne skrzydła":
    "Model wielkości człowieka lub mniejszy (nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej) wyposażony w mechaniczne skrzydła podlega zasadzie specjalnej LOT. Limitowany (3). Dostępne wyłącznie dla kompanii Psy Wojny, Amazonki z Lustrii, Klan wojowników z Nipponu i Szkutnicy z Barak Varr.",
  "Płaszcz z łusek smoka":
    "Model wyekwipowany w płaszcz z łusek smoka otrzymuje Magiczną Ochronę na 4+ przeciwko PŁONĄCYM ATAKOM oraz kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza. Postać nie może używać naraz więcej niż jednego płaszcza. Dostępny wyłącznie dla modeli z zasadą specjalną SMOKOBÓJCA.",
  "Płaszcz z Estalii":
    "Model wyekwipowany w płaszcz z Estalii oraz podlegający zasadzie specjalnej PAROWANIE otrzymuje kumulatywny modyfikator +1 do rzutu na parowanie. Postać nie może używać naraz więcej niż jednego płaszcza. Dostępny wyłącznie dla modeli z zasadą specjalną ZAWADIAKA.",
  "Płaszcz z wilczej skóry":
    "Model wyekwipowany w płaszcz z wilczej skóry przeciwko atakom wykonanym bronią dystansową otrzymuje kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza. Postać nie może używać naraz więcej niż jednego płaszcza. Dostępny wyłącznie dla modeli z zasadą DUCHOWNI (modlitwy do Ulryka) oraz bohaterów z kompanii Zbrojni z Middenheim.",
  "Płaszcz ze skóry lwa":
    "Model wyekwipowany w płaszcz ze skóry lwa przeciwko atakom wykonanym bronią dystansową otrzymuje kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza. Postać nie może używać naraz więcej niż jednego płaszcza. Dostępny wyłącznie dla modeli z zasadą specjalną GWARDIA LWA.",
  Kropierz:
    "KAWALERZYSTA dosiadający WIERZCHOWCA bez zasady POTWÓR, wyekwipowanego w kropierz, otrzymuje kumulatywny modyfikator +1 do Ochrony Pancerza lub Ochronę Pancerza na 6+, jeśli nie posiada pancerza, ale nie może korzystać z zasady LEKKA JAZDA oraz RANGER; w trakcie szarży podlega zasadzie PRZEBICIE PANCERZA. WIERZCHOWIEC z zasadą POTWÓR w kropierzu otrzymuje +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza. WIERZCHOWIEC w kropierzu otrzymuje premię +1 do SIŁY TRAFIENIA Z UDERZENIA oraz zasady PRZEBICIE PANCERZA i UDERZA JAKO OSTATNI.",
  Kaganek:
    "Model z kagankiem otrzymuje kumulatywny modyfikator +2” do odległości, w jakiej wykrywa UKRYTE postacie, ale dopóki go używa, nie może się UKRYĆ. Kaganek może posłużyć jako improwizowana broń dystansowa z zasadą PŁONĄCY ATAK; zostaje wtedy zniszczony.",
  "Latarnia sztormowa":
    "Model z latarnią otrzymuje kumulatywny modyfikator +6” do odległości, w jakiej wykrywa UKRYTE postacie. Latarnia sztormowa (z kloszem i osłonami) nie odbiera modelowi możliwości UKRYCIA się. Latarnia może posłużyć jako improwizowana broń dystansowa z zasadą PŁONĄCY ATAK; zostaje wtedy zniszczona.",
  Luneta:
    "Model strzelający z kuszy, muszkietu, muszkietu dubeltowego, muszkietu hochlandzkiego, muszkietu krasnoludzkiego lub spaczmuszkietu wyposażonych w lunetę otrzymuje kumulatywny modyfikator +1 do rzutu na trafienie, podlega zasadzie STRZELEC WYBOROWY i potraja zasięg, w jakim wykrywa UKRYTE wrogie postacie.",
  "Karty Tarota":
    "Bohater posiadający talię kart tarota podlega zasadzie specjalnej TAROT oraz WZGARDZONY. Limitowany (1). Niedostępne dla drużyn, w których służą DUCHOWNI.",
  Bat: "Woźnica wyekwipowany w bat, na potrzeby testu powożenia otrzymuje kumulatywny modyfikator +1 do wartości testowanego współczynnika.",

  // Zwierzęta (wierzchowce)
  "Koń bojowy":
    "Wierzchowiec. SZ 8, WW 3, US 0, S 3, WT 3, ŻW 1, I 3, A 1, CP 5. Zasady specjalne: rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  Kuc: "Wierzchowiec. SZ 6, WW 2, US 0, S 4, WT 4, ŻW 1, I 2, A 1, CP 5. Zasady specjalne: rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  Dzik: "Wierzchowiec. SZ 7, WW 3, US 0, S 3, WT 4, ŻW 1, I 3, A 1, CP 3. Zasady specjalne: rączy, szarża dzików, wierzchowiec, zwierzę, zwierzę pociągowe. Twarda skóra: KAWALERZYSTA dosiadający dzika otrzymuje kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza.",
  "Jaskiniowy squig":
    "Wierzchowiec. SZ 3K6, WW 4, US 0, S 5, WT 3, ŻW 1, I 3, A 2, CP 3. Zasady specjalne: dzikie squigi, niezłomny, no tohooop!, wierzchowiec, zwierzę, zwierzę pociągowe.",
  "Nieumarły koń":
    "Wierzchowiec. SZ 8, WW 2, US 0, S 3, WT 3, ŻW 1, I 2, A 1, CP 4. Zasady specjalne: nieumarły, nieświadomy, rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  "Obmierzły pajonk":
    "Wierzchowiec. SZ 7, WW 3, US 0, S 3, WT 3, ŻW 1, I 4, A 1, CP 2. Zasady specjalne: broń naturalna (zatruty atak), łuskowata skóra (5+), murołaz, niezłomny, oplątanie, rączy, wierzchowiec, zwierzę. Twarda skóra: KAWALERZYSTA dosiadający obmierzłego pajonka otrzymuje kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza.",
  Rumak:
    "Wierzchowiec. SZ 8, WW 3, US 0, S 3, WT 3, ŻW 1, I 3, A 1, CP 5. Zasady specjalne: krzepki, rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  "Rumak chaosu":
    "Wierzchowiec. SZ 8, WW 3, US 0, S 4, WT 3, ŻW 1, I 3, A 1, CP 5. Zasady specjalne: krzepki, rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  "Rumak elfów":
    "Wierzchowiec. SZ 9, WW 3, US 0, S 3, WT 3, ŻW 1, I 4, A 1, CP 5. Zasady specjalne: rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  "Rumak Elfów":
    "Wierzchowiec. SZ 9, WW 3, US 0, S 3, WT 3, ŻW 1, I 4, A 1, CP 5. Zasady specjalne: rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  Terradon:
    "Wierzchowiec. SZ 2, WW 3, US 0, S 4, WT 4, ŻW 1, I 2, A 1, CP 3. Zasady specjalne: bombardowanie, łuskowata skóra (6+), lot, nadrzewni drapieżcy, przepastne trzewia, strach, trudny do zabicia, wierzchowiec, zimnokrwisty, zwierzę.",
  "Wielki wilk":
    "Wierzchowiec. SZ 9, WW 3, US 0, S 4, WT 3, ŻW 1, I 3, A 1, CP 3. Zasady specjalne: rączy, wierzchowiec, zwierzę, zwierzę pociągowe.",
  Zimnokrwisty:
    "Wierzchowiec. SZ 7, WW 3, US 0, S 4, WT 4, ŻW 1, I 2, A 1, CP 3. Zasady specjalne: broń naturalna (zatruty atak), głupota, łuskowata skóra (6+), rączy, strach, trudny do zabicia, wierzchowiec, zimnokrwisty, zwierzę, zwierzę pociągowe. Twarda skóra: KAWALERZYSTA dosiadający zimnokrwistego otrzymuje kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiada pancerza.",

  // Broń naturalna i oręż specjalny drużyn (ROZDZIAŁ 8 / opisy drużyn)
  "Broń naturalna":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu.",
  "Broń naturalna (drzewcowa)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną DRZEWCOWA.",
  "Broń naturalna (płonący atak)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną PŁONĄCY ATAK.",
  "Broń naturalna (precyzyjne uderzenie)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną PRECYZYJNE UDERZENIE.",
  "Broń naturalna (przebicie pancerza)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną PRZEBICIE PANCERZA.",
  "Broń naturalna (szybki)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną SZYBKI.",
  "Broń naturalna (wspinaczka)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną WSPINACZKA.",
  "Broń naturalna (zabójczy cios)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną ZABÓJCZY CIOS.",
  "Broń naturalna (zatruty atak)":
    "Wszystkie udane trafienia w fazie walki wręcz rozstrzyga się w oparciu o podstawową wartość współczynnika SIŁA modelu z zasadą specjalną ZATRUTY ATAK.",
  "Kula na łańcuchu":
    "Broń Goblińskiego fanatyka. Model nie może posiadać żadnej innej broni i nie może używać pancerza; zasady walki opisuje zasada specjalna GOBLIŃSKI FANATYK.",
  Spaczostrza:
    "W trakcie rekrutacji Spaczinżyniera gracz musi określić, czy spaczostrza są w walce wręcz traktowane jak halabarda, czy jak dwa miecze. Spaczostrza generują dwie Kostki Mocy, które w fazie magii może wykorzystać TECHNOMANTA do rzucenia zaklęcia Spaczbłyskawica z TRADYCJI SPACZMAGII.",
  "Wybuchowe zarodniki":
    "Model w fazie strzelania dysponuje magicznym atakiem strzeleckim o zasięgu 6” z zasadą WYMAGA PRZYGOTOWANIA, który zawsze trafia na 8+. Nie można go użyć w reakcji na szarżę stać & strzelać. Po trafieniu należy rzucić K6 i odczytać wynik w TABELI WYBUCHOWE ZARODNIKI.",
  // Przymioty (zasada specjalna PRZYMIOT, Towarzysz Graala)
  "Przymiot: Dzierzba":
    "Wojownik zdolny jest razić swych wrogów mocą swego spojrzenia. Model w fazie strzelania dysponuje dodatkowym, niezależnym od posiadanej broni dystansowej atakiem strzeleckim o zasięgu 12”, który trafia na 8+ zadając ofierze trafienie o SILE 4 z zasadą specjalną MAGICZNY ATAK i PRZEBICIE PANCERZA. DZIERZBY nie można użyć w reakcji na szarżę stać & strzelać.",
  "Przymiot: Filar":
    "Prawy wojownik zdolny jest odeprzeć szarżę konnicy. Model w każdej fazie walki wręcz traktowany jest tak, jakby bronił przeszkody. Model automatycznie zdaje testy SAM W WALCE.",
  "Przymiot: Pobożny":
    "Wiara wojownika chroni go przed wrogimi ciosami i plugawymi zaklęciami. Model podlega zasadzie specjalnej OCHRONNE TATUAŻE.",
  "Przymiot: Pogromca":
    "Wojownik zdolny jest pokonać w walce najpotężniejszych wrogów. Model podlega zasadzie specjalnej POGROMCA.",
  "Przymiot: Żniwiarz":
    "Wojownik jest doskonałym szermierzem. Model podlega zasadzie specjalnej ŻNIWIARZ.",
};
