import { heroEquipment } from "../HeroEquipment";

export const psyWojny = {
  heroes: {
    Kapitan: {
      id: 0,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 60,
      number: 1,
      equipmentList: heroEquipment["Psy Wojny"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Dowódca"],
      exp: 20,
      skills: [0, 1, 2, 3, 4, 5],
    },
    Czarownik: {
      id: 1,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Psy Wojny"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Guślarstwo", "Mag (Kolegia Magii)"],
      exp: 12,
      skills: [2,4,5],
    },
    "Kapłan Myrmidii": {
      id: 2,
      startingEquipment: ["Sztylet", "Włócznia"],
      cost: 40,
      number: 1,
      equipmentList: heroEquipment["Psy Wojny"].Kapłan,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 2, 4, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: [
        "Błogosławieństwo bogów",
        "Czarostwo",
        "Duchowny (modlity do Myrmidii)",
        "Modlitwa",
        "Szermierz",
      ],
      exp: 12,
      skills: [0, 2, 4, 5],
    },
    Sierżant: {
      id: 3,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 35,
      number: 1,
      equipmentList: heroEquipment["Psy Wojny"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Podoficer"],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    Adiutant: {
      id: 4,
      startingEquipment: ["Sztylet"],
      cost: 15,
      number: 2,
      equipmentList: heroEquipment["Psy Wojny"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 2, 2, 3, 3, 1, 3, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Przyboczny"],
      exp: 0,
      skills: [0, 1, 4, 5],
    },
    Najemnik: {
      id: 5,
      startingEquipment: ["Sztylet"],
      cost: 25,
      number: 15,
      equipmentList: heroEquipment["Psy Wojny"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Chorążowie & sygnaliści", "Drużyna obsługi","Szermierz"],
    },
    "Oblężnik z Remas": {
        id: 6,
        startingEquipment: ["Sztylet","Kusza","Pawęż"],
        cost: 40,
        number: 7,
        equipmentList: heroEquipment["Psy Wojny"].Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 4, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Celny strzał","Pewny strzał"],
      },
      Lansjer: {
        id: 7,
        startingEquipment: [
          "Sztylet",
          "Miecz",
          "Włócznia",
          "Koń bojowy",
          "Siodło & uprząż",
        ],
        cost: 80,
        number: 3,
        equipmentList: heroEquipment["Psy Wojny"].Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
          "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Kawalerzysta", "Lekka jazda", "Szermierz"],
      },
      Ogr: {
        id: 8,
        startingEquipment: ["Maczuga ogrów"],
        cost: 160,
        number: 1,
        equipmentList: heroEquipment["Psy Wojny"].Ogr,
        type: "Stronnik",
        stats: {
          Początkowa: [6, 3, 2, 4, 4, 3, 2, 2, 7],
          Maksymalna: [6, 6, 5, 5, 5, 5, 6, 5, 9],
        },
        rules: [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Oznakowany gnoblar (gnoblar-uwaga)",
          "Przepastne trzewia",
          "Strach",
          "Tempy",
          "Wielkolud",
        ],
      },
      "Ptasznik z Catrazzy": {
        id: 9,
        startingEquipment: ["Sztylet","Miecz","Mechaniczne skrzydła"],
        cost: 50,
        number: 3,
        equipmentList: heroEquipment["Psy Wojny"].Stronnicy,
        type: "Stronnik",
        stats: {
            Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
            Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: [
          "Lot","Ptasznik","Ranger","Zwiadowca"
        ],
      },
      "Wóz bojowy": {
        id: 10,
        startingEquipment: [],
        cost: 175,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
          Koń: [8, 3, 0, 3, "-", "-", 3, 1, 5],
          "Koń ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel", "Machina wojenna", "Powóz", "Wóz bojowy"],
      },
      Rydwan: {
        id: 11,
        startingEquipment: [],
        cost: 125,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Rydwan: ["-", "-", "-", 5, 5, 8, "-", "-", "-"],
          Koń: [8, 3, 0, 3, "-", "-", 3, 1, 5],
          "Koń ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel", "Machina wojenna", "Rydwan"],
      },
  },
  limit: 500,
  minModels: 3,
  maxModels: 15,
  name: "Psy Wojny",
  nature: "Neutralna",
  armyRules: ["Kompa najemników", "Podatek", "Rozrzutni"],
  mercenaries: [
    "Balistyk",
    "Bombardier",
    "Czarownica",
    "Gladiator",
    "Hiena cmentarna",
    "Kartograf",
    "Kupiec",
    "Łowca nagród",
    "Magus",
    "Medyk",
    "Minstrel",
    "Miotacz ołowiu",
    "Ochroniarz",
    "Ordynans",
    "Pogromca Trolli",
    "Poszukiwacz złota",
    "Rozbójnik",
    "Rycerz najemny",
    "Skryba",
    "Strażnik dróg",
    "Szczurołap",
    "Szpieg",
    "Trefniś",
    "Woźnica",
    "Wróżbita",
    "Złodziej",
    "Zwadźca",
    "Zwiadowca",
  ],
};
