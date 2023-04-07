import { heroEquipment } from "../HeroEquipment";

export const nehekhara = {
  heroes: {
    "Książe Grobowców": {
      id: 0,
      startingEquipment: ["Sztylet", "Chopesz"],
      cost: 80,
      number: 1,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 5, 3, 4, 4, 2, 3, 1, 9],
        Maksymalna: [5, 7, 6, 4, 5, 3, 6, 4, 10],
      },
      rules: [
        "Dowodzenie",
        "Dowódca",
        "Klątwa Księcia Grobowców",
        "Łatwopalność",
        "Nieumarły",
        "Pomiot pustyni",
        "Strach",
      ],
      exp: 20,
      skills: [0, 2, 3, 5],
    },
    Licz: {
      id: 1,
      startingEquipment: ["Sztylet", "Kostur"],
      cost: 55,
      number: 1,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 4, 1, 3, 1, 8],
        Maksymalna: [5, 7, 6, 4, 5, 3, 6, 4, 10],
      },
      rules: [
        "Animacja",
        "Łatwopalność",
        "Mag (Dziedzina Nehekhary albo Tradycja Śmierci albo Tradycja Światła)",
        "Nieumarły",
        "Pomiot pustyni",
        "Strach",
      ],
      exp: 8,
      skills: [0, 2, 5],
    },
    Nekrotekt: {
      id: 2,
      startingEquipment: ["Sztylet", "Bicz"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 4, 1, 3, 1, 7],
        Maksymalna: [5, 7, 6, 4, 5, 3, 6, 4, 10],
      },
      rules: [
        "Łatwopalność",
        "Nekrotekt",
        "Nienawiść",
        "Nieumarły",
        "Pomiot pustyni",
        "Strach",
      ],
      exp: 8,
      skills: [0, 1, 3, 5],
    },
    Herold: {
      id: 3,
      startingEquipment: ["Sztylet", "Chopesz"],
      cost: 55,
      number: 2,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [4, 4, 3, 4, 4, 1, 3, 1, 8],
        Maksymalna: [5, 7, 6, 4, 5, 3, 6, 4, 10],
      },
      rules: [
        "Łatwopalność",
        "Nieumarły",
        "Pomiot pustyni",
        "Strach",
        "Żywa tarcza",
      ],
      exp: 8,
      skills: [0, 1, 3, 5],
    },
    Szkielet: {
      id: 4,
      startingEquipment: ["Sztylet"],
      cost: 15,
      number: 15,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 2, 2, 3, 3, 1, 2, 1, 3],
        Maksymalna: [4, 2, 2, 3, 3, 1, 2, 1, 3],
      },
      rules: [
        "Chorążowie & sygnaliści",
        "Drużyna obsługi",
        "Nieumarły",
        "Pomiot pustyni",
        "Strach",
        "Strzały Asaph",
      ],
    },
    "Strażnik Grobowców": {
      id: 5,
      startingEquipment: ["Chopesz", "Średni", "Tarcza"],
      cost: 50,
      number: 3,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 4, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Nieumarły", "Strach", "Świadomy", "Zabójczy cios"],
    },
    Rój: {
      id: 6,
      startingEquipment: ["Broń naturalna (zatruty atak)"],
      cost: 30,
      number: 5,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [4, 2, 0, 2, 2, 1, 1, 2, 10],
        Maksymalna: [4, 2, 0, 2, 2, 1, 1, 2, 10],
      },
      rules: [
        "Animacja",
        "Łatwopalność",
        "Nieumarły",
        "Pomiot pustyni",
        "Rozmiar rzondzi",
        "Sfora",
        "Strach",
        "Trudny do zabicia",
      ],
    },
    "Nieumarły Nomada": {
      id: 7,
      startingEquipment: [
        "Włócznia",
        "Tarcza",
        "Nieumarły koń",
        "Siodło & uprząż",
      ],
      cost: 80,
      number: 3,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 2, 2, 3, 3, 1, 2, 1, 3],
        Maksymalna: [4, 2, 2, 3, 3, 1, 2, 1, 3],
        "Nieumarły koń": [8, 2, 0, 3, "-", "-", 2, 1, 4],
      },
      rules: [
        "Kawalerzysta",
        "Lekka jazda",
        "Nieumarły",
        "Pomiot pustyni",
        "Ranger",
        "Strach",
        "Strzały Asaph",
        "Zwiadowca",
      ],
    },
    Gnilec: {
      id: 8,
      startingEquipment: ["Broń naturalna (zatruty atak)"],
      cost: 150,
      number: 1,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [2, 3, 0, 4, 5, 3, 3, 3, 4],
        Maksymalna: [2, 3, 0, 4, 5, 3, 3, 3, 4],
      },
      rules: [
        "Bycza szarża",
        "Duży cel",
        "Głód trzewi",
        "Lot",
        "Nieumarły",
        "Pomiot pustyni",
        "Przepastne trzewia",
        "Strach",
        "Wielkolud",
      ],
    },
    Ushabti: {
      id: 9,
      startingEquipment: ["Broń wielka", "Łuk długi"],
      cost: 200,
      number: 1,
      equipmentList: heroEquipment["Nieumarły zastęp z Nehekhary"].Ushabti,
      type: "Stronnik",
      stats: {
        Początkowa: [5, 4, 2, 4, 4, 3, 3, 3, 8],
        Maksymalna: [5, 4, 2, 4, 4, 3, 3, 3, 8],
      },
      rules: [
        "Bycza szarża",
        "Duży cel",
        "Głód trzewi",
        "Łuskowata skóra (5+)",
        "Nieumarły",
        "Pomiot pustyni",
        "Przepastne trzewia",
        "Strach",
        "Strzały Asaph",
        "Wielkolud",
        "Oddech Djafa",
      ],
    },
    "Grobowy Skorpion": {
      id: 10,
      startingEquipment: ["Broń naturalna (zatruty atak)"],
      cost: 250,
      number: 1,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [6, 3, 0, 4, 5, 3, 3, 3, 8],
        Maksymalna: [6, 3, 0, 4, 5, 3, 3, 3, 8],
      },
      rules: [
        "Animacja",
        "Bycza szarża",
        "Duży cel",
        "Głód trzewi",
        "Łuskowata skóra (5+)",
        "Nieumarły",
        "Odporność na magię (1)",
        "Pomiot pustyni",
        "Przepastne trzewia",
        "Strach",
        "Wielkolud",
        "Zabójczy cios",
      ],
    },
    Rydwan: {
      id: 11,
      startingEquipment: [],
      cost: 125,
      number: 1,
      equipmentList: {},
      type: "Machina",
      stats: {
        Ścierwowóz: ["-", "-", "-", 5, 5, 8, "-", "-", "-"],
        "Nieumarły koń": [8, 2, 0, 3, "-", "-", 2, 1, 4],
        "Nieumarły koń  ": [8, 2, 0, 3, "-", "-", 2, 1, 4],
      },
      rules: ["Duży cel", "Machina wojenna", "Pomiot pustyni","Rydwan"],
    },
  },
  limit: 500,
  minModels: 3,
  maxModels: 15,
  name: "Nieumarły zastęp z Nehekhary",
  nature: "Praworządna",
  armyRules: ["Kontrolowanie ożywieńców", "Podatek", "Rozrzutni"],
  mercenaries: [],
};
