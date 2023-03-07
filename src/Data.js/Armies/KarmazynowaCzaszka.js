import { heroEquipment } from "../HeroEquipment";

export const karmazynowaCzaszka = {
  heroes: {
    Wtajemiczony: {
      id: 0,
      startingEquipment: ["Sztylet", "Broń wielka"],
      cost: 80,
      number: 1,
      equipmentList: heroEquipment["Kult Karmazynowej Czaszki"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: [
        "Błogosławieństwo bogów",
        "Demonolog",
        "Dowodzenie",
        "Dowódca",
        "Stygmat Chaosu",
        "Żniwiarz",
      ],
      exp: 20,
      skills: [0, 3, 4, 5],
    },
    Akolita: {
      id: 1,
      startingEquipment: ["Sztylet", "Topór bojowy/Nadziak"],
      cost: 45,
      number: 2,
      equipmentList: heroEquipment["Kult Karmazynowej Czaszki"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 4, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Stygmat Chaosu", "Szermierz"],
      exp: 8,
      skills: [0, 3, 4, 5],
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
      startingEquipment: ["Chorążowie & sygnaliści", "Furia", "Żywa tarcza"],
      cost: 30,
      number: 12,
      equipmentList: heroEquipment["Kult Karmazynowej Czaszki"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 4, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Chorążowie & sygnaliści", "Żywa tarcza"],
    },
    "Piekielny Ogar": {
      id: 4,
      startingEquipment: ["Broń naturalna (druzgoczący)"],
      cost: 45,
      number: 5,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [8, 5, 0, 4, 3, 1, 4, 1, 8],
        Maksymalna: [8, 5, 0, 4, 3, 1, 4, 1, 8],
      },
      rules: [
        "Demon",
        "Furia",
        "Odporność na magię (2)",
        "Rączy",
        "Strach",
        "Stygmaty Khorna (skoczek)",
      ],
    },
    Khorngor: {
      id: 5,
      startingEquipment: ["Sztylet", "Broń wielka"],
      cost: 55,
      number: 3,
      equipmentList: heroEquipment["Kult Karmazynowej Czaszki"].Stronnicy,
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
      equipmentList: heroEquipment["Kult Karmazynowej Czaszki"].Ogr,
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
      rules: ["Duży cel", "Kontakty handlowe (3)", "Machina wojenna", "Powóz"],
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
  name: "Kult Karmazynowej Czaszki",
  nature: "Chaotyczna",
  armyRules: [
    "Kontakty handlowe (1)",
    "Oko Chaosu",
    "Rozrzutni",
    "Zamożność",
    "Znak Chaosu (Wojownicy Khorna)",
  ],
  mercenaries: [
    "Gladiator",
    "Rycerz najemny",
    "Szpieg",
    "Trefniś",
    "Woźnica",
    "Wróżbita",
    "Zwadźca",
  ],
};
