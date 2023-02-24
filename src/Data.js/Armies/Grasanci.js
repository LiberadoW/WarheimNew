import { heroEquipment } from "../HeroEquipment";

export const grasanciChaosu = {
  heroes: {
    "Wybraniec Chaosu": {
      id: 0,
      startingEquipment: ["Sztylet", "Broń wielka"],
      cost: 70,
      number: 1,
      equipmentList: heroEquipment["Grasanci Chaosu"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 5, 3, 4, 4, 2, 5, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Dowódca", "Stygmat Chaosu"],
      exp: 20,
      skills: [0, 1, 2, 3, 4, 5],
    },
    "Czarnoksiężnik Chaosu": {
      id: 1,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 50,
      number: 1,
      equipmentList: heroEquipment["Grasanci Chaosu"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 4, 4, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Czarnoksięstwo", "Mag (Dziedzina Chaosu)", "Stygmat Chaosu"],
      exp: 11,
      skills: [0, 2, 4, 5],
    },
    "Wojownik Chaosu": {
      id: 2,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 40,
      number: 1,
      equipmentList: heroEquipment["Grasanci Chaosu"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 4, 4, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Stygmat Chaosu"],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    "Łowca niewolników": {
      id: 3,
      startingEquipment: ["Sztylet", "Łapacz"],
      cost: 40,
      number: 1,
      equipmentList: heroEquipment["Grasanci Chaosu"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 4, 4, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Handlarz niewolników", "Stygmat Chaosu"],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    Niewolnik: {
      id: 4,
      startingEquipment: ["Broń improwizowana"],
      cost: 10,
      number: 12,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [4, 2, 2, 3, 3, 1, 3, 1, 2],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Mięso armatnie", "Niewolnik", "Rozmiar rzondzi"],
    },
    "Grasant Chaosu": {
      id: 5,
      startingEquipment: ["Sztylet"],
      cost: 30,
      number: 12,
      equipmentList: heroEquipment["Grasanci Chaosu"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 4, 3, 3, 4, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Berserk", "Chorążowie & sygnaliści"],
    },
    Odrzucony: {
      id: 6,
      startingEquipment: ["Broń naturalna (przebicie pancerza)"],
      cost: 50,
      number: 3,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [4, 4, 0, 4, 4, 1, 4, "K3", 10],
        Maksymalna: [5, 6, 0, 4, 4, 3, 6, 4, 9],
      },
      rules: [
        "Berserk",
        "Fanatyk",
        "Furia",
        "Stygmat Chaosu",
        "Szaleńcy gniew",
      ],
    },
    Zwierzoczłek: {
      id: 7,
      startingEquipment: ["Sztylet", "Broń wielka"],
      cost: 55,
      number: 3,
      equipmentList: heroEquipment["Grasanci Chaosu"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [5, 4, 3, 4, 4, 1, 3, 1, 7],
        Maksymalna: [5, 4, 3, 4, 4, 1, 3, 1, 7],
      },
      rules: ["Pomiot kniei", "Stygmat Chaosu"],
    },
    "Kawalerzysta Chaosu": {
      id: 8,
      startingEquipment: [
        "Sztylet",
        "Topór bojowy/Nadziak",
        "Oszczep",
        "Koń bojowy",
        "Siodło & uprząż",
      ],
      cost: 80,
      number: 3,
      equipmentList: heroEquipment["Grasanci Chaosu"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 4, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: [
        "Kawalerzysta",
        "Lekka jazda",
        "Ranger",
        "Zwiadowca",
        "Mistrzowie koni",
      ],
    },
    "Ogar Chaosu": {
      id: 9,
      startingEquipment: ["Broń naturalna"],
      cost: 20,
      number: 5,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [7, 4, 0, 4, 3, 1, 3, 1, 5],
        Maksymalna: [7, 4, 0, 4, 3, 1, 3, 1, 5],
      },
      rules: ["Rączy", "Zwierzę"],
    },
    "Ogr Chaosu": {
      id: 10,
      startingEquipment: ["Broń wielka"],
      cost: 180,
      number: 1,
      equipmentList: heroEquipment["Grasanci Chaosu"].Ogr,
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
    "Smoczy Ogr": {
      id: 11,
      startingEquipment: ["Broń wielka"],
      cost: 250,
      number: 1,
      equipmentList: heroEquipment["Grasanci Chaosu"].Ogr,
      type: "Stronnik",
      stats: {
        Początkowa: [7, 4, 2, 5, 4, 3, 2, 2, 8],
        Maksymalna: [7, 6, 3, 5, 5, 5, 4, 5, 9],
      },
      rules: [
        "Bycza szarża",
        "Centaur",
        "Duży cel",
        "Furia grzmotu",
        "Głód trzewi",
        "Łuskowata skóra (5+)",
        "Przepastne trzewia",
        "Strach",
        "Stygmat Chaosu",
        "Tempy",
        "Wielkolud",
      ],
    },
    "Troll Chaosu": {
      id: 12,
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
    Więźniarka: {
      id: 13,
      startingEquipment: [],
      cost: 185,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
        "Rumak Chaosu": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        "Rumak Chaosu ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: ["Duży cel", "Machina wojenna", "Powóz", "Więźniarka"],
    },
    "Rydwan Chaosu": {
      id: 14,
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
  limit: 500,
  minModels: 3,
  maxModels: 12,
  name: "Grasanci Chaosu",
  nature: "Chaotyczna",
  armyRules: ["Oko Chaosu", "Rozrzutni", "Znak Chaosu"],
  mercenaries: [],
};
