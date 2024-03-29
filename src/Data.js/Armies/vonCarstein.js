import { heroEquipment } from "../HeroEquipment";

export const vonCarstein = {
    heroes: {
      "Hrabia Von Carstein": {
        id: 0,
        startingEquipment: ["Sztylet", "Rapier"],
        cost: 100,
        number: 1,
        equipmentList:
          heroEquipment["Nieumarła świta Hrabiego Von Carstein"].Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [5, 5, 4, 4, 4, 2, 6, 1, 9],
          Maksymalna: [6, 8, 6, 7, 6, 4, 9, 4, 10],
        },
        rules: [
          "Anatema",
          "Dowodzenie",
          "Dowódca",
          "Głód krwi",
          "Hipnotyczne spojrzenie",
          "Łatwopalność",
          "Nieumarły",
          "Strach",
        ],
        exp: 20,
        skills: [0, 2, 3, 4, 5],
      },
      Nekromanta: {
        id: 1,
        startingEquipment: ["Sztylet", "Kostur"],
        cost: 45,
        number: 1,
        equipmentList:
          heroEquipment["Nieumarła świta Hrabiego Von Carstein"].Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Animacja", "Mag (Dziedzina Nekromancji)"],
        exp: 8,
        skills: [0, 2, 5],
      },
      Dreg: {
        id: 2,
        startingEquipment: ["Sztylet"],
        cost: 25,
        number: 3,
        equipmentList:
          heroEquipment["Nieumarła świta Hrabiego Von Carstein"].Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Żywa tarcza"],
        exp: 8,
        skills: [0, 3, 5],
      },
      Szkielet: {
        id: 3,
        startingEquipment: ["Sztylet"],
        cost: 15,
        number: 15,
        equipmentList:
          heroEquipment["Nieumarła świta Hrabiego Von Carstein"].Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 2, 2, 3, 3, 1, 2, 1, 3],
          Maksymalna: [4, 2, 2, 3, 3, 1, 2, 1, 3],
        },
        rules: [
          "Chorążowie & sygnaliści",
          "Drużyna obsługi",
          "Nieumarły",
          "Strach",
        ],
      },
      Ghoul: {
        id: 4,
        startingEquipment: ["Broń naturalna (zatruty atak)"],
        cost: 40,
        number: 5,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 0, 3, 4, 1, 3, 2, 6],
          Maksymalna: [5, 6, 0, 4, 4, 3, 6, 4, 8],
        },
        rules: ["Głód krwi", "Murołaz", "Ograniczony", "Strach"],
      },
      Zombie: {
        id: 5,
        startingEquipment: ["Broń naturalna"],
        cost: 20,
        number: 7,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [3, 2, 0, 3, 3, 1, 1, 1, 2],
          Maksymalna: [3, 2, 0, 3, 3, 1, 1, 1, 2],
        },
        rules: [
          "Animacja",
          "Mięso armatnie",
          "Nieumarły",
          "Strach",
          "Trudny do zabicia",
        ],
      },
      Graveir: {
        id: 6,
        startingEquipment: [
          "Broń naturalna (przebicie pancerza, zatruty atak)",
        ],
        cost: 150,
        number: 1,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [6, 3, 0, 4, 4, 3, 2, 2, 6],
          Maksymalna: [6, 6, 0, 5, 5, 5, 6, 5, 8],
        },
        rules: [
          "Bycza szarża",
          "Duży cel",
          "Głód krwi",
          "Łuskowata skóra (5+)",
          "Murołaz",
          "Ograniczony",
          "Przepastne trzewia",
          "Stan niższy",
          "Strach",
          "Tempy",
          "Wielkolud",
          "Zabójczy cios",
        ],
      },
      "Mroczny wilk": {
        id: 7,
        startingEquipment: ["Broń naturalna"],
        cost: 30,
        number: 5,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [9, 3, 0, 3, 3, 1, 3, 1, 3],
          Maksymalna: [9, 3, 0, 3, 3, 1, 3, 1, 3],
        },
        rules: ["Nieumarły", "Rączy", "Strach", "Zwierzę"],
      },
      "Czarna Karoca": {
        id: 8,
        startingEquipment: [],
        cost: 200,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          "Czarna Karoca": ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
          "Nieumarły koń": [8, 2, 0, 3, "-", "-", 2, 1, 4],
          "Nieumarły koń  ": [8, 2, 0, 3, "-", "-", 2, 1, 4],
        },
        rules: ["Duży cel", "Felczer", "Machina wojenna", "Powóz", "Strach"],
        exp: 0,
        skills: [],
      },
      Ścierwowóz: {
        id: 9,
        startingEquipment: [],
        cost: 150,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Ścierwowóz: ["-", "-", "-", 5, 5, 8, "-", "-", "-"],
          "Nieumarły koń": [8, 2, 0, 3, "-", "-", 2, 1, 4],
          "Nieumarły koń  ": [8, 2, 0, 3, "-", "-", 2, 1, 4],
        },
        rules: [
          "Duży cel",
          "Machina wojenna",
          "Rydwan",
          "Strach",
          "Ścierwowóz",
        ],
        exp: 0,
        skills: [],
      },
    },
    limit: 500,
    minModels: 3,
    maxModels: 15,
    name: "Nieumarła świta Hrabiego Von Carstein",
    nature: "Praworządna",
    armyRules: [
      "Kontrolowanie ożywieńców",
      "Ofiarowanie",
      "Podatek",
      "Rozrzutni",
    ],
    mercenaries: [
      "Czarownica",
      "Hiena cmentarna",
      "Łowca nagród",
      "Porywacz zwłok",
      "Rozbójnik",
      "Skryba",
      "Szpieg",
      "Woźnica",
      "Złodziej",
    ],
  }

  