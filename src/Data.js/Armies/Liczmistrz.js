import { heroEquipment } from "../HeroEquipment";

export const liczmistrz = {
  heroes: {
    Liczmistrz: {
      id: 0,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 100,
      number: 1,
      equipmentList: heroEquipment["Nieumarła horda Liczmistrza"].Liczmistrz,
      type: "Bohater",
      stats: {
        Początkowa: [4, 2, 2, 4, 4, 2, 4, 1, 8],
        Maksymalna: [5, 7, 6, 4, 5, 3, 6, 4, 10],
      },
      rules: [
        "Animacja",
        "Dominacja",
        "Dowodzenie",
        "Dowódca",
        "Liczmistrz",
        "Łatwopalność",
        "Mag (Dziedzina Nekromancji)",
        "Mistrz magii",
        "Nekrokleta",
        "Nieumarły",
        "Strach",
        "Wiedza tajemna (Tradycja Śmierci)",
      ],
      exp: 20,
      skills: [0, 3, 4, 5],
    },
    Nekromanta: {
      id: 1,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Nieumarła horda Liczmistrza"].Bohaterowie,
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
      startingEquipment: ["Broń naturalna (zatruty atak)"],
      cost: 55,
      number: 2,
      equipmentList: {},
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 4, 4, 1, 3, 1, 8],
        Maksymalna: [5, 7, 6, 4, 5, 3, 6, 4, 10],
      },
      rules: [
        "Łatwopalność",
        "Nieumarły",
        "Ochronne tatuaże",
        "Strach",
        "Żywa tarcza",
      ],
      exp: 8,
      skills: [0, 3, 5],
    },
    Ghast: {
      id: 3,
      startingEquipment: ["Broń naturalna (zatruty atak)"],
      cost: 35,
      number: 1,
      equipmentList: {},
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 0, 3, 4, 1, 3, 2, 6],
        Maksymalna: [5, 6, 0, 4, 4, 3, 6, 4, 8],
      },
      rules: ["Głód krwi", "Murołaz", "Strach", "Żywa tarcza", "Ghast"],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    Szkielet: {
      id: 4,
      startingEquipment: ["Sztylet"],
      cost: 15,
      number: 15,
      equipmentList: heroEquipment["Nieumarła horda Liczmistrza"].Stronnicy,
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
      id: 5,
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
    Upiór: {
      id: 6,
      startingEquipment: ["Miecz", "Średni pancerz", "Tarcza"],
      cost: 50,
      number: 3,
      equipmentList: heroEquipment["Nieumarła horda Liczmistrza"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 4, 1, 3, 1, 8],
        Maksymalna: [5, 6, 0, 4, 4, 3, 6, 4, 8],
      },
      rules: ["Nieumarły", "Strach", "Świadomy", "Zabójczy cios"],
    },
    Zombie: {
      id: 7,
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
    "Czarny Rycerz": {
      id: 8,
      startingEquipment: [
        "Miecz",
        "Tarcza",
        "Nieumarły koń",
        "Siodło & uprząż",
      ],
      cost: 100,
      number: 3,
      equipmentList: heroEquipment["Nieumarła horda Liczmistrza"].Rycerz,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 4, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        "Nieumarły koń": [8, 2, 0, 3, "-", "-", 2, 1, 4],
      },
      rules: [
        "Duży cel (wierzchem)",
        "Kawalerzysta",
        "Nieumarły",
        "Strach",
        "Świadomy",
        "Zabójczy cios",
      ],
    },
    Graveir: {
      id: 9,
      startingEquipment: ["Broń naturalna (przebicie pancerza, zatruty atak)"],
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
        id: 10,
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
      "Rój nietoperzy": {
        id: 11,
        startingEquipment: ["Broń naturalna (zatruty atak)"],
        cost: 160,
        number: 1,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [1, 3, 0, 4, 4, 3, 3, 2, 6],
          Maksymalna: [1, 3, 0, 4, 4, 3, 3, 2, 6],
        },
        rules: [
          "Bycza szarża",
          "Duży cel",
          "Głód krwi",
          "Głód trzewi",
          "Lot",
          "Oplątanie",
          "Przepastne trzewia",
          "Rój nietoperzy",
          "Strach",
          "Wielkolud",
          "Zwierzę"
        ],
      },
    "Czarna Karoca": {
      id: 12,
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
    },
    Ścierwowóz: {
      id: 13,
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
      rules: ["Duży cel", "Machina wojenna", "Rydwan", "Strach", "Ścierwowóz"],
    },
  },
  limit: 500,
  minModels: 3,
  maxModels: 15,
  name: "Nieumarła horda Liczmistrza",
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
};