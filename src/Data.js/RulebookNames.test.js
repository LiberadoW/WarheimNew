import { normalizeRosterNames } from "./RulebookNames";

const roster = (unit) => normalizeRosterNames({ armyType: "Rycerze Graala", armyList: [unit] });

describe("saved roster names from before the PDF audit", () => {
  test("renames items in gear, lists and alias selections", () => {
    const [unit] = roster({
      unitName: "Rycerz",
      type: "Bohater",
      rules: [],
      startingEquipment: ["Sztylet", "Pawęż"],
      optionalEquipment: ["Cep bojowcy", "Płaszcz z łusek morskiego smoka"],
      equipmentList: { "Cep bojowcy": [10, 0], Pawęż: [10, 2] },
      equipmentAliasSelections: { "Cep bojowcy": "Cep bojowcy" },
    }).armyList;

    expect(unit.startingEquipment).toEqual(["Sztylet", "Pawęża"]);
    expect(unit.optionalEquipment).toEqual(["Cep bojowy", "Płaszcz z łusek smoka"]);
    expect(Object.keys(unit.equipmentList)).toEqual(["Cep bojowy", "Pawęża"]);
    expect(Object.keys(unit.equipmentAliasSelections)).toEqual(["Cep bojowy"]);
  });

  test("renames lores in rules and chosen traditions", () => {
    const [unit] = roster({
      unitName: "Nekromanta",
      type: "Bohater",
      rules: ["Mag (Dziedzina Nekromancji)"],
      startingEquipment: [],
      optionalEquipment: ["Dziedzina Chaosu Niepodzielonego", "Dziedzina Nehekary"],
    }).armyList;

    expect(unit.rules).toEqual(["Mag (Nekromancja)"]);
    expect(unit.optionalEquipment).toEqual(["Dziedzina Chaosu", "Domena Nehekhary"]);
  });

  test("renames the Zwadźca's cloak but not the Rozbójnik's", () => {
    const [zwadzca, rozbojnik] = normalizeRosterNames({
      armyType: "Gang przemytników",
      armyList: [
        { unitName: "Zwadźca", type: "Najemne Ostrze", startingEquipment: ["Płaszcz (puklerz)"] },
        { unitName: "Rozbójnik", type: "Najemne Ostrze", startingEquipment: ["Płaszcz (puklerz)"] },
      ],
    }).armyList;

    expect(zwadzca.startingEquipment).toEqual(["Płaszcz z Estalii"]);
    expect(rozbojnik.startingEquipment).toEqual(["Płaszcz (puklerz)"]);
  });

  test("renames the High Elf and Hoeth Łucznik to Wojownik", () => {
    ["Elfowie Wysokiego Rodu z Ulthuanu", "Konwent magów Wieży Hoeth"].forEach((armyType) => {
      const [unit] = normalizeRosterNames({
        armyType,
        armyList: [{ unitName: "Łucznik", unitDisplayName: "Łucznik", type: "Stronnik" }],
      }).armyList;
      expect(unit.unitName).toBe("Wojownik");
      expect(unit.unitDisplayName).toBe("Wojownik");
    });
  });

  test("replaces Graal Cnota choices with the Przymiot list", () => {
    const [unit] = roster({
      unitName: "Rycerz Graala",
      type: "Bohater",
      rules: ["Towarzysz Graala"],
      startingEquipment: [],
      optionalEquipment: ["Cnota męstwa", "Miecz"],
      equipmentList: { Miecz: [10, 0], "Cnota męstwa": [0, 3, "Choice"] },
    }).armyList;

    expect(unit.optionalEquipment).toEqual(["Miecz"]);
    expect(unit.equipmentList["Cnota męstwa"]).toBeUndefined();
    expect(unit.equipmentList["Przymiot: Filar"]).toEqual([0, 3, "Choice"]);
  });
});
