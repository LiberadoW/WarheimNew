import { heroEquipment } from "../HeroEquipment";

export const jeźdzcyWilków = {
  heroes: {
    Herszt: {
      id: 0,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 55,
      number: 1,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 4, 3, 3, 2, 5, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 7],
      },
      rules: ["Dowódca", "Kawalerzysta", "Lekka jazda", "Zasadzka"],
      exp: 20,
      skills: [0, 1, 3, 4, 5],
    },
    "Szaman Hobgoblinów": {
      id: 1,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 4, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 7],
      },
      rules: [
        "Guślarstwo",
        "Mag (Kolegia Magii)",
        "Kawalerzysta",
        "Lekka jazda",
      ],
      exp: 10,
      skills: [0, 1, 4, 5],
    },
    Siepacz: {
      id: 2,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 35,
      number: 1,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 3, 3, 1, 4, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 7],
      },
      rules: ["Kawalerzysta", "Lekka jazda"],
      exp: 8,
      skills: [0, 1, 3, 4, 5],
    },
    "Łowca niewolników": {
      id: 3,
      startingEquipment: ["Sztylet", "Łapacz"],
      cost: 25,
      number: 1,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 4, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 7],
      },
      rules: ["Handlarz niewolników", "Kawalerzysta", "Lekka jazda", "Żertwa"],
      exp: 8,
      skills: [0, 1, 4, 5],
    },
    Niewolnik: {
      id: 4,
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
    Hobgoblin: {
      id: 5,
      startingEquipment: ["Sztylet", "Buława/Maczuga/Młot bojowy"],
      cost: 20,
      number: 15,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Hobgoblin,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 4, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 7],
      },
      rules: [
        "Animozja",
        "Chorążowie & sygnaliści",
        "Drużyna obsługi",
        "Zasadzka",
      ],
    },
    "Wilczy jeździec": {
      id: 6,
      startingEquipment: [
        "Sztylet",
        "Włócznia",
        "Tarcza",
        "Wielki wilk",
        "Siodło & uprząż",
      ],
      cost: 80,
      number: 3,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 4, 1, 6],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 7],
        "Wielki wilk": [9, 3, 0, 4, "-", "-", 3, 1, 3],
      },
      rules: ["Animozja", "Kawalerzysta", "Lekka jazda", "Zasadzka"],
    },
    Wilkor: {
      id: 7,
      startingEquipment: ["Broń naturalna"],
      cost: 25,
      number: 5,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [7, 4, 0, 4, 3, 1, 3, 1, 5],
        Maksymalna: [7, 4, 0, 4, 3, 1, 3, 1, 5],
      },
      rules: ["Rączy", "Zwierzę"],
    },
    Ogr: {
      id: 8,
      startingEquipment: ["Maczuga ogrów"],
      cost: 160,
      number: 1,
      equipmentList: heroEquipment["Jeźdzcy Wilków"].Ogr,
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
      id: 9,
      startingEquipment: [],
      cost: 175,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
        "Wielki wilk": [9, 3, 0, 4, "-", "-", 3, 1, 3],
        "Wielki wilk ": [9, 3, 0, 4, "-", "-", 3, 1, 3],
      },
      rules: ["Duży cel", "Machina wojenna", "Powóz", "Więźniarka"],
    },
    Rydwan: {
      id: 10,
      startingEquipment: [],
      cost: 125,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Rydwan: ["-", "-", "-", 5, 5, 8, "-", "-", "-"],
        "Wielki wilk": [9, 3, 0, 4, "-", "-", 3, 1, 3],
        "Wielki wilk ": [9, 3, 0, 4, "-", "-", 3, 1, 3],
      },
      rules: ["Duży cel", "Machina wojenna", "Rydwan"],
    },
  },
  limit: 500,
  minModels: 3,
  maxModels: 15,
  name: "Jeźdzcy Wilków",
  nature: "Zła",
  armyRules: ["Podatek", "Rozrzutni"],
  mercenaries: [
    "Czarownica",
    "Hiena cmentarna",
    "Łowca nagród",
    "Miotacz ołowiu",
    "Ochroniarz",
    "Porywacz zwłok",
    "Rozbójnik",
    "Szczelec",
    "Szpieg",
    "Złodziej",
  ],
};
