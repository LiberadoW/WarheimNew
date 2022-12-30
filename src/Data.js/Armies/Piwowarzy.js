import { heroEquipment } from "../HeroEquipment";

export const piwowarzy = {
  heroes: {
    "Mistrz Piwowar": {
      id: 0,
      startingEquipment: ["Sztylet", "Topór krasnoludów"],
      cost: 85,
      number: 1,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 4, 4, 4, 4, 2, 3, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Dowodzenie",
        "Dowódca",
        "Krzepki",
        "Nieustępliwość",
        "Odporność na magię(2)",
        "Piwowar",
        "Pomiot podmroku",
        "Rankor",
        "Rewelator",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
      exp: 20,
      skills: [0, 1, 2, 3, 5],
    },
    "Kowal Run": {
      id: 1,
      startingEquipment: ["Sztylet", "Buława/Maczuga/Młot bojowy"],
      cost: 50,
      number: 1,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 4, 4, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Błogosławieństwo przodków",
        "Kowal run",
        "Krzepki",
        "Nieustępliwość",
        "Odporność na magię(2)",
        "Pomiot podmroku",
        "Rankor",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
      exp: 12,
      skills: [0, 2, 3, 5],
    },
    "Mistrz Inżynier": {
      id: 2,
      startingEquipment: ["Sztylet", "Buława/Maczuga/Młot bojowy"],
      cost: 50,
      number: 1,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 4, 4, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Drużyna obłsugi",
        "Inżynier",
        "Krzepki",
        "Mistrz inżynier",
        "Nieustępliwość",
        "Odporność na magię(2)",
        "Pomiot podmroku",
        "Rankor",
        "Saper",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
      exp: 12,
      skills: [0, 1, 2, 3, 5],
    },
    Zwiadowca: {
      id: 3,
      startingEquipment: ["Sztylet"],
      cost: 45,
      number: 2,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Zwiadowca,
      type: "Bohater",
      stats: {
        Początkowa: [3, 4, 4, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Krzepki",
        "Nieustępliwość",
        "Odporność na magię(2)",
        "Pomiot podmroku",
        "Ranger",
        "Rankor",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
        "Zastawianie pułapek",
        "Zwiadowca",
      ],
      exp: 8,
      skills: [0, 1, 4, 5],
    },
    "Wojownik Klanowy": {
      id: 4,
      startingEquipment: ["Sztylet"],
      cost: 25,
      number: 12,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Chorążowie & sygnaliści",
        "Drużyna obsługi",
        "Krzepki",
        "Nieustępliwość",
        "Odporność na magię(2)",
        "Pomiot podmroku",
        "Rankor",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
    },
    "Krasnoludzki Ranger": {
      id: 5,
      startingEquipment: ["Sztylet", "Topór kransoludów"],
      cost: 45,
      number: 5,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Krzepki",
        "Nieustępliwość",
        "Odporność na magię(2)",
        "Pomiot podmroku",
        "Ranger",
        "Rankor",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
        "Zwiadowca",
      ],
    },
    "Krasnoludzki Przepatrywacz": {
      id: 6,
      startingEquipment: [
        "Sztylet",
        "Topór bojowy/Nadziak",
        "Kuc",
        "Siodło & uprząż",
      ],
      cost: 80,
      number: 3,
      equipmentList:
        heroEquipment["Kompania Krasnoludzkich Piwowarów"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
        Kuc: [6, 2, 0, 4, 4, 1, 2, 1, 5],
      },
      rules: [
        "Kawalerzysta",
        "Krzepki",
        "Lekka jazda",
        "Nieustępliwość",
        "Odporność na magię (2)",
        "Pomiot podmroku",
        "Ranger",
        "Rankor",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
        "Zwiadowca",
      ],
    },
    "Pogromca Trolli": {
        id: 7,
        startingEquipment: [
          "Topór krasnoludów",
          "Topór krasnoludów",
          "Broń wielka",
        ],
        cost: 50,
        number: 3,
        equipmentList: heroEquipment["Kompania Krasnoludzkich Piwowarów"].Pogromca,
        type: "Stronnik",
        stats: {
          Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 10],
          Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
        },
        rules: [
          "Fanatyk",
          "Krzepki",
          "Nieustępliwość",
          "Ochronne tatuaże",
          "Odporność na magię(2)",
          "Pogromca",
          "Pomiot podmroku",
          "Rankor",
          "Topory pogromcy",
          "Trudny do zabicia",
          "Uporczywość",
          "Wojownik podziemny",
          "Zabobonny lęk",
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
          Koń: [8, 3, 0, 3, "-", "-", 3, 1, 5],
          "Koń ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel", "Kontakty handlowe (3)", "Machina wojenna", "Powóz"],
      },
      "Powóz piwny": {
        id: 9,
        startingEquipment: [],
        cost: 175,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
          Kuc: [6, 2, 0, 4, "-", "-", 2, 1, 5],
          "Kuc ": [6, 2, 0, 4, "-", "-", 2, 1, 5],
        },
        rules: ["Duży cel", "Machina wojenna", "Powóz","Piwo Bugmana","Powóz piwny"],
      },
  },
  limit: 500,
  minModels: 3,
  maxModels: 12,
  name: "Kompania Krasnoludzkich Piwowarów",
  nature: "Neutralna",
  armyRules: ["Kontakty handlowe (3)", "Reduta", "Zhańbiony"],
  mercenaries: [
    "Goniec",
    "Miotacz ołowiu",
    "Ochroniarz",
    "Poszukiwacz złota",
    "Strażnik dróg",
    "Zwiadowca",
  ],
};
