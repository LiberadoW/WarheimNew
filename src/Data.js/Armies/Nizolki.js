import { heroEquipment } from "../HeroEquipment";

export const nizolki = {
  heroes: {
    Starszy: {
      id: 0,
      startingEquipment: ["Sztylet", "Miecz"],
      cost: 45,
      number: 1,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 3, 4, 3, 2, 2, 5, 1, 9],
        Maksymalna: [4, 5, 7, 3, 3, 3, 9, 4, 10],
      },
      rules: [
        "Dowódca",
        "Odporność na magię (2)",
        "Ranger",
        "Śmigły",
        "Zasadzka",
        "Zwiadowca",
      ],
      exp: 20,
      skills: [0, 1, 2, 4, 5],
    },
    "Magister magii": {
      id: 1,
      startingEquipment: ["Sztylet"],
      cost: 40,
      number: 1,
      equipmentList: {
        "Tradycja Bestii": [0, 4, "Tradycja"],
        "Tradycja Cienia": [0, 4, "Tradycja"],
        "Tradycja Metalu": [0, 4, "Tradycja"],
        "Tradycja Niebios": [0, 4, "Tradycja"],
        "Tradycja Ognia": [0, 4, "Tradycja"],
        "Tradycja Śmierci": [0, 4, "Tradycja"],
        "Tradycja Światła": [0, 4, "Tradycja"],
        "Tradycja Życia": [0, 4, "Tradycja"],
      },
      type: "Bohater",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Mag (Kolegia Magii)"],
      exp: 12,
      skills: [],
    },
    Sierżant: {
      id: 2,
      startingEquipment: ["Sztylet", "Halabarda"],
      cost: 30,
      number: 1,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 3, 4, 2, 2, 1, 4, 1, 8],
        Maksymalna: [4, 5, 7, 3, 3, 3, 9, 4, 10],
      },
      rules: ["Odporność na magię (2)", "Podoficer", "Śmigły", "Zasadzka"],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    Zwiadowca: {
      id: 3,
      startingEquipment: ["Sztylet", "Kusza"],
      cost: 25,
      number: 2,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Bohaterowie,
      type: "Bohater",
      stats: {
        Początkowa: [3, 2, 4, 2, 2, 1, 4, 1, 8],
        Maksymalna: [4, 5, 7, 3, 3, 3, 9, 4, 10],
      },
      rules: [
        "Odporność na magię (2)",
        "Ranger",
        "Śmigły",
        "Zasadzka",
        "Zastawianie pułapek",
        "Zwiadowca",
      ],
      exp: 8,
      skills: [0, 3, 4, 5],
    },
    Pasterz: {
      id: 4,
      startingEquipment: ["Sztylet"],
      cost: 30,
      number: 15,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [3, 2, 4, 2, 2, 1, 4, 1, 8],
        Maksymalna: [4, 5, 7, 3, 3, 3, 9, 4, 10],
      },
      rules: [
        "Chorążowie & sygnaliści",
        "Drużyna obsługi",
        "Odporność na magię (2)",
        "Ranger",
        "Śmigły",
        "Treser",
        "Zasadzka",
        "Zwiadowca",
      ],
    },
    Milicjant: {
      id: 5,
      startingEquipment: ["Sztylet", "Halabarda"],
      cost: 25,
      number: 5,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [3, 3, 4, 2, 2, 1, 4, 1, 8],
        Maksymalna: [4, 5, 7, 3, 3, 3, 9, 4, 10],
      },
      rules: ["Odporność na magię (2)", "Szermierz", "Śmigły", "Zasadzka"],
    },
    "Pies pasterski": {
      id: 6,
      startingEquipment: ["Broń naturalna"],
      cost: 15,
      number: 5,
      equipmentList: {},
      type: "Stronnik",
      stats: {
        Początkowa: [6, 4, 0, 4, 3, 1, 4, 1, 5],
        Maksymalna: [6, 4, 0, 4, 3, 1, 4, 1, 5],
      },
      rules: ["Sfora", "Zwierzę"],
    },
    Przepatrywacz: {
      id: 7,
      startingEquipment: [
        "Sztylet",
        "Miecz",
        "Włócznia",
        "Koń bojowy",
        "Siodło & uprząż",
      ],
      cost: 80,
      number: 3,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Stronnicy,
      type: "Stronnik",
      stats: {
        Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
      },
      rules: ["Kawalerzysta", "Lekka jazda", "Ranger", "Zwiadowca"],
    },
    Ogr: {
      id: 8,
      startingEquipment: ["Maczuga ogrów"],
      cost: 160,
      number: 1,
      equipmentList: heroEquipment["Nizołki z Krainy Zgromadzenia"].Ogr,
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
    Zaprzęg: {
      id: 9,
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
  },
  limit: 500,
  minModels: 3,
  maxModels: 15,
  name: "Niziołki z Krainy Zgromadzenia",
  nature: "Neutralna",
  armyRules: ["Kompania najemników", "Rozrzutni"],
  mercenaries: [
    "Balistyk",
    "Bombardier",
    "Gladiator",
    "Kartograf",
    "Kupiec",
    "Latarnik",
    "Łowca nagród",
    "Magus",
    "Medyk",
    "Minstrel",
    "Miotacz ołowiu",
    "Ochroniarz",
    "Pogromca Trolli",
    "Poszukiwacz złota",
    "Rycerz najemny",
    "Skryba",
    "Strażnik dróg",
    "Szczurołap",
    "Szpieg",
    "Tileański kusznik",
    "Trefniś",
    "Woźnica",
    "Wróżbita",
    "Zwadźca",
  ],
};
