import { heroEquipment } from "../HeroEquipment";

export const skryre = {
  heroes: {
    Spaczinżynier: {
      id: 0,
      startingEquipment: ["Sztylet", "Spaczostrza"],
      cost: 75,
      number: 1,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [5, 4, 4, 4, 3, 2, 5, 1, 7],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: ["Dowódca", "Inżynier", "Ranger", "Technomanta"],
      exp: 20,
      skills: [0, 1, 2, 4, 5],
    },
    Kulomiotacz: {
      id: 1,
      startingEquipment: ["Sztylet", "Kula trującego wichru"],
      cost: 55,
      number: 1,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [5, 3, 4, 3, 3, 1, 5, 1, 5],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: ["Ranger", "Życie jest tanie", "Maska przeciwgazowa"],
      exp: 8,
      skills: [0, 1, 4, 5],
    },
    Czarnoszczur: {
      id: 2,
      startingEquipment: ["Sztylet", "Halabarda"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [6, 4, 3, 3, 3, 1, 5, 1, 5],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: ["Podoficer", "Ranger", "Zimnokrwisty"],
      exp: 8,
      skills: [0, 1, 3, 4, 5],
    },
    "Łowca niewolników": {
      id: 3,
      startingEquipment: ["Sztylet", "Łapacz"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [5, 3, 3, 3, 4, 1, 5, 1, 5],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: ["Handlarz niewolników", "Ranger", "Trudny do zabicia"],
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
    Klanbrat: {
      id: 5,
      startingEquipment: ["Sztylet", "Włócznia"],
      cost: 25,
      number: 15,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [5, 3, 3, 3, 3, 1, 4, 1, 5],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: [
        "Chorążowie & sygnaliści",
        "Drużyna obsługi",
        "Furia",
        "Ranger",
        "Trudny do zabicia",
      ],
    },
    Harcownik: {
      id: 6,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 35,
      number: 7,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [5, 4, 3, 3, 3, 1, 5, 1, 6],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: [
        "Drużyna ciężkich broni",
        "Drużyna obsługi",
        "Ranger",
        "Szermierz",
      ],
    },
    "Drużyna ciężkich broni": {
      id: 7,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 70,
      number: 2,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Ciężcy,
      type: "Stronnik",
      stats: {
        Początkowa: [5, 4, 3, 3, 3, 1, 5, 1, 6],
        Maksymalna: [6, 6, 6, 4, 4, 3, 7, 4, 7],
      },
      rules: [
        "Drużyna ciężkich broni",
        "Drużyna obsługi",
        "Ranger",
        "Szermierz",
      ],
    },
    "Szczurogr klanu Skryre": {
      id: 8,
      startingEquipment: ["Broń naturalna"],
      cost: 250,
      number: 1,
      equipmentList: heroEquipment["Harcownicy klanu Skryre"].Szczurogr,
      type: "Stronnik",
      stats: {
        Początkowa: [6, 3, 3, 5, 4, 3, 4, 3, 5],
        Maksymalna: [6, 3, 3, 5, 4, 3, 4, 3, 5],
      },
      rules: [
        "Bycza szarża",
        "Duży cel",
        "Głód trzewi",
        "Konstrukt",
        "Łuskowata skóra (4+)",
        "Murołaz",
        "Niezłomność",
        "Przepastne trzewia",
        "Strach",
        "Wielkolud",
        "Zwierzę",
        "Zbrojne ramię",
      ],
    },
    "Koło Zagłady": {
      id: 9,
      startingEquipment: [],
      cost: 150,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Rydwan: ["3K6", "-", "-", 5, 5, 8, "-", "-", "-"],
        "Wielkie Szczury": ["-", 2, 0, 3, "-", "-", 4, "K3", 3],
      },
      rules: [
        "Duży cel",
        "Machina wojenna",
        "Rydwan",
        "Strach",
        "Gazuuu!",
        "Zzzzap!",
      ],
    },
    Więźniarka: {
      id: 10,
      startingEquipment: [],
      cost: 175,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
        Wilkoszczur: [9, 3, 0, 3, "-", "-", 4, 1, 3],
        "Wilkoszczur ": [9, 3, 0, 3, "-", "-", 4, 1, 3],
      },
      rules: ["Duży cel", "Machina wojenna", "Powóz", "Więźniarka"],
    },
  },
  limit: 500,
  minModels: 3,
  maxModels: 15,
  name: "Harcownicy klanu Skryre",
  nature: "Chaotyczna",
  armyRules: ["Rozrzutni", "W nogi!"],
  mercenaries: ["Szczurogr", "Szpieg", "Złodziej"],
};