// Weapon and armour profiles transcribed from
// https://warheimer.netlify.app/docs/ekwipunek (broń do walki wręcz, broń
// dystansowa, broń prochowa, pancerze) and checked against ROZDZIAŁ 14:
// EKWIPUNEK of the rulebook PDF (AD2026.04.15, pages 426-435). Keys use the
// names from the army equipment lists; several army names map to the same
// profile.
//
// range: maksymalny zasięg, strength: Siła, armour: ochrona,
// rules: zasady oręża.

const MELEE = "Walka wręcz";
const FLAME_TEMPLATE = "Wzornik płomienia";

const melee = (strength, rules) => ({ range: MELEE, strength, rules });
const ranged = (range, strength, rules) => ({ range, strength, rules });
const armour = (armourValue, rules = "") => ({ armour: armourValue, rules });

const thrownKnives = ranged('8"', "Użytkownika", "broń miotana");

// PDF: in melee a pistol is used as a hand weapon and a musket as a polearm.
const PISTOL_MELEE = "; walka wręcz: broń ręczna, ogłuszający";
const MUSKET_MELEE =
  "; walka wręcz: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa";
const POWDER_SUPPORT =
  "; z bronią prochową: pewny strzał, ignoruje wymaga forkietu";

export const equipmentStats = {
  // Broń do walki wręcz
  Bagnet: melee(
    "Użytkownika",
    "drzewcowa, ogłuszający, parowanie, uderza jako pierwszy, wymaga obu rąk, zasięgowa",
  ),
  Bicz: melee("Użytkownika", "broń ręczna, szybki, uderza jako pierwszy, zasięgowa"),
  Bosak: melee("+1", "drzewcowa, uderza jako pierwszy, wymaga obu rąk, zasięgowa"),
  "Broń wielka": melee("+2", "uderza jako ostatni, wymaga obu rąk"),
  "Broń Wielka": melee("+2", "uderza jako ostatni, wymaga obu rąk"),
  "Buława/Maczuga/Młot bojowy": melee("Użytkownika", "broń ręczna, ogłuszający"),
  Buława: melee("Użytkownika", "broń ręczna, ogłuszający"),
  "Młot bojowy": melee("Użytkownika", "broń ręczna, ogłuszający"),
  "Cep bojowy": melee(
    "+1 w pierwszej turze walki wręcz",
    "korbacz, przebicie pancerza, wymaga obu rąk",
  ),
  Chopesz: melee("Użytkownika", "broń ręczna, parowanie, szybki"),
  Katana: melee("Użytkownika", "broń ręczna, parowanie, szybki"),
  Draich: melee(
    "+1",
    "limitowany (3), parowanie, precyzyjne uderzenie, przebicie pancerza, wymaga obu rąk",
  ),
  "Duża dźgacz": melee(
    "+2 w czasie szarży (Obrażenia K3)",
    "drzewcowa, limitowany (1), uderza jako pierwszy, zasięgowa, bycza szarża",
  ),
  "Gwiazda zaranna": melee("Użytkownika", "broń ręczna, przebicie pancerza"),
  Halabarda: melee("+1", "drzewcowa, wymaga obu rąk, zasięgowa" + POWDER_SUPPORT),
  "Kadzielnica ognia": melee(
    "+1",
    "korbacz, limitowany (3), płonący atak, przebicie pancerza, wymaga obu rąk",
  ),
  "Kadzielnica Ognia": melee(
    "+1",
    "korbacz, limitowany (3), płonący atak, przebicie pancerza, wymaga obu rąk",
  ),
  "Kadzielnica zarazy": melee(
    "+1 w pierwszej turze walki wręcz",
    "korbacz, limitowany (1), przebicie pancerza, siewca zarazy, wymaga obu rąk",
  ),
  "Karwasz bojowy": melee("Użytkownika", "broń ręczna, parowanie, wyważony"),
  Khutar: melee(
    "Użytkownika",
    "broń ręczna, łamacz, parowanie, wspinaczka, wyważony",
  ),
  "Wachlarz bojowy": melee(
    "Użytkownika",
    "broń ręczna, łamacz, parowanie, wspinaczka, wyważony",
  ),
  Kopia: melee(
    "+2 w czasie szarży",
    "drzewcowa, uderza jako pierwszy, zasięgowa (tylko kawaleria)",
  ),
  Korbacz: melee("Użytkownika", "korbacz, przebicie pancerza, szybki"),
  Kosa: melee("+1", "szybki, uderza jako pierwszy, wymaga obu rąk"),
  Kostur: melee(
    "Użytkownika",
    "drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa",
  ),
  "Kostur Rykowca": melee(
    "+2 (styl ofensywny)",
    "styl ofensywny: drzewcowa, uderza jako ostatni, wymaga obu rąk, zasięgowa; styl defensywny: ogłuszający, parowanie, wymaga obu rąk, zasięgowa, +2 do Ochrony Pancerza (5+ bez pancerza)",
  ),
  Łamacz: melee("Użytkownika", "broń ręczna, łamacz, parowanie, wyważony"),
  "Łamacz mieczy": melee("Użytkownika", "broń ręczna, łamacz, parowanie, wyważony"),
  Łapacz: melee(
    "Użytkownika",
    "drzewcowa, limitowany (3), unieruchamiający, uderza jako ostatni, wymaga obu rąk, zasięgowa",
  ),
  "Maczuga ogrów": melee(
    "Użytkownika",
    "broń ręczna, ogłuszający, przebicie pancerza",
  ),
  Miecz: melee("Użytkownika", "broń ręczna, parowanie"),
  Mizerykordia: melee("Użytkownika", "broń ręczna, cios łaski, lekki, wyważony"),
  "Młot ulrykański": melee("+1", "przebicie pancerza, wymaga obu rąk"),
  Pika: melee(
    "+1 w pierwszej turze walki wręcz",
    "drzewcowa, wymaga obu rąk, zasięgowa, uderza jako pierwszy przeciw DUŻY CEL, POTWÓR lub WIELKOLUD (trzymać pozycję; tylko piechota)",
  ),
  Rapier: melee(
    "Użytkownika",
    "broń ręczna, lekki, parowanie, precyzyjne uderzenie",
  ),
  Rembak: melee("+1 w pierwszej turze walki wręcz", "broń ręczna"),
  Saearath: melee(
    "Użytkownika",
    "limitowany (3); styl ofensywny: drzewcowa, uderza jako pierwszy, wymaga obu rąk, zasięgowa, walczy jak dwiema brońmi ręcznymi; styl defensywny: drzewcowa, ogłuszający, parowanie, wymaga obu rąk, zasięgowa, +2 do Ochrony Pancerza (5+ bez pancerza)",
  ),
  Spaczhalabarda: melee(
    "+1",
    "druzgoczący, drzewcowa, eksperymentalny, limitowany (3), przebicie pancerza, wymaga obu rąk, zasięgowa" +
      POWDER_SUPPORT,
  ),
  Spaczkhutar: melee(
    "+1",
    "broń ręczna, limitowany (3), łamacz, parowanie, wspinaczka, wyważony, zatruty atak",
  ),
  Sztylet: melee(
    "Użytkownika",
    "broń ręczna, lekki, nie zadaje zranień krytycznych",
  ),
  "Topór bojowy/Nadziak": melee("Użytkownika", "broń ręczna, przebicie pancerza"),
  "Topór bojowy": melee("Użytkownika", "broń ręczna, przebicie pancerza"),
  "Topór z Chrace": melee(
    "+2",
    "druzgoczący, limitowany (3), uderza jako ostatni, wymaga obu rąk",
  ),
  "Topór krasnoludów": melee(
    "Użytkownika",
    "broń ręczna, parowanie, przebicie pancerza",
  ),
  Trójząb: melee(
    "Użytkownika",
    "drzewcowa, łamacz, parowanie, uderza jako pierwszy, wymaga obu rąk, zasięgowa",
  ),
  Wakizashi: melee("Użytkownika", "broń ręczna, cios łaski, lekki, wyważony"),
  Włócznia: melee(
    "Użytkownika (kawaleria: +1 w czasie szarży)",
    "drzewcowa, uderza jako pierwszy, zasięgowa",
  ),

  // Broń dystansowa
  "Arkan/Bolas/Sieć": ranged('8"', "-", "limitowany (3), unieruchamiający"),
  Arkan: ranged('8"', "-", "limitowany (3), unieruchamiający"),
  Bolas: ranged('8"', "-", "limitowany (3), unieruchamiający"),
  Sieć: ranged('8"', "-", "limitowany (3), unieruchamiający"),
  "Broń miotana": thrownKnives,
  "Broń miotana (gwiazdki)": thrownKnives,
  "Broń miotana (noże)": thrownKnives,
  "Broń miotana (topory/młoty)": ranged(
    '6"',
    "Użytkownika +1",
    "broń miotana",
  ),
  "Broń miotana (młoty/topory)": ranged(
    '6"',
    "Użytkownika +1",
    "broń miotana",
  ),
  "Broń miotana (ładunki wybuchowe)": ranged(
    '8"',
    "K6",
    "broń miotana, płonący atak, zawodny",
  ),
  "Ładunki wybuchowe": ranged('8"', "K6", "broń miotana, płonący atak, zawodny"),
  Dmuchawka: ranged(
    '8"',
    "3",
    "broń miotana, mistrz skrytobójstwa, przebicie pancerza, zatruty atak, nie zadaje zranień krytycznych",
  ),
  Harpun: ranged(
    '16"',
    "5",
    "limitowany (1), przebicie pancerza, wymaga przygotowania (2), wymaga obu rąk",
  ),
  "Kula trującego wichru": ranged('8"', "-", "broń miotana, limitowany (1)"),
  Kusza: ranged('24"', "4", "przebicie pancerza, ruch albo strzał, wymaga obu rąk"),
  "Kusza powtarzalna": ranged(
    '18"',
    "3",
    "przebicie pancerza, wielokrotny strzał (2), wymaga obu rąk",
  ),
  "Łuk długi": ranged('24"', "3 (daleki) / 4 (krótki)", "wymaga obu rąk"),
  "Łuk elfów": ranged(
    '24"',
    "3 (daleki) / 4 (krótki)",
    "przebicie pancerza, wymaga obu rąk",
  ),
  "Łuk krótki": ranged('12"', "3", "wymaga obu rąk"),
  Łuk: ranged('18"', "3", "wymaga obu rąk"),
  Oszczep: ranged('12"', "Użytkownika", "broń miotana"),
  "Pistolet strzałkowy": ranged(
    '10"',
    "4",
    "bezpośredni strzał, broń miotana, może zawsze stać & strzelać",
  ),
  "Pistolet strzałkowy powtarzalny": ranged(
    '8"',
    "3",
    "wielokrotny strzał (2), może zawsze stać & strzelać",
  ),
  Proca: ranged('12"', "3", 'wielokrotny strzał (2) we wroga w zasięgu 6"'),
  "Wnyk łańcuchowy": ranged('10"', "K6", "limitowany (1), przebicie pancerza"),

  // Broń prochowa
  Arkebuz: ranged(
    '48"',
    "5 (daleki) / 6 (krótki)",
    "limitowany (1), przebicie pancerza, ruch albo strzał, wymaga forkietu, wymaga obu rąk, wymaga przygotowania, zawodny",
  ),
  Falkonet: ranged(
    FLAME_TEMPLATE,
    "4 (kartacze)",
    "limitowany (1), odłamkowy, przebicie pancerza, ruch albo strzał, wymaga forkietu, wymaga obu rąk, wymaga przygotowania (3), zawodny",
  ),
  Garłacz: ranged(
    FLAME_TEMPLATE,
    "3 (kartacze)",
    "limitowany (3), odłamkowy, ruch albo strzał, wymaga obu rąk, wymaga przygotowania (2), zawodny",
  ),
  "Gołąb bombardujący": ranged(
    '16"',
    "K6",
    "limitowany (3), płonący atak, ruch albo strzał, zawodny",
  ),
  "Granat dymny": ranged('8"', "-", "broń miotana"),
  Granatnik: ranged(
    '16"',
    "6",
    "limitowany (1), przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny",
  ),
  Kulomiot: ranged(
    FLAME_TEMPLATE,
    "K6",
    "eksperymentalny, limitowany (1), przebicie pancerza",
  ),
  "Miotacz spaczognia": ranged(
    "Kostka artyleryjska",
    "K6 (Obrażenia K3)",
    "eksperymentalny, limitowany (1), płonący atak",
  ),
  "Moździerz trującego wichru": ranged('8"–36"', "-", "limitowany (1)"),
  Muszkiet: ranged(
    '24"',
    "4 (daleki) / 5 (krótki)",
    "przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny" + MUSKET_MELEE,
  ),
  "Muszkiet dubeltowy": ranged(
    '24"',
    "4 (daleki) / 5 (krótki)",
    "limitowany (3), przebicie pancerza, ruch albo strzał, wielokrotny strzał (2), wymaga obu rąk, wymaga przygotowania, zawodny" + MUSKET_MELEE,
  ),
  "Muszkiet hochlandzki": ranged(
    '36"',
    "4 (daleki) / 5 (krótki)",
    "limitowany (1), mistrzowskie wykonanie, przebicie pancerza, ruch albo strzał, strzelec wyborowy, wymaga obu rąk, wymaga przygotowania, zawodny" + MUSKET_MELEE,
  ),
  "Muszkiet krasnoludzki": ranged(
    '24"',
    "4 (daleki) / 5 (krótki)",
    "mistrzowskie wykonanie, przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny" + MUSKET_MELEE,
  ),
  Ołowiomiotacz: ranged(
    FLAME_TEMPLATE,
    "4",
    "limitowany (1), przebicie pancerza, wymaga obu rąk, wymaga przygotowania (3)",
  ),
  Pistolet: ranged(
    '8"',
    "4",
    "bezpośredni strzał, broń miotana, może zawsze stać & strzelać, przebicie pancerza, wymaga przygotowania, zawodny" + PISTOL_MELEE,
  ),
  "Pistolet dubeltowy": ranged(
    '8"',
    "4",
    "bezpośredni strzał, broń miotana, limitowany (4), może zawsze stać & strzelać, przebicie pancerza, wielokrotny strzał (2), wymaga przygotowania, zawodny" + PISTOL_MELEE,
  ),
  "Pistolet pojedynkowy": ranged(
    '12"',
    "4",
    "bezpośredni strzał, broń miotana, limitowany (4), mistrzowskie wykonanie, może zawsze stać & strzelać, przebicie pancerza, wymaga przygotowania, zawodny" + PISTOL_MELEE,
  ),
  Revolvera: ranged(
    '18"',
    "4",
    "limitowany (1), ruch albo strzał, wielokrotny strzał (6), wymaga obu rąk, wymaga przygotowania, zawodny",
  ),
  Spaczmuszkiet: ranged(
    '24"',
    "K6 (daleki) / K6 druzgoczący (krótki)",
    "eksperymentalny, przebicie pancerza, ruch albo strzał, wymaga obu rąk, wymaga przygotowania, zawodny" + MUSKET_MELEE,
  ),
  Spaczpistolet: ranged(
    '8"+K6"',
    "K6",
    "bezpośredni strzał, broń miotana, eksperymentalny, limitowany (4), może zawsze stać & strzelać, przebicie pancerza, wymaga przygotowania, zawodny" + PISTOL_MELEE,
  ),
  "Spaczrusznica i pawęża": ranged(
    '48"',
    "K6 (bez Ochrony Pancerza)",
    "eksperymentalny, limitowany (1), strzelec wyborowy, wymaga forkietu, wymaga obu rąk, zawodny",
  ),
  Spaczrusznica: ranged(
    '48"',
    "K6 (bez Ochrony Pancerza)",
    "eksperymentalny, limitowany (1), strzelec wyborowy, wymaga forkietu, wymaga obu rąk, zawodny",
  ),

  // Pancerze
  Lekki: armour("6+", "pancerz skórzany/ćwiekowany"),
  Średni: armour("5+", "pancerz kolczy/zbroja łuskowa"),
  Ciężki: armour("4+", "zbroja płytowa"),
  "Pancerz z Gromrilu": armour("3+", "nie stosuje się przebicia pancerza"),
  "Pancerz z Ithilmaru": armour(
    "4+",
    "ignoruje efekty ciężkiego pancerza z tabeli Wpływ pancerza",
  ),
  "Zbroja Chaosu": armour(
    "3+",
    "ignoruje efekty ciężkiego pancerza; mag może rzucać zaklęcia; nie można jej zdjąć",
  ),
  Hełm: armour(
    "4+ przeciw Powaleniu",
    "udany rzut: model jest Oszołomiony zamiast Powalony",
  ),
  Tarcza: armour(
    "+1 (6+ bez pancerza)",
    "bez Ochrony Pancerza w walce wręcz z bronią wymagającą obu rąk; nie łączy się z parowaniem puklerza",
  ),
  Puklerz: armour(
    "-",
    "parowanie; nie z bronią wymagającą obu rąk",
  ),
};

export const getEquipmentStats = (name) => equipmentStats[name] || null;
