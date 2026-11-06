import { getEquipmentOptions, countStartingChoices } from "./equipmentSelection";

const makeUnit = (overrides = {}) => ({
  rules: [],
  startingEquipment: [],
  optionalEquipment: [],
  equipmentList: {
    Miecz: [10, 0],
    Sztylet: [2, 0],
    Halabarda: [10, 0],
    "Topór bojowy/Nadziak": [5, 0],
    Kusza: [25, 1],
    Harpun: [50, 1],
    Lekki: [5, 2, "Zbroja"],
    Średni: [15, 2, "Zbroja"],
    Tarcza: [5, 2, "Tarcza"],
    Hełm: [5, 2],
  },
  ...overrides,
});

const option = (unit, displayName) =>
  getEquipmentOptions(unit).find((item) => item.displayName === displayName);

test("a weapon can be taken twice, the second copy as its own slot", () => {
  const unit = makeUnit({ optionalEquipment: ["Miecz"] });
  expect(option(unit, "Miecz")).toMatchObject({ copies: 1, addSlot: "second", removeSlot: "first" });
  unit.optionalEquipment.push("Miecz");
  expect(option(unit, "Miecz")).toMatchObject({ copies: 2, addSlot: null, removeSlot: "second" });
});

test("melee weapons are capped at two, not counting the dagger", () => {
  const unit = makeUnit({ optionalEquipment: ["Miecz", "Halabarda", "Sztylet"] });
  expect(option(unit, "Topór bojowy").blockReason).toBe("limit broni");
  expect(option(unit, "Miecz").addSlot).toBeNull();
  expect(option(unit, "Kusza").addSlot).toBe("first");
});

test("Zbrojny po zemby raises the weapon cap to three", () => {
  const unit = makeUnit({ rules: ["Zbrojny po zemby"], optionalEquipment: ["Miecz", "Halabarda"] });
  expect(option(unit, "Topór bojowy").addSlot).toBe("first");
});

test("only one body armour can be worn; shield and helmet stay available", () => {
  const unit = makeUnit({ optionalEquipment: ["Lekki"] });
  expect(option(unit, "Średni").blockReason).toBe("wybrano: Lekki");
  expect(option(unit, "Tarcza").addSlot).toBe("first");
  expect(option(unit, "Hełm").addSlot).toBe("first");
  expect(option(unit, "Lekki").addSlot).toBeNull();
});

test("starting equipment cannot be removed but can be doubled", () => {
  const unit = makeUnit({ startingEquipment: ["Miecz"] });
  expect(option(unit, "Miecz")).toMatchObject({ copies: 1, isStarting: true, removeSlot: null, addSlot: "second" });
});

test("split names are picked per alias and blocked weapons have no second copy", () => {
  const unit = makeUnit({ optionalEquipment: ["Topór bojowy/Nadziak", "Harpun"],
    equipmentAliasSelections: { "Topór bojowy/Nadziak": ["Nadziak"] } });
  expect(option(unit, "Nadziak")).toMatchObject({ copies: 1, removeSlot: "first" });
  expect(option(unit, "Topór bojowy").copies).toBe(0);
  expect(option(unit, "Harpun")).toMatchObject({ copies: 1, addSlot: null });
});

test("starting-weapon choices are counted", () => {
  const unit = makeUnit({ equipmentList: { Łuk: [10, 1, "Startowy"], Kusza: [25, 1, "Startowy"] },
    optionalEquipment: ["Łuk", "Kusza"] });
  expect(countStartingChoices(unit)).toBe(2);
});
