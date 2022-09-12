export const mercenaries = {
    Balistyk: {
      id: 101,
      startingEquipment: ["Sztylet", "Miecz", "Kusza", "Lekki"],
      cost: 80,
      pay: 40,
      prestige: 36,
      number: 1,
      equipmentList: {
        Balista: [0, 3,"Choice"],
        Katapulta: [0, 3,"Choice"],
      },
      type: "Najemne Ostrze",
      stats: {
        Początkowa: [4, 3, 4, 3, 3, 1, 3, 1, 7],
        Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
      },
      rules: ["Drużyna obsługi", "Balistyk"],
      exp: 0,
      skills: [1,5],
    },
    "Balistyk z Czarnej Arki": {
      id: 102,
      startingEquipment: ["Miecz","Kusza powtarzalna","Lekki","Balista powtarzalna"],
      cost: 95,
      pay: 40,
      prestige: 40,
      number: 1,
      equipmentList: {
      },
      type: "Najemne Ostrze",
      stats: {
        Początkowa: [5, 4, 4, 3, 3, 1, 5, 1, 8],
        Maksymalna: [6,7,7,4,3,3,9,4,10],
      },
      rules: ["Drużyna obsługi", "Przyboczny", "Szósty zmysł", "Balistyk"],
      exp: 0,
      skills: [1,5],
    },
  };