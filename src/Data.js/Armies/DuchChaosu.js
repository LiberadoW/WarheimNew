import { heroEquipment } from "../HeroEquipment";

export const duchChaosu = {
  heroes: {
    Wtajemiczony: {
      id: 0,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 85,
      number: 1,
      equipmentList: heroEquipment["Kult Ducha Chaosu"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: [
        "Czarnoksięstwo",
        "Dowodzenie",
        "Dowódca",
        "Mag (Dziedzina Chaosu Niepodzielonego)",
        "Stygmat Chaosu",
      ],
      exp: 20,
      skills: [0, 2, 4, 5],
    },
    Akolita: {
      id: 1,
      startingEquipment: ["Sztylet", "Gwiazda zaranna"],
      cost: 45,
      number: 2,
      equipmentList: heroEquipment["Kult Ducha Chaosu"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Stygmat Chaosu"],
      exp: 8,
      skills: [0, 4, 5],
    },
    Opętany: {
      id: 2,
      startingEquipment: ["Broń naturalna"],
      cost: 180,
      number: 1,
      equipmentList: {},
      type: "Bohater",
      stats: {
        Początkowa: [5, 3, 0, 4, 4, 3, 2, 2, 7],
        Maksymalna: [6, 7, 0, 5, 5, 4, 5, 5, 10],
      },
      rules: [
        "Bycza szarża",
        "Duży cel",
        "Furia",
        "Głód trzewi",
        "Ograniczony",
        "Przepastne trzewia",
        "Strach",
        "Tempy",
        "Wielkolud",
        "Opętany",
      ],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    Kultysta: {
      id: 3,
      startingEquipment: ["Sztylet"],
      cost: 30,
      number: 12,
      equipmentList: heroEquipment["Kult Ducha Chaosu"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Chorążowie & sygnaliści", "Żywa tarcza"],
    },
    "Furia Chaosu": {
      id: 4,
      startingEquipment: ["Broń naturalna (szybki)"],
      cost: 45,
      number: 5,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [4, 4, 0, 4, 3, 1, 4, 2, 6],
        Maksymalna: [4, 4, 0, 4, 3, 1, 4, 2, 6],
      },
      rules: ["Demon", "Głód krwi", "Strach", "Lot"],
    },
    Zwierzoczłek: {
      id: 5,
      startingEquipment: ["Sztylet", "Broń wielka"],
      cost: 55,
      number: 3,
      equipmentList: heroEquipment["Kult Ducha Chaosu"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [5, 4, 3, 4, 4, 1, 3, 1, 7],
        Maksymalna: [6, 7, 6, 4, 5, 4, 6, 4, 9],
      },
      rules: ["Pomiot kniei", "Stygmat Chaosu"],
    },
    "Ogr Chaosu": {
      id: 6,
      startingEquipment: ["Broń wielka"],
      cost: 180,
      number: 1,
      equipmentList: heroEquipment["Kult Ducha Chaosu"].Ogr,
      type: "Stronnik",
      stats: {
        Początkowa: [6, 3, 2, 4, 4, 3, 2, 2, 7],
        Maksymalna: [6, 6, 5, 5, 5, 5, 6, 5, 9],
      },
      rules: [
        "Bycza szarża",
        "Duży cel",
        "Głód trzewi",
        "Ograniczony",
        "Przepastne trzewia",
        "Strach",
        "Stygmat Chaosu",
        "Tempy",
        "Wielkolud",
      ],
    },
    "Troll Chaosu": {
      id: 7,
      startingEquipment: ["Broń naturalna"],
      cost: 200,
      number: 1,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [6, 3, 1, 5, 4, 3, 1, 3, 4],
        Maksymalna: [6, 3, 1, 5, 4, 3, 1, 3, 4],
      },
      rules: [
        "Bycza szarża",
        "Duży cel",
        "Głód trzewi",
        "Głupota",
        "Nieświadomy",
        "Niezłomność",
        "Przepastne trzewia",
        "Regeneracja",
        "Strach",
        "Stygmat Chaosu",
        "Wielkolud",
        "Żrąca plwocina",
      ],
    },
    Zaprzęg: {
      id: 8,
      startingEquipment: [],
      cost: 175,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
        "Rumak Chaosu": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        "Rumak Chaosu ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: ["Duży cel", "Kontakty handlowe(3)", "Machina wojenna", "Powóz"],
    },
    "Rydwan Chaosu": {
      id: 9,
      startingEquipment: [],
      cost: 125,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Rydwan: ["-", "-", "-", 5, 5, 8, "-", "-", "-"],
        "Rumak Chaosu": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        "Rumak Chaosu ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: ["Duży cel", "Machina wojenna", "Rydwan"],
    },
  },
  limit: 600,
  minModels: 3,
  maxModels: 12,
  name: "Kult Ducha Chaosu",
  nature: "Chaotyczna",
  armyRules: [
    "Kontakty handlowe (1)",
    "Oko Chaosu",
    "Rozrzutni",
    "Zamożność",
    "Znak Chaosu (Niewolnicy Ciemności)",
  ],
  mercenaries: ["Skryba", "Szpieg", "Trefniś", "Woźnica"],
};
