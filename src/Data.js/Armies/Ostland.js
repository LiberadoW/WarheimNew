import { heroEquipment } from "../HeroEquipment";

export const ostland = {
    heroes: {
      Kapitan: {
        id: 0,
        startingEquipment: ["Sztylet", "Miecz"],
        cost: 60,
        number: 1,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Dowódca"],
        exp: 20,
        skills: [0, 1, 2, 3, 4, 5],
      },
      "Magister magii": {
        id: 1,
        startingEquipment: ["Sztylet"],
        cost: 40,
        number: 1,
        equipmentList: {
          "Tradycja Bestii": [0, 4, "Tradycja"],
          "Tradycja Cienia": [0, 4, "Tradycja"],
          "Tradycja Metalu": [0, 4, "Tradycja"],
          "Tradycja Niebios": [0, 4, "Tradycja"],
          "Tradycja Ognia": [0, 4, "Tradycja"],
          "Tradycja Śmierci": [0, 4, "Tradycja"],
          "Tradycja Światła": [0, 4, "Tradycja"],
          "Tradycja Życia": [0, 4, "Tradycja"],
        },
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Mag (Kolegia Magii)"],
        exp: 12,
        skills: [],
      },
      "Prezbiter Sigmara": {
        id: 2,
        startingEquipment: ["Sztylet", "Buława/Maczuga/Młot bojowy"],
        cost: 40,
        number: 1,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Prezbiter,
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: [
          "Błogosławieństwo bogów",
          "Czarostwo",
          "Duchowny (modlitwy do Sigmara)",
          "Modlitwa",
          "Nienawiść",
          "Przepastne trzewia",
        ],
        exp: 12,
        skills: [0, 2, 3, 5],
      },
      Sierżant: {
        id: 3,
        startingEquipment: ["Sztylet", "Miecz"],
        cost: 35,
        number: 1,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Bohaterowie,
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
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 4, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Handlarz niewolników"],
        exp: 8,
        skills: [0, 3, 5],
      },
      Niewolnik: {
        id: 5,
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
      Żołnierz: {
        id: 6,
        startingEquipment: ["Sztylet"],
        cost: 20,
        number: 15,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Chorążowie & sygnaliści", "Drużyna obsługi"],
      },
      Myśliwy: {
        id: 7,
        startingEquipment: ["Sztylet", "Łuk"],
        cost: 25,
        number: 7,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Ranger", "Zwiadowca"],
      },
      Ogr: {
        id: 8,
        startingEquipment: ["Maczuga ogrów"],
        cost: 160,
        number: 1,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Ogr,
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
      Przepatrywacz: {
        id: 9,
        startingEquipment: [
          "Sztylet",
          "Miecz",
          "Włócznia",
          "Koń bojowy",
          "Siodło & uprząż",
        ],
        cost: 80,
        number: 3,
        equipmentList: heroEquipment["Zbrojna kompania z Ostlandu"].Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
          "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Kawalerzysta", "Lekka jazda", "Ranger", "Zwiadowca"],
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
    name: "Zbrojna kompania z Ostlandu",
    nature: "Neutralna",
    armyRules: ["Ekonom"],
    mercenaries: [
      "Balistyk",
      "Bombardier",
      "Gladiator",
      "Goniec",
      "Kartograf",
      "Kupiec",
      "Latarnik",
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
  }