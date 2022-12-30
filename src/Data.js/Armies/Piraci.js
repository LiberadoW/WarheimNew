import { heroEquipment } from "../HeroEquipment";

export const piraci = {
  heroes: {
    Kapitan: {
      id: 0,
      startingEquipment: ["Sztylet", "Rapier"],
      cost: 60,
      number: 1,
      equipmentList: heroEquipment["Piraci z Sartosy"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Dowodzenie", "Dowódca"],
      exp: 20,
      skills: [0, 1, 2, 3, 4, 5],
    },
    Czarownik: {
      id: 1,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Piraci z Sartosy"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Guślarstwo", "Mag (Kolegia Magii)"],
      exp: 12,
      skills: [2,4,5],
    },
    "Kapłan Mannana": {
      id: 2,
      startingEquipment: ["Sztylet", "Trójząb"],
      cost: 40,
      number: 1,
      equipmentList: heroEquipment["Piraci z Sartosy"].Kapłan,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: [
        "Błogosławieństwo bogów",
        "Czarostwo",
        "Duchowny (modlity do Mannana)",
        "Modlitwa",
        "Pogarda",
      ],
      exp: 12,
      skills: [0, 2, 3, 5],
    },
    Bosman: {
      id: 3,
      startingEquipment: ["Sztylet", "Buława/Maczuga/Młot bojowy"],
      cost: 35,
      number: 1,
      equipmentList: heroEquipment["Piraci z Sartosy"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Podoficer"],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    "Handlarz niewolników": {
      id: 4,
      startingEquipment: ["Sztylet", "Łapacz"],
      cost: 30,
      number: 2,
      equipmentList: heroEquipment["Piraci z Sartosy"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Handlarz niewolników", "Żertwa"],
      exp: 8,
      skills: [0, 3, 5],
    },
    Mat: {
      id: 5,
      startingEquipment: ["Sztylet"],
      cost: 20,
      number: 2,
      equipmentList: heroEquipment["Piraci z Sartosy"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 2, 3, 3, 1, 3, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Przyboczny"],
      exp: 0,
      skills: [0, 1, 4, 5],
    },
    Niewolnik: {
      id: 6,
      startingEquipment: ["Broń improwizowana"],
      cost: 10,
      number: 15,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [4, 2, 2, 3, 3, 1, 3, 1, 2],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Mięso armatnie", "Niewolnik", "Rozmiar rzondzi"],
    },
    Pirat: {
      id: 6,
      startingEquipment: ["Sztylet"],
      cost: 20,
      number: 15,
      equipmentList: heroEquipment["Piraci z Sartosy"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Chorążowie & sygnaliści", "Drużyna obsługi"],
    },
    "Żołnierz okrętowy": {
      id: 7,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 35,
      number: 5,
      equipmentList: heroEquipment["Piraci z Sartosy"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 4, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Szermierz"],
    },
    Przepatrywacz: {
      id: 8,
      startingEquipment: [
        "Sztylet",
        "Miecz",
        "Włócznia",
        "Koń bojowy",
        "Siodło & uprząż",
      ],
      cost: 80,
      number: 3,
      equipmentList: heroEquipment["Piraci z Sartosy"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: ["Kawalerzysta", "Lekka jazda", "Ranger", "Zwiadowca"],
    },
    Ogr: {
      id: 9,
      startingEquipment: ["Maczuga ogrów"],
      cost: 160,
      number: 1,
      equipmentList: heroEquipment["Piraci z Sartosy"].Ogr,
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
    Więźniarka: {
      id: 10,
      startingEquipment: [],
      cost: 185,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
        Koń: [8, 3, 0, 3, "-", "-", 3, 1, 5],
        "Koń ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: ["Duży cel", "Machina wojenna", "Powóz", "Więźniarka"],
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
  name: "Piraci z Sartosy",
  nature: "Zła",
  armyRules: ["Kontakty handlowe (3)", "Rozrzutni"],
  mercenaries: [
    "Balistyk",
    "Bombardier",
    "Gladiator",
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
    "Tileański kusznik",
    "Trefniś",
    "Woźnica",
    "Wróżbita",
    "Złodziej",
    "Zwadźca",
    "Zwiadowca",
  ],
};
