// Source: Warheim FS rulebook PDF (AD2026.04.15), chapters 22 MAGIA and 23 MODLITWY.
// Each spell lore lists the common spells (Magia powszechna, 1-6) followed by
// the lore's own spells (7-12), as the rulebook numbers them. Flavour text is
// omitted. Overrides the older (Warheim.docx) entries in Magic.js. The other
// prayer lists in Magic.js already match chapter 23.
export const pdfMagic = {
  "Tradycja Bestii": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) WŁADCA BESTII",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (wilk).\nWILK:\nPODSTAWKA: 50 X 25 MM\nWilk, zwany także wilkiem stadny jest mniejszym kuzynem wielkiego wilka. Żyje w odległych górach i lasach, a liczebność gatunku stale się zmniejsza.\nCHARAKTERYSTYKA WILKA:\nWILK SZ WW US S WT ŻW I A CP\nPoczątkowa 9 3 0 3 3 1 3 1 3\nMaksymalna 9 3 0 3 3 1 3 1 3\nZASADY SPECJALNE:\nBROŃ NATURALNA, RĄCZY, ZWIERZĘ."
    ],
    "7": [
      "8 (2) RĄCZY JELEŃ",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele podlegają zasadzie specjalnej RANGER i RĄCZY."
    ],
    "8": [
      "9 (3) SKÓRA DZIKA",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele otrzymują kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiadają pancerza."
    ],
    "9": [
      "10 (4) KLĄTWA GHUR",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci traktowane są tak jakby poruszały się po terenie bardzo trudnym i terenie niebezpiecznym.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 (5) UCZTA KRUKÓW",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) DZIKA POSTAĆ WISSANA",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie lub też na dowolnego, sprzymierzonego bohatera lub stronnika w odległości do 8”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY lub WIELKOLUD lub ZWIERZĘ, RÓWNIEŻ związany walką wręcz.\nDopóki zaklęcie pozostaje w grze model zasadzie specjalnej BROŃ NATURALNA, DRUZGOCZĄCY, ŁAMIGNAT SILNY CIOS oraz TWARDZIEL i SZTUKA CICHEJ ŚMIERCI.\nModel pozostający pod wpływem zaklęcia, nie może używać oręża, tarczy & pancerza."
    ]
  },
  "Tradycja Cienia": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) SOBOWTÓR",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG może rzucić zaklęcie na siebie lub też na dowolnego, sprzymierzonego bohatera lub stronnika.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej CHORĄŻY lub DEMON lub FANATYK lub FURIA lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub LOT lub NAJEMNIK lub NIEUMARŁY lub SYGNALISTA lub WIELKOLUD lub ZIMNOKRWISTY lub ZWIERZĘ.\nCel zaklęcia podlega zasadzie specjalnej INFILTRACJA."
    ],
    "7": [
      "8 (2) CAŁUN NIEWIDZIALNOŚCI",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nObjęte działaniem zaklęcia modele podlegają zasadzie specjalnej KAMUFLAŻ."
    ],
    "8": [
      "9 (3) WIDMOWY RUCH",
      "RZUCONY NA 9+",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał widmowy ruch). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "9": [
      "10 (4) KLĄTWA ULGU",
      "RZUCONY NA 10+",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDo początku następnej fazy magii rzucającego zaklęcie MAGA trafione postaci traktowane są tak jakby znajdowały się poza stołem.\nW momencie określania czy kompania musi wykonać test rozbicia, modele znajdujące się poza stołem nie są liczone do całkowitej liczby postaci w kompanii i nie generują Kostek Mocy oraz Kostek Rozproszenia.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 (5) ZAMĘT ULGU",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nDopóki zaklęcie pozostaje w grze trafione postaci odczuwają efekty działania zasady specjalnej GŁUPOTA.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "11": [
      "12 (6) NEGACJA ATAKU",
      "RZUCONY NA 15+",
      "Negacja ataku jest zaklęciem wyjątkowym, może zostać rzucone przez MAGA, który został Oszołomiony! lub Powalony na ziemię! lub Wyłączony z akcji!.\nMAG może podjąć próbę rzucenia zaklęcia w następnej fazie magii (należy zignorować zasady, według których Oszołomiony! lub Powalony na ziemię! lub Wyłączony z akcji! MAG nie może rzucać zaklęć) i jeśli zaklęcie zostanie rzucone pomyślnie, moc zaklęcia neguje wszelkie obrażenia odniesione w poprzedniej turze tak, jakby rany nigdy nie zostały zadane – bo nie zostały zadane!"
    ]
  },
  "Tradycja Metalu": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) KUŹNIA CHAMONU",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMoc zaklęcia oddziałuje na K3 sztuki broni do walki wręcz lub broni dystansowej (nieprochowej) dzierżonej przez bohaterów lub stronników.\nDo końca rozgrywki wszystkie rzuty na zranienie objętego działaniem zaklęcia oręża wykonywane są z kumulatywnym modyfikatorem +1, a przeciwnik otrzymuje dodatkowy kumulatywny modyfikator -1 do rzutu na Ochronę Pancerza.\nZaklęcie nie działa na broń magiczną oraz mechaniczną i runiczną."
    ],
    "7": [
      "8 (2) KLĄTWA OŁOWIU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiary klątwy trafia jedynie w przypadku, gdy wypadnie naturalny dublet w udanym rzucie na trafienie (żadne modyfikatory i zasady specjalnie nie mają zastosowania – liczy się jedynie naturalny dublet w udanym rzucie na trafienie), a udane trafienia mają SIŁĘ 1.\nKlątwa nie działa na postaci walczące bronią magiczną lub mechaniczną lub runiczną.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "8": [
      "9 (3) METODA PRÓB & BŁĘDÓW",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele mogą przerzucić nieudane rzuty na trafienie, zranienie oraz Ochronę Pancerza i Magiczną Ochronę. Wynik drugiego rzutu jest ostateczny."
    ],
    "9": [
      "10 (4) KLĄTWA CHAMON",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci muszą przerzucić wszystkie udane rzuty na trafienie oraz Ochronę Pancerza. Wynik drugiego rzutu jest ostateczny.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 (5) SREBRZYSTE STRZAŁY ARHA",
      "RZUCONY NA 12+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) DUCH KUŹNI",
      "RZUCONY NA 14+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 1 jeżeli nie dysponują Ochroną Pancerza; trafienie z SIŁĄ 2 jeżeli dysponują Ochroną Pancerza na 6+, trafienie z SIŁĄ 3 jeżeli dysponują Ochroną Pancerza na 5+, trafienie z SIŁĄ 4 jeżeli dysponują Ochroną Pancerza na 4+, trafienie z SIŁĄ 5 jeżeli dysponują Ochroną Pancerza na 3+; trafienie z SIŁĄ 6 jeżeli dysponują Ochroną Pancerza na 2+ oraz trafienie z SIŁĄ 7 jeżeli dysponują Ochroną Pancerza na 1+ bądź lepszą, z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Tradycja Niebios": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) ZWIASTUN PRZYSZŁOŚCI",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej).\nDo końca rozgrywki model może przerzucić wszystkie nieudane rzuty na trafienie i zranienie. Wynik drugiego rzutu jest ostateczny."
    ],
    "7": [
      "8 (2) SZAFIROWY PORTAL",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 24” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 (3) BŁYSKAWICA",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”, który po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 (4) KLĄTWA AZYR",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci mogą zostać obrane na cel zaklęć typu magiczny pocisk oraz ataków bronią dystansową nawet, jeśli atakujący nie widzi celu lub przeklęta postać UKRYWA SIĘ.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 (5) PIORUN URANONA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) KLĄTWA FATUM",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczy model przeciwnika (wybrany przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że Astromanta musi widzieć swój cel). Dopóki zaklęcie pozostaje w grze ofiara klątwy zostaje automatycznie Wyłączona z akcji! jeżeli zostanie trafiona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Tradycja Ognia": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) GOREJĄCY MIECZ RHUIN",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMoc zaklęcia oddziałuje na K3 sztuki broni do walki wręcz dzierżonej przez bohaterów lub stronników, która do końca rozgrywki podlega zasadzie specjalnej PŁONĄCY ATAK.\nZaklęcie nie działa na broń magiczną oraz mechaniczną i runiczną"
    ],
    "7": [
      "8 (2) PŁOMIENNA KLĄTWA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci podlegają zasadzie specjalnej ŁATWOPALNY.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "8": [
      "9 (3) OGIEŃ U’ZHUL",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”, który po udanym rzuceniu uderza w cel z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 (4) TCHNIENIE AQSHY",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolny model przeciwnika, również związany walką wręcz, który znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "10": [
      "11 (5) OGNISTA KULA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) OGNISTE ODRODZENIE FENIKSA",
      "RZUCONY NA 14+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nJeżeli MAG zostanie Wyłączony z akcji! w czasie, gdy zaklęcie pozostawało w grze, należy użyć 3” okrągłego wzornika i przykryć nim Wyłączony z akcji! model MAGA.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza.\nW najbliższej fazie ruchu model MAGA powstaje podczas wykonywania pozostałych ruchów, tak jak postać, która była Oszołomiona!. Model może wykonać ruch (ale nie bieg lub LOT) lub strzelać lub rzucać zaklęcia lub odmawiać modlitwy. Jeśli model pozostaje związany walką wręcz to do końca trwania tury, w której powstał będzie atakował jako ostatni bez względu na wartość INICJATYWY lub zasady specjalne którym podlega.\nOd momentu powstania model należy traktować tak, jakby wciąż posiadał 1 punkt ŻW."
    ]
  },
  "Tradycja Śmierci": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) ŚMIECH ŻNIWIARZA",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY lub ZWIERZĘ.\nCel zaklęcia model podlega zasadzie specjalnej STRACH i ZIMNOKRWISTY."
    ],
    "7": [
      "8 (2) POSŁANIEC ŚMIERCI",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”, który po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "8": [
      "9 (3) KLĄTWA SHYISH",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nObok trafionych postaci należy umieścić sześciościenną kostkę, tak aby wskazywała wynik ‘1’.\nDopóki zaklęcie pozostaje w grze, na początku każdej kolejnej fazy magii MAGA należy obracać kostkę tak, by wskazywała wynik o +1 większy. Wynik na kostce oznacza ujemny kumulatywny modyfikator do współczynników SZ, S i WT jaki otrzymuje ofiara klątwy. Współczynniki mogą zostać obniżone do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "9": [
      "10 (4) KRĄG ŚMIERCI",
      "RZUCONY NA 11+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny, niezajęty przez wrogie postaci, obszar na powierzchni stołu, który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze postaci z zasadą specjalną ISTOTA ETERYCZNA lub NIEUMARŁY traktują teren przykryty wzornikiem jako teren niedostępny."
    ],
    "10": [
      "11 (5) KOSA ŻNIWIARZA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza.\nPostaci z zasadą specjalną ISTOTA ETERYCZNA lub NIEUMARŁY otrzymują trafienie o SILE 6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) KLĄTWA CZARNEGO HUMORU",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nOfiara klątwy zostaje Powalona na ziemię! i upada zanosząc się upiornym, histerycznym śmiechem. By ustalić czy ofiara zaklęcia pęknie ze śmiechu, obydwaj gracze muszą wykonać rzut K6. Jeżeli gracz, którego MAG rzucił zaklęcie uzyska wynik równy bądź niższy od przeciwnika, postać przeciwnika dalej zanosi się śmiechem i w następnej turze wciąż traktowana jest jako Powalony na ziemię!, jeżeli jednak uzyska wynik wyższy od przeciwnika, model pęka ze śmiechu i zostaje Wyłączony z akcji!.\nGracze rzucają K6 i powtarzają całą procedurę w każdej fazie magii, póki gracz dowodzący MAGIEM nie uzyska wyniku wyższego od przeciwnika lub klątwa nie zostanie rozproszona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Tradycja Światła": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) JASNOŚĆ UMYSŁU",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej).\nCel zaklęcia podlega zasadzie specjalnej NIEZŁOMNY i ZIMNOKRWISTY."
    ],
    "7": [
      "8 (2) PŁONĄCE WEJRZENIE",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”, które po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza.\nModele z zasadą specjalną DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub NIEUMARŁY lub OPĘTANY otrzymują trafienie z SIŁĄ 6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "8": [
      "9 (3) KLĄTWA AMYNTHOKA",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci odczuwają efekty działania zasady specjalnej GŁUPOTA.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "9": [
      "10 (4) OCHRONA PHA",
      "RZUCONY NA 11+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny, niezajęty przez wrogie postaci, obszar na powierzchni stołu, który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze postaci z zasadą specjalną DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub NIEUMARŁY lub OPĘTANY traktują teren przykryty wzornikiem jako teren niedostępny."
    ],
    "10": [
      "11 (5) KOLUMNA ŚWIATŁOŚCI",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza.\nPostaci z zasadą specjalną DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub NIEUMARŁY lub OPĘTANY otrzymują trafienie o SILE 6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) ŚWIĘTA TARCZA IGNATUSA",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele podlegają zasadzie specjalnej EGZORCYSTA oraz MAGICZNA OCHRONA (4+) i ŚMIGŁY."
    ]
  },
  "Tradycja Życia": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) UZDROWIENIE",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), które nie podlegają zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY.\nCel zaklęcia podlega zasadzie specjalnej REGENERACJA."
    ],
    "7": [
      "8 (2) WROTA ZIEMI",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 24” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 (3) ZWIERCIADŁO BÓLU",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 8”, nawet jeśli go nie widzi, również związany walczą wręcz.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY.\nDopóki zaklęcie pozostaje w grze wrogie postaci, które trafią objęty działaniem zaklęcia model otrzymują trafienie z taką samą SIŁĄ i zasadami specjalnym jak trafienie, które zadały."
    ],
    "9": [
      "10 (4) KLĄTWA GHYRAN",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci nie mogą biegać oraz korzystać z zasady specjalnej LOT, a wartość współczynnika SZ zostaje zmniejszona o połowę (ewentualne ułamki należy zaokrąglić w górę).\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 (5) GRAD KAMIENI",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) DAR ŻYCIA",
      "RZUCONY NA 14+",
      "MAG może rzucić zaklęcie na dowolny Wyłączony z akcji! sprzymierzony model bohatera lub stronnika, który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY.\nUdane rzucenie sprawia, że model odzyskuje wszystkie utracone punkty ŻW i kontynuuje turę normalnie."
    ]
  },
  "Tradycja Lodu": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 EGIDA MISKI",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej).\nDo końca potyczki objęty działaniem zaklęcia model w każdej fazie walki wręcz traktowany jest tak, jakby bronił przeszkody (zobacz paragraf OBRONA PRZESZKODY w ROZDZIALE 10: ELEMENTY TERENU NA POLU BITWY)."
    ],
    "7": [
      "8 TARCZA MISKI",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele w fazie magii oraz fazie strzelania podlegają zasadzie specjalnej MAGICZNA OCHRONA (4+)."
    ],
    "8": [
      "9 ZAWODZĄCY WIATR",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze wrogie postaci, które nie podlegają zasadzie specjalnej MACHINA WOJENNA, nie mogą strzelać z broni dystansowej o SILE 4 lub mniej do objętych działaniem zaklęcia modeli."
    ],
    "9": [
      "10 KLĄTWA MISKI",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Zaklęcie ma zasięg 24” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nObok trafionych postaci należy umieścić sześciościenną kostkę, tak aby wskazywała wynik ‘1’.\nDopóki zaklęcie pozostaje w grze, na początku każdej kolejnej fazy magii MAGA należy obracać kostkę tak, by wskazywała wynik o +1 większy. Wynik na kostce oznacza ujemny kumulatywny modyfikator do współczynników SZ, S i WT jaki otrzymuje ofiara klątwy. Współczynniki mogą zostać obniżone do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 LODOWY WIATR",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 GNIEW URSUNA",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze nad przykrytym wzornikiem obszarze przetacza się BURZA (zobacz paragraf POGODA W STARYM ŚWIECIE w ROZDZIALE 11:\nSCENARIUSZE) oraz (56) GROM Z JASNEGO NIEBA (zobacz ZDARZENIA LOSOWE ‘wewnątrz murów’ w ROZDZIALE 12: ZASADY OPCJONALNE)."
    ]
  },
  "Tradycja Yin": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) TERAKOTOWY ŻOŁNIERZ",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (terakotowy żołnierz).\nTERAKOTOWY ŻOŁNIERZ:\nPODSTAWKA: 20 X 20 MM\nUlepiony z gliny i ożywiony tchnieniem smoczego Qi, ten milczący strażnik jest echem dawnych armii, które nigdy nie zaznały spoczynku.\nCHARAKTERYSTYKA TERAKOTOWEGO ŻOŁNIERZA:\nTERAKOTOWY ŻOŁNIERZ SZ WW US S WT ŻW I A CP\nPoczątkowa 4 2 2 3 3 1 2 1 3\nMaksymalna 4 2 2 3 3 1 2 1 3\nZASADY SPECJALNE:\nLEŚNY DUCH, MARTWE ZŁO, TRUDNY DO ZABICIA."
    ],
    "7": [
      "8 (2) UŚPIENIE SMOCZEGO ODDECHU",
      "RZUCONY NA 6+",
      "Zaklęcie działa do początku następnej fazy magii MAGA.\nWymagany poziom mocy wszystkich zaklęć rzucanych w czasie trwania Uśpienia smoczego oddechu zostaje zwiększony o +3."
    ],
    "8": [
      "9 (3) PIECZĘĆ NIEWZRUSZONEGO LOTOSU",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele mogą przerzucić nieudane rzuty na trafienie, zranienie oraz Ochronę Pancerza i Magiczną Ochronę. Wynik drugiego rzutu jest ostateczny."
    ],
    "9": [
      "10 (4) MANDALA OCHRONY",
      "RZUCONY NA 11+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny, niezajęty przez wrogie postaci, obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze postaci z zasadą specjalną DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub NIEUMARŁY lub OPĘTANY traktują teren przykryty wzornikiem jako teren niedostępny."
    ],
    "10": [
      "11 (5) MGLISTE ZWIERCIADŁO XIN",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nDopóki zaklęcie pozostaje w grze trafione postaci odczuwają efekty działania zasady specjalnej GŁUPOTA.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "11": [
      "12 (6) CIEŃ ZAPOMNIENIA",
      "RZUCONY NA 15+",
      "Cień zapomnienia jest zaklęciem wyjątkowym, może zostać rzucone przez MAGA, który został Oszołomiony! lub Powalony na ziemię! lub Wyłączony z akcji!.\nMAG może podjąć próbę rzucenia zaklęcia w następnej fazie magii (należy zignorować zasady, według których Oszołomiony! lub Powalony na ziemię! lub Wyłączony z akcji! MAG nie może rzucać zaklęć) i jeśli zaklęcie zostanie rzucone pomyślnie, moc zaklęcia neguje wszelkie obrażenia odniesione w poprzedniej turze tak, jakby rany nigdy nie zostały zadane – bo nie zostały zadane."
    ]
  },
  "Tradycja Yang": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 (1) TERAKOTOWY ŻOŁNIERZ",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (terakotowy żołnierz).\nTERAKOTOWY ŻOŁNIERZ:\nPODSTAWKA: 20 X 20 MM\nBezgranicznie oddany swemu panu, osłania go własnym, kamiennym ciałem, nie zważając na ciosy, które kruszą jego pancerz, lecz nie łamią woli walki..\nCHARAKTERYSTYKA TERAKOTOWEGO ŻOŁNIERZA:\nTERAKOTOWY ŻOŁNIERZ SZ WW US S WT ŻW I A CP\nPoczątkowa 4 2 2 3 3 1 2 1 3\nMaksymalna 4 2 2 3 3 1 2 1 3\nZASADY SPECJALNE:\nLEŚNY DUCH, MARTWE ZŁO, TRUDNY DO ZABICIA."
    ],
    "7": [
      "8 (2) SZTYLET OSTATECZNEGO WYROKU",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, który po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "8": [
      "9 (3) STĄPANIE POZA CZASEM",
      "RZUCONY NA 9+",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał widmowy ruch). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "9": [
      "10 (4) SZEPT PŁONĄCEGO FENIKSA",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolny model przeciwnika, również związany walką wręcz, który znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "10": [
      "11 (5) PIEŚŃ PŁONĄCEGO ODRODZENIA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 (6) SMOCZY ZEW PÓŁNOCNEJ ZIMY",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze nad przykrytym wzornikiem obszarze przetacza się BURZA (zobacz paragraf POGODA W STARYM ŚWIECIE w ROZDZIALE 11:\nSCENARIUSZE) oraz (56) GROM Z JASNEGO NIEBA (zobacz ZDARZENIA LOSOWE ‘wewnątrz murów’ w ROZDZIALE 12: ZASADY OPCJONALNE)."
    ]
  },
  "Magia Żywiołów": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 PIERWSZE ŻYCZENIE IBN JELLABA",
      "RZUCONE PRZED ROZGRYWKĄ",
      "Zaklęcie musi zostać rzucone przed rozgrywką. Moc zaklęcia pozwala wpływać geniusom na przebieg rozgrywki. Na początku potyczki, przed turą pierwszego gracza należy zebrać pulę Kostek Przeznaczenia. Pula składa się z K3 kostek K6. Po ustalenie puli Kostek Przeznaczenia gracz wykonuje rzut.\nKostki Przeznaczenia z wylosowanymi WYNIKAMI należy umieścić w widocznym miejscu przed graczem lub też w pudełku, czy innym wygodnym miejscu, które uniemożliwi pomieszanie ich z innymi kostkami używanymi w czasie gry.\nW trakcie rozgrywki gracz może użyć wybranego przez siebie WYNIKU na Kostce Przeznaczenia do modyfikacji dowolnego rzutu lub testu wykonywanego przez dowolny model bohatera. Wykorzystany WYNIK należy usunąć z puli WYNIKÓW Kostek Przeznaczenia. WYNIKI, które nie zostaną wykorzystane w trakcie potyczki przepadają i nie mogą być użyte w trakcie sekwencji po potyczce."
    ],
    "7": [
      "8 WROTA DAO",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 18” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 MIRAŻ MARIDY",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Czar oddziałuje na model MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA.\nDopóki zaklęcie pozostaje w grze wrogie postaci otrzymują kumulatywny modyfikator -1 do rzutów na trafienie objętych działaniem zaklęcia modeli."
    ],
    "9": [
      "10 DRUGIE ŻYCZENIE AL MUKTARA",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Postać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 PIĘŚĆ MARIDY",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 TRZECIE ŻYCZENIE SUŁTANA JAFFARA",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiara klątwy zostaje automatycznie Wyłączona z akcji! jeżeli zostanie trafiona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Magia Asrai": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 UKRYTA ŚCIEŻKA",
      "RZUCONY NA 5+, POZOSTAJE W GRZE",
      "MAG może rzucić to zaklęcie na siebie lub też na dowolnego, sprzymierzonego bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi.\nZaklęcie może zostać rzucone na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nDopóki zaklęcie pozostaje w grze objęty działaniem zaklęcia model traktuje na potrzeby ruchu, ale nie pola widzenia, wszystkie elementy terenu jak teren otwarty."
    ],
    "7": [
      "8 PLEMIĘ PÓŁMROKU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Czar oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walką wręcz.\nDopóki zaklęcie pozostaje w grze wrogie postaci otrzymują kumulatywny modyfikator -1 do rzutów na trafienie objętych działaniem zaklęcia modeli."
    ],
    "8": [
      "9 WIDMOWY RUCH",
      "RZUCONY NA 9+",
      "Zaklęcie oddziałuje na model MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walką wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał widmowy ruch). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "9": [
      "10 KLĄTWA KNIEI",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci traktowane są tak jakby poruszały się po terenie bardzo trudnym i terenie niebezpiecznym.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 PTAKI CIERNISTYCH KRZEWÓW",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 FURIA KNIEI",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze wszystkie wrogie postaci, które nie podlegają zasadzie specjalnej LEŚNY DUCH lub ZWIERZĘ, znajdujące się na przykrytym wzornikiem obszarze podlegają zasadzie specjalnej UDERZA JAKO OSTATNI oraz otrzymują w fazie magii trafienie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Wysoka Magia": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 SZAFIROWY PORTAL",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 24” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "7": [
      "8 WYSSANIE MAGII",
      "RZUCONY NA 6+",
      "Zaklęcie działa do początku następnej fazy magii MAGA.\nWymagany poziom mocy wszystkich zaklęć rzucanych w czasie trwania Wyssania Magii zostaje zwiększony o +3."
    ],
    "8": [
      "9 TARCZA SAPHERY",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Moc zaklęcia oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele podlegają zasadzie specjalnej MAGICZNA OCHRONA (5+)."
    ],
    "9": [
      "10 KLĄTWA QHAYSH",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Zaklęcie ma zasięg 24” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), który należy przykryć 5” okrągłym wzornikiem.\nObok trafionych postaci należy umieścić sześciościenną kostkę, tak aby wskazywała wynik ‘1’.\nDopóki zaklęcie pozostaje w grze, na początku każdej kolejnej fazy magii MAGA należy obracać kostkę tak, by wskazywała wynik o +1 większy. Wynik na kostce oznacza ujemny kumulatywny modyfikator do współczynników SZ, S i WT jaki otrzymuje ofiara klątwy. Współczynniki mogą zostać obniżone do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 OGIEŃ FENIKSA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 PŁOMIENIE QHAYSH",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "Zaklęcie magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 3 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza.\nJeśli na początku następnej fazy magii MAGA zaklęcie nadal pozostaje w grze, objęte działaniem zaklęcia postaci otrzymują trafienie o SILE 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza.\nJeśli czar pozostaje w grze w kolejnej fazie magii rzucającego, wrogie postaci otrzymują trafienie o SILE 5 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza, SIŁA trafienia zwiększa się o +1 z każdą kolejną turę."
    ]
  },
  "Mroczna Magia": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 PIEKIELNY WRZASK",
      "RZUCONY NA 8+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione postaci muszą wykonać test CP. Nieudany test oznacza, że modele Uciekają!."
    ],
    "7": [
      "8 POTĘGA MROKU",
      "RZUCONY NA 6+",
      "Zaklęcie działa do początku następnej fazy magii MAGA.\nWymagany poziom mocy wszystkich zaklęć rzucanych przez MAGA w czasie trwania zaklęcia zostaje zmniejszony o -3. Jeżeli jednak w nieudanym rzucie na wymagany poziom mocy zaklęć wypadnie naturalny dublet, to należy wykonać rzut K6. Wynik 1 oznacza, że MAG otrzymuje trafienie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "8": [
      "9 FANTASMAGORIA",
      "RZUCANY NA 10+, POZOSTAJE W GRZE",
      "Dopóki zaklęcie pozostaje w grze, wszystkie znajdujące się na stole wrogie postaci, które nie podlegają zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, przeprowadzając test oparty na współczynniku CP wykonują rzut 3K6 odrzucając kostkę z najniższym wynikiem."
    ],
    "9": [
      "10 KLĄTWA PANA WĘŻY",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze wartość współczynników WW i US trafionych postaci zostaje obniżona do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 SECTUMSEMPRA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 POŚWIĘCENIE",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na dowolny sprzymierzony model bohatera lub stronnika znajdujący się w odległości do 12”.\nZaklęcie może zostać rzucone na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nDopóki zaklęcie pozostaje w grze ofiara zaklęcia zamienia się w żywą bombę, która na życzenie MAGA eksploduje w wybranej przez gracza fazie strzelania.\nModel, który eksplodował zostaje automatycznie Wyłączony z akcji!, a następnie należy użyć 3” okrągłego wzornika, którego środek należy umieścić w miejscu eksplozji ofiary zaklęcia.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Magia Ognistej Paszczy": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 OGNISTA PASZCZA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od Ogniobrzuchego, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze dzierżona przez modele broń do walki wręcz podlega zasadzie specjalnej PŁONĄCY ATAK."
    ],
    "7": [
      "8 WROTA TRZEWIODOŁU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 18” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 PŁOMIENNA KLĄTWA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiara klątwy podlega zasadzie specjalnej ŁATWOPALNY.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "9": [
      "10 SKÓRA NOSOROŻNIKA",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele otrzymują kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiadają pancerza."
    ],
    "10": [
      "11 TCHNIENIE TRZEWIODOŁU",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związany walką wręcz, który znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 KLĄTWA TRZEWIODOŁU",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiara klątwy zostaje automatycznie Wyłączona z akcji! jeżeli zostanie trafiona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Magia Demonów": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 MGIELNY OPAR",
      "RZUCONY NA 6+, POZOSTAJE W GRZE",
      "MAG może rzucić czar na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi.\nDopóki zaklęcie pozostaje w grze wybrana na cel zaklęcia postać oraz wszystkie modele (wrogie i sprzymierzone) znajdujące się w odległości do 8” zostają spowite MGŁĄ (zobacz paragraf POGODA W STARYM ŚWIECIE w ROZDZIALE 11:\nSCENARIUSZE)."
    ],
    "7": [
      "8 PIEKIELNY WRZASK",
      "RZUCONY NA 8+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione postaci muszą wykonać test CP. Nieudany test oznacza, że modele Uciekają!."
    ],
    "8": [
      "9 PANDEMONIUM",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Dopóki zaklęcie pozostaje w grze wrogie postaci bohaterów i stronników nie mogą używać jako podstawy testu wartości współczynnika CECHY PRZYWÓDCZE swojego DOWÓDCY.\nNależy zauważyć, że stronnicy nie mogą korzystać także z żadnych modyfikatorów oraz przerzutów testów CP wynikających z umiejętności i zasad specjalnych bohaterów, wrogie postaci MAGÓW odczuwają przekleństwo Tzeentcha za każdym razem, gdy podczas rzutu na wymagany poziom mocy zaklęcia wypadną dwa lub więcej naturalne dublety."
    ],
    "9": [
      "10 KLĄTWA MROKU",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa Mroku ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczy model przeciwnika, także związany walką wręcz (wybrany przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze ofiary klątwy przeprowadzając test oparty na współczynniku CP wykonują rzut 3K6 odrzucając kostkę z najniższym wynikiem.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 OKO CIEMNOŚCI",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 STWORZENIA MGŁY",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie modele Meargh, Dirach, Szlachcica Fimm albo Shearl lub Wojownik Fimm znajdujące się w odległości do 6\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele, które są spowite MGŁĄ (zobacz paragraf POGODA W STARYM ŚWIECIE w ROZDZIALE 11: SCENARIUSZE lub (31) MGŁA w paragrafie ZDARZENIA LOSOWE ‘wewnątrz murów’ w ROZDZIALE 12: ZASADY OPCJONALNE lub zaklęcie MGŁA w paragrafie MAGIA DEMONÓW w ROZDZIALE 22: MAGIA) podlegają zasadzie specjalnej GENIUS oraz MAGICZNA OCHRONA (5+)."
    ]
  },
  "Dziedzina Chaosu": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 CIĘTA RIPOSTA",
      "RZUCONY NA 6+",
      "Zaklęcie ma zasięg 12” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nObjęta działaniem zaklęcia postać musi wykonać test S. Nieudany test oznacza, że postać traci 1 punkt ŻW bez możliwości skorzystania z Ochrony Pancerza.\nZaklęcie może zostać także skierowane na pojedynczy sprzymierzony model bohatera lub stronnika wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który został naznaczony Piętnem Chaosu Niepodzielonego. Model automatycznie zdaje test S i natychmiast odzyskuje wszystkie utracone punkty ŻYWOTNOŚCI, a jeśli model był Oszołomiony! lub Powalony na ziemię! to natychmiast wstaje i kontynuuje turę normalnie."
    ],
    "7": [
      "8 WIZJA MĘKI",
      "RZUCONY NA 6+",
      "Zaklęcie ma zasięg 18” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nOfiara zaklęcia musi wykonać test CP. Nieudany test oznacza, że model zostaje Powalony na ziemię!."
    ],
    "8": [
      "9 PALĄCA KREW",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, które po udanym rzuceniu uderza w cel z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 KLĄTWA DUCHA CHAOSU",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), którą należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci przeprowadzając test oparty na współczynniku CP wykonują rzut 3K6 odrzucając kostkę z najniższym wynikiem.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 ŁAŃCUCHY MĘKI",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 SZTORM CHAOSU",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze nad przykrytym wzornikiem obszarze przetacza się WICHURA (zobacz paragraf POGODA W STARYM ŚWIECIE w ROZDZIALE 11:\nSCENARIUSZE) oraz (34) KWAŚNY DESZCZ (zobacz ZDARZENIA LOSOWE ‘wewnątrz murów’ w ROZDZIALE 12: ZASADY OPCJONALNE)."
    ]
  },
  "Dziedzina Nurgla": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WYBORNE WRZODY",
      "RZUCONY NA 6+",
      "Zaklęcie ma zasięg 12” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nObjęta działaniem zaklęcia postać musi wykonać test WT. Nieudany test oznacza, że postać traci 1 punkt ŻW bez możliwości skorzystania z Ochrony Pancerza.\nZaklęcie może zostać także skierowane na pojedynczy sprzymierzony model bohatera lub stronnika wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który został naznaczony Piętnem Nurgla. Model automatycznie zdaje test WT i natychmiast odzyskuje wszystkie utracone punkty ŻYWOTNOŚCI, a jeśli model był Oszołomiony! lub Powalony na ziemię! to natychmiast wstaje i kontynuuje turę normalnie."
    ],
    "7": [
      "8 DOSKONAŁA LIMFA",
      "RZUCONY NA 7+",
      "MAG może rzucić czar na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nDo początku następnej fazy magii MAGA cel zaklęcia podlega zasadzie specjalnej REGENERACJA."
    ],
    "8": [
      "9 WYŚMIENITE CZYRAKI",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, które po udanym rzuceniu uderza w cel z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 KLĄTWA NURGLA",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze wartość współczynnika WT trafionych postaci zostaje obniżona do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 PRZEDNIA ZGNILIZNA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 KLĄTWA CZARNEGO HUMORU",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nOfiara klątwy zostaje Powalona na ziemię! i upada zanosząc się upiornym, histerycznym śmiechem. By ustalić czy ofiara zaklęcia pęknie ze śmiechu, obydwaj gracze muszą wykonać rzut K6. Jeżeli gracz, którego MAG rzucił zaklęcie uzyska wynik równy bądź niższy od przeciwnika, postać przeciwnika dalej zanosi się śmiechem i w następnej turze wciąż traktowana jest jako Powalony na ziemię!, jeżeli jednak uzyska wynik wyższy od przeciwnika, model pęka ze śmiechu i zostaje Wyłączony z akcji!.\nGracze rzucają K6 i powtarzają całą procedurę w każdej fazie magii, póki gracz dowodzący MAGIEM nie uzyska wyniku wyższego od przeciwnika lub klątwa nie zostanie rozproszona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Dziedzina Slaanesha": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 BŁOGA AGONIA",
      "RZUCONY NA 6+",
      "Zaklęcie ma zasięg 12” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nObjęta działaniem zaklęcia postać musi wykonać test I. Nieudany test oznacza, że postać traci 1 punkt ŻW bez możliwości skorzystania z Ochrony Pancerza.\nZaklęcie może zostać także skierowane na pojedynczy sprzymierzony model bohatera lub stronnika wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który został naznaczony Piętnem Slaanesha. Model automatycznie zdaje test I i natychmiast odzyskuje wszystkie utracone punkty ŻYWOTNOŚCI, a jeśli model był Oszołomiony! lub Powalony na ziemię! to natychmiast wstaje i kontynuuje turę normalnie."
    ],
    "7": [
      "8 KLĄTWA TAŃCA ROZKOSZY",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiara klątwy w fazie ruchów przymusowych porusza się o K3” w losowo określonym kierunku (w przypadku, gdy na Kostce Rozrzutu wypadnie wynik TRAFIENIE!, kierunek ruchu wybiera kierujący MAGIEM gracz). Jeżeli ruch oznaczałby wejście w kontakt z innym modelem, należy zatrzymać dotkniętą działaniem zaklęcia postać 1” od modelu.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "8": [
      "9 CUDOWNE MĘKI",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, które po udanym rzuceniu uderza w cel z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 PIEKIELNY KRZYK",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "10": [
      "11 PIESZCZOTA SLAANESHA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 ZACHWYCAJĄCE SPAZMY",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze wszystkie wrogie postaci, które nie podlegają zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, także związaną walką wręcz, znajdujące się na przykrytym wzornikiem obszarze otrzymują trafienie z SIŁĄ K6 z zasadą specjalną UNIERUCHAMIAJĄCY bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Dziedzina Tzeentcha": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WEWNĘTRZNY OGIEŃ",
      "RZUCONY NA 6+",
      "Zaklęcie ma zasięg 12” i po udanym rzuceniu może zostać skierowane na pojedynczą postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nObjęta działaniem zaklęcia postać musi wykonać test CP. Nieudany test oznacza, że postać traci 1 punkt ŻW bez możliwości skorzystania z Ochrony Pancerza.\nZaklęcie może zostać także skierowane na pojedynczy sprzymierzony model bohatera lub stronnika wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który został naznaczony Piętnem Tzeentcha. Model automatycznie zdaje test CP i natychmiast odzyskuje wszystkie utracone punkty ŻYWOTNOŚCI, a jeśli model był Oszołomiony! lub Powalony na ziemię! to natychmiast wstaje i kontynuuje turę normalnie."
    ],
    "7": [
      "8 POMARAŃCZOWY OGIEŃ",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nDo początku następnej fazy magii MAGA cel zaklęcia może przerzucić wszystkie nieudane rzuty na trafienie, zranienie oraz Ochronę Pancerza i Magiczną Ochronę. Wynik drugiego rzutu jest ostateczny."
    ],
    "8": [
      "9 PANDEMONIUM",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Dopóki zaklęcie pozostaje w grze wrogie postaci bohaterów i stronników nie mogą używać jako podstawy testu wartości współczynnika CECHY PRZYWÓDCZE swojego DOWÓDCY.\nNależy zauważyć, że stronnicy nie mogą korzystać także z żadnych modyfikatorów oraz przerzutów testów CP wynikających z umiejętności i zasad specjalnych bohaterów, wrogie postaci MAGÓW odczuwają przekleństwo Tzeentcha za każdym razem, gdy podczas rzutu na wymagany poziom mocy zaklęcia wypadną dwa lub więcej naturalne dublety."
    ],
    "9": [
      "10 OGNISTE TCHNIENIE",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związany walką wręcz, który znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "10": [
      "11 RÓŻOWY OGIEŃ",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 POKUSA TZEENTCHA",
      "RZUCONY NA 15+",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), którą należy przykryć 5” okrągłym wzornikiem.\nTrafione postaci muszą wykonać test CP. Nieudany test oznacza, że odczuwają efekty działania zasady specjalnej DOMINACJA.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Dziedzina Hashuta": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WOLA HASHUTA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze dzierżona przez modele broń do walki wręcz podlega zasadzie specjalnej PŁONĄCY ATAK."
    ],
    "7": [
      "8 BYCZY PĘD",
      "RZUCONY NA 7+",
      "Zaklęcie oddziałuje na model MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walką wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał byczy pęd). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "8": [
      "9 WEZWANIE MOCY",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "MAG może rzucić czar na siebie lub dowolny model bohatera lub stronnika (wrogi lub sprzymierzony) w odległości do 8”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nNastępnie należy wykonać rzut K6. Wynik 1 oznacza, że cel zaklęcie zostaje natychmiast Wyłączony z akcji!, wynik 2-5 oznacza, że dopóki zaklęcie pozostaje w grze wartość jednego ze współczynników, wybranego przez gracza kontrolującego model zostaje zwiększona o +1, a 6 oznacza, że dopóki zaklęcie pozostaje w grze wartość wszystkich współczynników zostaje zwiększona o +1.\nNależy zauważyć, że dzięki mocy zaklęcia wartość współczynników może zostać zwiększona ponad rasowe maksimum, aż do maksymalnej wartości 10 punktów."
    ],
    "9": [
      "10 TCHNIENIE OJCA CIEMNOŚCI",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związany walką wręcz, który znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "10": [
      "11 OGIEŃ HASHUTA",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 POŚWIECENIE",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na dowolny sprzymierzony model bohatera lub stronnika znajdujący się w odległości do 12”.\nZaklęcie może zostać rzucone na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nDopóki zaklęcie pozostaje w grze ofiara zaklęcia zamienia się w żywą bombę, która na życzenie MAGA eksploduje w wybranej przez gracza fazie strzelania.\nModel, który eksplodował zostaje automatycznie Wyłączony z akcji!, a następnie należy użyć 3” okrągłego wzornika, którego środek należy umieścić w miejscu eksplozji ofiary zaklęcia.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Dziedzina Dziczy": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WŁADCA BESTII",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (wilczarz Chaosu)."
    ],
    "7": [
      "8 ZWIERZĘCY PĘD",
      "RZUCONY NA 7+",
      "Zaklęcie oddziałuje na model MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walką wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał zwierzęcy pęd). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "8": [
      "9 SKÓRA RAZORGORA",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele otrzymują kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiadają pancerza."
    ],
    "9": [
      "10 KLĄTWA DZICZY",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci traktowane są tak jakby poruszały się po terenie bardzo trudnym i terenie niebezpiecznym.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 CHMARA INSEKTÓW",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 z bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 ZEW ZDRADY",
      "RZUCONY NA 13+, POZOSTAJE W GRZE",
      "Wszystkie wrogie postaci podlegające zasadzie specjalnej ZWIERZĘ, także związane walką wręcz, szarżują na najbliższą znajdującą się w zasięgu ruchu szarży i w polu widzenia sprzymierzoną postać bohatera lub stronnika, z którą będzie walczyć do końca tury. Szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży postaci, która wykonała szarzę w wyniku działania zaklęcia. Po zakończeniu fazy walki wręcz postaci należy ustawić 1” od siebie.\nPostaci podlegające zasadzie specjalnej WIERZCHOWIEC oraz ZWIERZĘ atakują dosiadających ich KAWALERZYSTÓW, a ZWIERZĘTA POCIĄGOWE atakują woźniców.\nJeżeli w zasięgu ruchu szarży i w polu widzenia niema sprzymierzonych postaci, postaci z zasadą specjalną ZWIERZĘ wykonują bieg w kierunku najbliższej sprzymierzonej postaci, nawet jeśli nie znajduje się ona w polu widzenia."
    ]
  },
  "Nekromancja": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 INWOKACJA NEHEK",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (zombie)."
    ],
    "7": [
      "8 ETERYCZNA ISKRA",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, które po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "8": [
      "9 ZEW VANHELA",
      "RZUCONY NA 8+",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, które podlegają zasadzie specjalnej ISTOTA ETERYCZNA lub NIEUMARŁY, również związane walką wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który odpowiedział na Zew Vanhela). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "9": [
      "10 KLĄTWA STAROŚCI",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związaną walką wręcz, znajdującą się w odległości do 18\" i w polu widzenia MAGA Po udanym rzuceniu zaklęcia należy umieścić obok ofiary klątwy sześciościenną kostkę, tak aby wskazywała wynik ‘6’.\nDopóki zaklęcie pozostaje w grze, na początku każdej kolejnej fazy magii MAGA należy obracać kostkę tak, by wskazywała wynik o 1 mniejszy.\nNastępnie należy wykonać rzut K6. Jeżeli wynik rzutu jest równy lub wyższy od wartości wskazywanej przez umieszczoną obok ofiary klątwy kostkę, to postać zostaje natychmiast Wyłączony z akcji!.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 WSKRZESZENIE",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolny sprzymierzony model stronnika z zasadą specjalną ISTOTA ETERYCZNA lub NIEUMARŁY, który został Wyłączony z akcji! i znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nZa każdy trafiony sprzymierzony model stronnika, który został Wyłączony z akcji! należy wykonać rzut K6. Wynik 4+ oznacza, że model natychmiast powstaje i kontynuuje turę normalnie, od momentu powstania model należy traktować tak, jakby wciąż posiadał 1 punkt ŻW.\nWskrzeszone ISTOTY ETERYCZNE lub NIEUMARLI rozpadają się w pył po zakończeniu gry, a w czasie sekwencji po potyczce dla każdego takiego modelu stronnika należy wykonać rzut na TABELĘ POWAŻNYCH RAN."
    ],
    "11": [
      "12 CIELESNA EKSPLOZJA",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na dowolny sprzymierzony model bohatera lub stronnika, który podlega zasadzie specjalnej NIEUMARŁY, również związany walką wręcz, znajdujący się w odległości do 12”.\nDopóki zaklęcie pozostaje w grze ofiara zaklęcia zamienia się w nieżywą bombę, która na życzenie MAGA eksploduje w wybranej przez gracza fazie strzelania.\nModel, który eksplodował zostaje automatycznie Wyłączony z akcji!, a następnie należy użyć 3” okrągłego wzornika, którego środek należy umieścić w miejscu eksplozji ofiary zaklęcia.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Domena Nehekhary": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 INKANTACJA KHEPRY",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (nieumarły rój)."
    ],
    "7": [
      "8 INKANTACJA USIRIANA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 24” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 INKANTACJA KHSARA",
      "RZUCONY NA 8+",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, które podlegają zasadzie specjalnej ISTOTA ETERYCZNA lub NIEUMARŁY, również związane walką wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który odpowiedział na Inkantację Khsara). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "9": [
      "10 INKANTACJA USEKPHA",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, która nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związaną walką wręcz, znajdującą się w odległości do 24\" i w polu widzenia MAGA Po udanym rzuceniu zaklęcia należy umieścić obok ofiary klątwy sześciościenną kostkę, tak aby wskazywała wynik ‘6’.\nDopóki zaklęcie pozostaje w grze, na początku każdej kolejnej fazy magii MAGA należy obracać kostkę tak, by wskazywała wynik o 1 mniejszy.\nNastępnie należy wykonać rzut K6. Jeżeli wynik rzutu jest równy lub wyższy od wartości wskazywanej przez umieszczoną obok ofiary klątwy kostkę, to postać zostaje natychmiast Wyłączony z akcji!.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 INKANTACJA SAKHMETY",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolny sprzymierzony model stronnika z zasadą specjalną ISTOTA ETERYCZNA lub NIEUMARŁY, który został Wyłączony z akcji! i znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nZa każdy trafiony sprzymierzony model stronnika, który został Wyłączony z akcji! należy wykonać rzut K6. Wynik 4+ oznacza, że model natychmiast powstaje i kontynuuje turę normalnie, od momentu powstania model należy traktować tak, jakby wciąż posiadał 1 punkt ŻW.\nWskrzeszone ISTOTY ETERYCZNE lub NIEUMARLI rozpadają się w pył po zakończeniu gry, a w czasie sekwencji po potyczce dla każdego takiego modelu stronnika należy wykonać rzut na TABELĘ POWAŻNYCH RAN."
    ],
    "11": [
      "12 INKANTACJA SOKTHA",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiara klątwy zostaje automatycznie Wyłączona z akcji! jeżeli zostanie trafiona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Tradycja Skrytości": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 ROZMYCIE POSTACI",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nDopóki zaklęcie pozostaje w grze wrogie postaci otrzymują kumulatywny modyfikator -1 do rzutów na trafienie objętych działaniem zaklęcia modeli."
    ],
    "7": [
      "8 SPACZPORTAL",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 18” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 ODDECH ŚMIERCI",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, które po udanym rzuceniu uderza w cel z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 WIDMOWY MARSZ",
      "RZUCONY NA 9+",
      "Zaklęcie oddziałuje na model MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walką wręcz.\nObjęte działaniem zaklęcia modele mogą wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał Widmowy Marsz). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "10": [
      "11 KLĄTWA SKRYTOBÓJCY",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), którą należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci mogą zostać obrane na cel zaklęć typu magiczny pocisk oraz ataków bronią dystansową nawet, jeśli atakujący nie widzi celu lub przeklęty model UKRYWA SIĘ.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "11": [
      "12 TARCZA SKRYTOBÓJCÓW",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele podlegają zasadzie specjalnej KAMUFLAŻ i MAGICZNA OCHRONA (4+)."
    ]
  },
  "Tradycja Spaczmagii": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 POTĘGA SPACZMAGII",
      "RZUCONY NA 6+",
      "Zaklęcie działa do początku następnej fazy magii MAGA.\nWymagany poziom mocy wszystkich zaklęć rzucanych przez MAGA w czasie trwania zaklęcia zostaje zmniejszony o -3. Jeżeli jednak w nieudanym rzucie na wymagany poziom mocy zaklęć wypadnie naturalny dublet, to należy wykonać rzut K6. Wynik 1 oznacza, że MAG otrzymuje trafienie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "7": [
      "8 SPACZPORTAL",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 18” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 SPACZBŁYSKAWICA",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 36”, które po udanym rzuceniu uderza w cel z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 KLĄTWA NIEMOCY",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione postaci muszą przerzucić wszystkie udane rzuty na trafienie i zranienie.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 TCHNIENIE ŚMIERCI",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 z bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 BURZA SPACZBŁYSKAWIC",
      "RZUCONY NA 13+",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz wybiera dowolny obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem.\nTrafione postaci, które znajdują się na terenie otwartym otrzymują uderzenie z SIŁĄ K6 z bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "12": [
      "13 APOKLĘSTWO",
      "RZUCONY NA 13+",
      "Po udanym rzuceniu zaklęcia kierujący MAGIEM gracz musi wykonać rzut 2K6. Wynik 13+ oznacza, że przeciwnik automatycznie nie zdaje kolejnego testu rozbicia."
    ]
  },
  "Tradycja Zarazy": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WOLA ROGATEGO SZCZURA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze model objęty działaniem zaklęcia może przerzucić wszystkie nieudane rzuty na zranienie. Wynik drugiego rzutu jest ostateczny."
    ],
    "7": [
      "8 PLUGAWA WITALNOŚĆ",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 12”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), które nie podlegają zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY.\nDo początku następnej fazy magii MAGA cel zaklęcia podlega zasadzie specjalnej REGENERACJA."
    ],
    "8": [
      "9 POTĘGA ROGATEGO SZCZURA",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele podlegają zasadzie specjalnej PRZEBICIE PANCERZA i ZATRUTY ATAK."
    ],
    "9": [
      "10 KLĄTWA ROGATEGO SZCZURA",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 5” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze wartość współczynnika WT trafionych postaci zostaje obniżona do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 TCHNIENIE ZARAZY",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione postaci otrzymują uderzenie z SIŁĄ K6 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 KLĄTWA FATUM",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nDopóki zaklęcie pozostaje w grze ofiara klątwy zostaje automatycznie Wyłączona z akcji! jeżeli zostanie trafiona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Dziedzina Boga-Pajonka": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WŁADCA PAJONKÓW",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (pajonki)."
    ],
    "7": [
      "8 GOBLIN-PAJONK",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele podlegają zasadzie specjalnej AKROBATA i MUROŁAZ."
    ],
    "8": [
      "9 CHITYNOWA SKÓRA",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 8\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele otrzymują kumulatywny modyfikator +2 do Ochrony Pancerza lub Ochronę Pancerza na 5+, jeśli nie posiadają pancerza."
    ],
    "9": [
      "10 KLONTWA BOGA-PAJONKA",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze wszystkie trafienia zadane ofiarom klątwy podlegają zasadzie specjalnej PRZEBICIE PANCERZA i ZATRUTY ATAK.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 TCHNIENIE PAJONKA",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną ZATRUTY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 WYBRANIEC BOGA-PAJONKA",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na dowolny sprzymierzony model bohatera lub stronnika znajdujący się w odległości do 12”.\nZaklęcie może zostać rzucone na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nDopóki zaklęcie pozostaje w grze ofiara zaklęcia zamienia się w żywą bombę, która na życzenie MAGA eksploduje w wybranej przez gracza fazie strzelania.\nModel, który eksplodował zostaje automatycznie Wyłączony z akcji!, a następnie należy użyć 3” okrągłego wzornika, którego środek należy umieścić w miejscu eksplozji ofiary zaklęcia.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną ZATRUTY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Magia Małego Łooomotu!": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WŁADCA SQUIGÓW",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMAG podlega zasadzie specjalnej PRZYWOŁANIE (squig)."
    ],
    "7": [
      "8 PRZESMYK MORKA",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 18” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 WEJRZENIE GORKA",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, który po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 KLONTWA GORKA",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczy model przeciwnika, także związany walką wręcz (wybrany przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze trafione modele muszą przerzucić wszystkie udane rzuty na trafienie i zranienie.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 TCHNIENIE GORKA",
      "RZUCONY NA 11+",
      "Zaklęcie może zostać rzucone na dowolny model przeciwnika, również związany walką wręcz, który znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną DRUZGOCZĄCY bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 MORK CIEM WYBRAĆ",
      "RZUCONY NA 12+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na dowolny sprzymierzony model bohatera lub stronnika znajdujący się w odległości do 12”.\nZaklęcie może zostać rzucone na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), który nie podlega zasadzie specjalnej DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MACHINA WOJENNA lub NIEUMARŁY lub OPĘTANY, również związany walką wręcz.\nDopóki zaklęcie pozostaje w grze ofiara zaklęcia zamienia się w żywą bombę, która na życzenie MAGA eksploduje w wybranej przez gracza fazie strzelania.\nModel, który eksplodował zostaje automatycznie Wyłączony z akcji!, a następnie należy użyć 3” okrągłego wzornika, którego środek należy umieścić w miejscu eksplozji ofiary zaklęcia.\nTrafione postaci otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Magia Dużego Łooomotu!": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 NAOSZCZENIE REMBAKÓW",
      "RZUCONE PRZED ROZGRYWKĄ",
      "To zaklęcie musi zostać rzucone przed rozgrywką.\nMoc zaklęcia oddziałuje na K3 sztuki broni do walki wręcz dzierżonej przez bohaterów.\nDo końca rozgrywki wszystkie rzuty na trafienie i zranienie objętego działaniem zaklęcia oręża wykonywane są z kumulatywnym modyfikatorem +1, a przeciwnik otrzymuje dodatkowy kumulatywny modyfikator -1 do rzutu na Ochronę Pancerza.\nZaklęcie nie działa na broń magiczną oraz mechaniczną i runiczną."
    ],
    "7": [
      "8 PRAĆ ICH",
      "RZUCONY NA 7+",
      "Zaklęcie oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, które nie zostały Oszołomione! lub Powalone na ziemię! lub nie Uciekają!, również związane walczą wręcz.\nObjęte działaniem zaklęcia modele automatycznie zdają wszystkie testy STRACHU i GROZY i jeżeli którakolwiek z wrogich postaci znajduje się w zasięgu ruchu szarży i w polu widzenia modelu, to model musi zadeklarować szarżę na wroga (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który odpowiedział na wezwanie Prać Ich)."
    ],
    "8": [
      "9 WEJRZENIE MORKA",
      "RZUCONY NA 7+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”, który po udanym rzuceniu uderza w cel z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "9": [
      "10 GORK NAPRAWIĆ",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 18” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel), który należy przykryć 3” okrągłym wzornikiem.\nDopóki zaklęcie pozostaje w grze każda 6 w rzutach na trafienie, zranienie oraz Ochronę Pancerza i Magiczną Ochronę wykonanych przez ofiary klątwy uznana będzie za 1.\nJeżeli pod wpływem zaklęcia znajdzie się MAG przeciwnika, każda 6, jaką uzyska w rzucie na wymagany poziom mocy uznawana będzie za 1 i może doprowadzić do przekleństwa Tzeentcha, a także będzie zapobiegać rzuceniu czarów z nieodpartą mocą (oprócz innych skutków, jakie może przynieść).\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 Z BYKA GO",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 18”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 KLONTWA ZŁEGO KSIENZYCA",
      "RZUCONY NA 15+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika (wybraną przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że MAG musi widzieć swój cel).\nOfiara klątwy zostaje Powalona na ziemię! i upada zanosząc się upiornym, histerycznym śmiechem. By ustalić czy ofiara zaklęcia pęknie ze śmiechu, obydwaj gracze muszą wykonać rzut K6. Jeżeli gracz, którego MAG rzucił zaklęcie uzyska wynik równy bądź niższy od przeciwnika, postać przeciwnika dalej zanosi się śmiechem i w następnej turze wciąż traktowana jest jako Powalony na ziemię!, jeżeli jednak uzyska wynik wyższy od przeciwnika, model pęka ze śmiechu i zostaje Wyłączony z akcji!.\nGracze rzucają K6 i powtarzają całą procedurę w każdej fazie magii, póki gracz dowodzący MAGIEM nie uzyska wyniku wyższego od przeciwnika lub klątwa nie zostanie rozproszona.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ]
  },
  "Magia Pradawnych": {
    "1": [
      "1-2 MAGICZNE ŻĄDŁO",
      "RZUCONY NA 5+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 12”, który po udanym rzuceniu uderza w cel z SIŁĄ 3 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "2": [
      "3 WIEDŹMI LOT",
      "RZUCONY NA 7+",
      "MAG może rzucić zaklęcie na samego siebie lub dowolny sprzymierzony model bohatera lub stronnika w odległości do 6”, nawet jeśli go nie widzi.\nZaklęcie można rzucić na PIESZY model wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej), również związany walką wręcz.\nUdane rzucenie zaklęcia oznacza, że model może wykonać zwykły ruch LOTU na 16”, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który wykonał LOT). Model może nawet, jeśli gracz sobie tego życzy, przerwać walkę, w której brał udział, ale w takim wypadku nie będzie mógł szarżować."
    ],
    "3": [
      "4 PANCERZ ETERU",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG otrzymuje Magiczną Ochronę na 4+."
    ],
    "4": [
      "5 RĘKA MŁOT",
      "RZUCONY NA 8+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nDopóki zaklęcie pozostaje w grze MAG podlega zasadzie specjalnej BYCZA SZARŻA i SZTUKA CICHEJ ŚMIERCI."
    ],
    "5": [
      "6 ZIONIĘCIE",
      "RZUCONY NA 10+",
      "Zaklęcie może zostać rzucone na dowolną postać przeciwnika, również związaną walką wręcz, która znajduje się w polu widzenia MAGA.\nPo udanym rzuceniu zaklęcia należy użyć wzornika płomienia.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "6": [
      "7 WYSSANIE MAGII",
      "RZUCONY NA 6+",
      "Zaklęcie działa do początku następnej fazy magii MAGA.\nWymagany poziom mocy wszystkich zaklęć rzucanych w czasie trwania Wyssania Magii zostaje zwiększony o +3."
    ],
    "7": [
      "8 GWIEZDNY PORTAL",
      "RZUCONY NA 7+, POZOSTAJE W GRZE",
      "Udane rzucenie zaklęcia tworzy magiczne wrota łączące dwa punkty na stole, które muszą znajdować się w odległości do 24” od MAGA.\nDopóki zaklęcie pozostaje w grze modele (wrogie i sprzymierzone) traktują na potrzeby ruchu, ale nie pola widzenia, magiczne wrota jak zwykłe drzwi, przez które model może wykonać ruch jak w fazie ruchu, który może być również ruchem szarży (szarża ta podlegać będzie wszystkim zasadom szarży, z wyjątkiem tego, że nie można próbować przejąć szarży modelu, który przekroczył magiczne wrota)."
    ],
    "8": [
      "9 TRZECIE PROROCTWO",
      "RZUCONY NA 9+, POZOSTAJE W GRZE",
      "Moc zaklęcia oddziałuje na MAGA i wszystkie sprzymierzone modele znajdujące się w odległości do 12\" od MAGA, również związane walczą wręcz.\nDopóki zaklęcie pozostaje w grze modele mogą przerzucić nieudane rzuty na trafienie, zranienie oraz Ochronę Pancerza i Magiczną Ochronę. Wynik drugiego rzutu jest ostateczny."
    ],
    "9": [
      "10 KLĄTWA QHAYSH",
      "RZUCONY NA 10+, POZOSTAJE W GRZE",
      "Klątwa ma zasięg 24” i po udanym rzuceniu może zostać skierowana na pojedynczą postać przeciwnika, także związaną walką wręcz (wybrany przez kierującego MAGIEM gracza bez ograniczeń, z wyjątkiem tego, że postać musi widzieć swój cel), którą należy przykryć 5” okrągłym wzornikiem.\nObok trafionych postaci należy umieścić sześciościenną kostkę, tak aby wskazywała wynik ‘1’.\nDopóki zaklęcie pozostaje w grze, na początku każdej kolejnej fazy magii MAGA należy obracać kostkę tak, by wskazywała wynik o +1 większy. Wynik na kostce oznacza ujemny kumulatywny modyfikator do współczynników SZ, S i WT jaki otrzymuje ofiara klątwy. Współczynniki mogą zostać obniżone do minimalnej wartości 1.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "10": [
      "11 OGIEŃ SALAMANDRY",
      "RZUCONY NA 11+",
      "Zaklęcie jest magicznym pociskiem o zasięgu 24”.\nPo udanym rzuceniu zaklęcia należy użyć 3” okrągłego wzornika i przykryć nim wybraną na cel postać przeciwnika.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza."
    ],
    "11": [
      "12 OGNISTE ODRODZENIE SALAMANDRY",
      "RZUCONY NA 14+, POZOSTAJE W GRZE",
      "MAG może rzucić zaklęcie na siebie.\nJeżeli MAG zostanie Wyłączony z akcji! w czasie, gdy zaklęcie pozostawało w grze, należy użyć 3” okrągłego wzornika i przykryć nim Wyłączony z akcji! model MAGA.\nTrafione modele otrzymują uderzenie z SIŁĄ 4 z zasadą specjalną PŁONĄCY ATAK bez możliwości skorzystania z Ochrony Pancerza.\nW najbliższej fazie ruchu model MAGA powstaje podczas wykonywania pozostałych ruchów, tak jak postać, która była Oszołomiona!. Model może wykonać ruch (ale nie bieg lub LOT) lub strzelać lub rzucać zaklęcia lub odmawiać modlitwy. Jeśli model pozostaje związany walką wręcz to do końca trwania tury, w której powstał będzie atakował jako ostatni bez względu na wartość INICJATYWY lub zasady specjalne którym podlega.\nOd momentu powstania model należy traktować tak, jakby wciąż posiadał 1 punkt ŻW."
    ]
  },
  "Duchowny (modlitwy do Vereny)": {
    "1": [
      "1-3 BŁOGOSŁAWIEŃSTWO BOGINI MĄDROŚCI",
      "ODMÓWIONA PRZED ROZGRYWKĄ",
      "Modlitwa musi zostać odmówiona przed rozgrywką i oddziałuje na DUCHOWNEGO lub K3 dowolne sprzymierzone modele PIESZYCH bohaterów lub stronników wielkości człowieka lub mniejszych (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej).\nDo końca rozgrywki objęte działaniem modlitwy modele podlegają zasadzie specjalnej NIEZŁOMNY, a przeprowadzając test oparty na współczynniku CP wykonują rzut 3K6 odrzucając kostkę z najwyższym wynikiem."
    ],
    "2": [
      "4 MIECZ SPRAWIEDLIWOŚCI",
      "POZOSTAJE W GRZE",
      "Moc modlitwy oddziałuje na DUCHOWNEGO.\nDopóki modlitwa pozostaje w grze dzierżony przez DUCHOWNEGO miecz traktowany są jak broń z zasadą specjalną MAGICZNY ATAK i MISTRZOWSKIE WYKONANIE, a trafione i zranione orężem modele nie mogą skorzystać z Ochrony Pancerza.\nWładający mieczem DUCHOWNY może przerzucić wszystkie nieudane rzuty na trafienie. Wynik drugiego rzutu jest ostateczny."
    ],
    "3": [
      "5 KAJDANY VERENY",
      "",
      "Moc modlitwy może zostać skierowana na pojedynczy model przeciwnika, także związany walką wręcz znajdujący się w odległości do 12” od DUCHOWNEGO (postać zostaje wybrana przez kierującego DUCHOWNYM bez ograniczeń, z wyjątkiem tego, że DUCHOWNY musi widzieć swój cel). Ofiara klątwy mysi wykonać test CP. Nieudany test oznacza, że do początku następnej fazy magii DUCHOWNEGO ofiara klątwy zostaje unieruchomiona i jest traktowana jak Oszołomiona!.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "4": [
      "6 JASNOŚĆ UMYSŁU",
      "POZOSTAJE W GRZE",
      "Moc modlitwy oddziałuje na DUCHOWNEGO lub dowolny sprzymierzony model PIESZY bohatera lub stronnika wielkości człowieka lub mniejszy (reguła nie dotyczy modeli na podstawkach, których co najmniej jedna krawędź mierzy 40 mm i więcej).\nDopóki modlitwa pozostaje w grze objęty działaniem modlitwy model przeprowadzając test oparty na współczynniku CP wykonuje rzut 3K6 odrzucając kostkę z najwyższym wynikiem."
    ],
    "5": [
      "7 KRADZIEŻ ROZUMU",
      "POZOSTAJE W GRZE",
      "Po udanym odmówieniu modlitwy kierujący DUCHOWNYM gracz wybiera dowolny, znajdujący się w polu widzenia i w odległości do 12” od DUCHOWNEGO wrogi model, który należy przykryć 3” okrągłym wzornikiem. Dopóki modlitwa pozostaje w grze trafione modele odczuwają efekty działania zasady specjalenj GŁUPOTA.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "6": [
      "8 BOSKA ŚWIATŁOŚĆ",
      "POZOSTAJE W GRZE",
      "Po udanym odmówieniu modlitwy kierujący DUCHOWNYM gracz wybiera dowolny, znajdujący się w polu widzenia i w odległości do 18” od DUCHOWNEGO obszar na powierzchni stołu, który należy przykryć 3” okrągłym wzornikiem. Dopóki modlitwa pozostaje w grze ofiary klątwy nie mogą biegać oraz podlegają zasadzie specjalnej UDERZA JAKO OSTATNI. Ponadto, pole widzenia wszystkich modeli (wrogich i sprzymierzonych), znajdujących się na przykrytym wzornikiem obszarze zostaje ograniczone do 2K6”.\nDopóki modlitwa pozostaje w grze rzut określający zasięg pola widzenia, należy wykonać na początku tury każdego z graczy, w fazie rozpoczęcia tury. Wynik obowiązuje wszystkie modele znajdujące się na przykrytym wzornikiem obszarze, nie ma potrzeby wykonywać osobnego rzutu dla każdego z drużynników."
    ],
    "7": [
      "9 MAJESTAT VERENY",
      "POZOSTAJE W GRZE",
      "Moc modlitwy oddziałuje na DUCHOWNEGO.\nDopóki modlitwa pozostaje w grze DUCHOWNY otrzymuje Magiczną Ochronę na 4+, a wszystkie modele (wrogie i sprzymierzone) w kontakcie z podstawką DUCHOWNEGO, na początku fazy walki wręcz otrzymują jedno trafienie o SILE 4 bez możliwości skorzystania z Ochrony Pancerza.\nModele z zasadą specjalną DEMON lub ISTOTA ETERYCZNA lub LEŚNY DUCH lub MAG lub NIEUMARŁY lub OPĘTANY otrzymują trafienie o SILE 6 bez możliwości skorzystania z Ochrony Pancerza."
    ]
  },
  "Duchowny (Magia Jelit)": {
    "1": [
      "1-3 SOK Z DEMONA",
      "ODMÓWIONA PRZED ROZGRYWKĄ",
      "Modlitwa musi zostać odmówiona przed rozgrywką i oddziałuje na DUCHOWNEGO lub dowolny sprzymierzony PIESZY model bohatera lub stronnika na podstawce 40x40 mm lub większej.\nDo końca rozgrywki objęty działaniem modlitwy model otrzymuje Magiczną Ochronę na 5+."
    ],
    "2": [
      "4 KOŚCIOCHRUP",
      "POZOSTAJE W GRZE",
      "Moc modlitwy oddziałuje na DUCHOWNEGO.\nDopóki modlitwa pozostaje w grze dzierżony przez DUCHOWNEGO maczuga ogrów lub broń wielka traktowany są jak broń z zasadą specjalną DRUZGOCZĄCY oraz MAGICZNY ATAK i PRECYZYJNE UDERZENIE, a trafione i zranione orężem modele nie mogą skorzystać z Ochrony Pancerza."
    ],
    "3": [
      "5 KRWAWA PAPKA",
      "",
      "Moc modlitwy może zostać skierowana na pojedynczy model przeciwnika, także związany walką wręcz znajdujący się w odległości do 12” od DUCHOWNEGO (postać zostaje wybrana przez kierującego DUCHOWNYM bez ograniczeń, z wyjątkiem tego, że DUCHOWNY musi widzieć swój cel). Ofiara modlitwy musi wykonać test WT. Nieudany test oznacza, że wrogi model otrzymuje jedno trafienie o SILE K6 bez możliwości skorzystania z Ochrony Pancerza. Natomiast udany test WT oznacza, że to model DUCHOWNEGO otrzymuje jedno trafienie o SILE K6 bez możliwości skorzystania z Ochrony Pancerza!"
    ],
    "4": [
      "6 BYKOŻERCA",
      "POZOSTAJE W GRZE",
      "Moc modlitwy oddziałuje na DUCHOWNEGO i wszystkie sprzymierzone modele znajdujące się w odległości do 12\", również związane walczą wręcz.\nDopóki modlitwa pozostaje w grze, objęte działaniem modlitwy modele podlegają zasadzie specjalnej DRUZGOCZĄCY."
    ],
    "5": [
      "7 MÓZGOŻER",
      "POZOSTAJE W GRZE",
      "Po udanym odmówieniu modlitwy kierujący DUCHOWNYM gracz wybiera dowolny, znajdujący się w polu widzenia i w odległości do 12” od DUCHOWNEGO wrogi model, który należy przykryć 3” okrągłym wzornikiem. Dopóki modlitwa pozostaje w grze DUCHOWNY wzbudza GROZĘ w objętych klątwą wrogich modelach.\nPostać może znajdować się pod działaniem tylko jednej klątwy na raz."
    ],
    "6": [
      "8 ZĘBOŁAMACZ",
      "POZOSTAJE W GRZE",
      "Po udanym odmówieniu modlitwy kierujący DUCHOWNYM gracz wybiera dowolny, znajdujący się w polu widzenia i w odległości do 18” od DUCHOWNEGO obszar na powierzchni stołu, który należy przykryć 5” okrągłym wzornikiem. Dopóki modlitwa pozostaje w grze przykryty wzornikiem obszar należy traktować jak teren niebezpieczny."
    ],
    "7": [
      "9 JELITA TROLLA GÓRSKIEGO",
      "POZOSTAJE W GRZE",
      "Moc modlitwy oddziałuje na DUCHOWNEGO.\nRzeźnik na skutek bólu i wewnętrznych poparzeń spowodowanych kwasem żołądkowych trolla otrzymuje trafienie o SILE K6 bez możliwości skorzystania z Ochrony Pancerza.\nDopóki modlitwa pozostaje w grze DUCHOWNY podlega zasadzie specjalnej REGENERACJA oraz ODPORNOŚĆ NA MAGIĘ (2) i ŁUSKOWATA SKÓRA (5+)."
    ]
  }
};
