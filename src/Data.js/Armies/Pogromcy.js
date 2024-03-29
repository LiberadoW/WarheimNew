import { heroEquipment } from "../HeroEquipment";

export const pogromcy = {
  heroes: {
    "Tan Pogromców": {
      id: 0,
      startingEquipment: ["Sztylet", "Topór krasnoludów"],
      cost: 85,
      number: 1,
      equipmentList: heroEquipment["Kult Pogromców z Karak Kadrin"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 5, 4, 4, 4, 2, 3, 1, 10],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Dowodzenie",
        "Dowódca",
        "Krzepki",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pomiot podmroku",
        "Pogromca",
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
      cost: 60,
      number: 1,
      equipmentList: heroEquipment["Kult Pogromców z Karak Kadrin"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 4, 4, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Błogosławieństwo przodków",
        "Kowal Run",
        "Krzepki",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pogromca",
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
      cost: 60,
      number: 1,
      equipmentList: heroEquipment["Kult Pogromców z Karak Kadrin"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 4, 4, 3, 4, 1, 2, 1, 9],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Drużyna obsługi",
        "Inżynier",
        "Krzepki",
        "Mistrz inżynier",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pogromca",
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
    "Pogromca Smoków": {
      id: 3,
      startingEquipment: [
        "Topór krasnoludów",
        "Topór krasnoludów",
        "Broń wielka",
      ],
      cost: 55,
      number: 1,
      equipmentList: { "Topór krasnoludów": [10, 0], "Broń wielka": [10, 0] },
      type: "Bohater",
      stats: {
        Początkowa: [3, 6, 3, 3, 4, 1, 2, 1, 10],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Fanatyk",
        "Krzepki",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pogromca",
        "Pomiot podmroku",
        "Rankor",
        "Topory pogromcy",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
      exp: 10,
      skills: [0, 3, 4, 5],
    },
    "Pogromca Gigantów": {
      id: 4,
      startingEquipment: [
        "Topór krasnoludów",
        "Topór krasnoludów",
        "Broń wielka",
      ],
      cost: 55,
      number: 1,
      equipmentList: { "Topór krasnoludów": [10, 0], "Broń wielka": [10, 0] },
      type: "Bohater",
      stats: {
        Początkowa: [3, 5, 3, 3, 4, 1, 2, 1, 10],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Fanatyk",
        "Krzepki",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pogromca",
        "Pomiot podmroku",
        "Rankor",
        "Topory pogromcy",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    "Pogromca Trolli": {
      id: 5,
      startingEquipment: [
        "Topór krasnoludów",
        "Topór krasnoludów",
        "Broń wielka",
      ],
      cost: 50,
      number: 12,
      equipmentList: { "Topór krasnoludów": [10, 0], "Broń wielka": [10, 0] },
      type: "Stronnik",
      stats: {
        Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 10],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Chorążowie & sygnaliści",
        "Drużyna obsługi",
        "Fanatyk",
        "Krzepki",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
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
    Bukanier: {
      id: 6,
      startingEquipment: ["Pistolet", "Pistolet"],
      cost: 55,
      number: 5,
      equipmentList: heroEquipment["Kult Pogromców z Karak Kadrin"].Bukanier,
      type: "Stronnik",
      stats: {
        Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 10],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Fanatyk",
        "Krzepki",
        "Nieustępliwość",
        "Nurek",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pogromca",
        "Pomiot podmroku",
        "Rajtar",
        "Rankor",
        "Trudny do zabicia",
        "Uporczywość",
        "Wojownik podziemny",
        "Zabobonny lęk",
      ],
    },
    Wyklęty: {
      id: 7,
      startingEquipment: [
        "Topór krasnoludów",
        "Topór krasnoludów",
        "Broń wielka",
      ],
      cost: 55,
      number: 1,
      equipmentList: { "Topór krasnoludów": [10, 0], "Broń wielka": [10, 0] },
      type: "Stronnik",
      stats: {
        Początkowa: [3, 4, 3, 3, 4, 1, 2, 1, 10],
        Maksymalna: [4, 7, 6, 4, 5, 3, 5, 4, 10],
      },
      rules: [
        "Berserk",
        "Fanatyk",
        "Krzepki",
        "Nieustępliwość",
        "Ochronne tatuaże",
        "Odporność na magię (2)",
        "Pogromca",
        "Pomiot podmroku",
        "Rankor",
        "Stan niższy",
        "Trudny do zabicia",
        "Uporczywość",
        "Wir śmierci",
        "Wojownik podziemny",
        "Wyklęty",
        "Zabobonny lęk",
      ],
    },
    Żyrokopter: {
      id: 8,
      startingEquipment: ["Kusza powtarzalna"],
      cost: 150,
      number: 1,
      equipmentList: [],
      type: "Machina",
      stats: {
        Początkowa: [1, "-", "-", 4, 5, 5, "-", "-", "-"],
        Maksymalna: [1, "-", "-", 4, 5, 5, "-", "-", "-"],
      },
      rules: [
        "Bombardowanie",
        "Duży cel",
        "Lot",
        "Machina wojenna",
        "Trafienie z uderzenia",
        "Uporczywość",
        "Zwiadowca",
      ],
    },
  },
  limit: 500,
  minModels: 3,
  maxModels: 12,
  name: "Kult Pogromców z Karak Kadrin",
  nature: "Neutralna",
  armyRules: ["Kontakty handlowe (1)", "Reduta", "Rozrzutni"],
  mercenaries: [],
};
