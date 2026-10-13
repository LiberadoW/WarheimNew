import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import armies from "../Armies";
import { gangPrzemytnikow as army } from "./GangPrzemytnikow";
import { mercenariesList } from "../Mercenaries";
import { magic } from "../Magic";
import { rulesObject } from "../Rules";
import { getMagicLore } from "../../Functions/getMagicLore";
import { getOneOfChoices } from "../../Functions/getOneOfChoices";
import getErrors from "../../Functions/getErrors";
import UnitSelect from "../../layouts/UnitSelect";

// Expected values transcribed from the Gang przemytników section of Warheim.docx.
test.each([
  ["Herszt gangu", 55, 1, [4, 4, 4, 3, 3, 2, 4, 1, 8]],
  ["Kapłan Ranalda", 35, 1, [4, 2, 2, 3, 3, 1, 4, 1, 8]],
  ["Kapłan Mananna", 35, 1, [4, 3, 3, 3, 3, 1, 3, 1, 8]],
  ["Reketer", 25, 2, [4, 4, 3, 3, 3, 1, 3, 1, 7]],
  ["Paser", 25, 1, [4, 3, 3, 3, 3, 1, 3, 1, 7]],
  ["Przemytnik", 20, 15, [4, 3, 3, 3, 3, 1, 3, 1, 7]],
  ["Doker", 35, 3, [4, 3, 3, 4, 3, 1, 3, 1, 7]],
  ["Nożownik", 35, 3, [4, 3, 4, 3, 3, 1, 3, 1, 7]],
  ["Rozbójnik", 70, 3, [4, 3, 3, 3, 3, 1, 3, 1, 7]],
  ["Ogr", 160, 1, [6, 3, 2, 4, 4, 3, 2, 2, 7]],
])("%s matches the rulebook profile", (name, cost, number, stats) => {
  expect(army.heroes[name]).toMatchObject({ cost, number, stats: { Początkowa: stats } });
});

test("registers the army, its full roster and eligible mercenaries", () => {
  expect(armies["Gang przemytników"]).toBe(army);
  expect(Object.keys(army.heroes)).toHaveLength(11);
  expect(new Set(Object.values(army.heroes).map((unit) => unit.id)).size).toBe(11);
  expect(army).toMatchObject({ limit: 500, minModels: 3, maxModels: 15, nature: "Neutralna" });
  expect(army.mercenaries).toHaveLength(22);
  army.mercenaries.forEach((name) => expect(mercenariesList[name]).toBeDefined());
  expect(army.mercenaries).not.toContain("Rozbójnik");
});

test("uses the specific priest, mounted and ogre equipment lists", () => {
  expect(army.heroes["Kapłan Ranalda"].equipmentList.Bolas).toEqual([10, 1]);
  expect(army.heroes["Kapłan Ranalda"].equipmentList.Lekki).toBeUndefined();
  expect(army.heroes["Kapłan Mananna"].equipmentList.Ciężki).toEqual([30, 2, "Zbroja"]);
  expect(army.heroes["Kapłan Mananna"].equipmentList.Hełm).toBeUndefined();
  expect(army.heroes.Rozbójnik.equipmentList.Średni).toEqual([20, 2, "Zbroja"]);
  expect(army.heroes.Ogr.equipmentList.Średni).toEqual([30, 2, "Zbroja"]);
  expect(army.heroes.Ogr.equipmentList["Cep bojowy"]).toEqual([10, 0]);
  expect(army.heroes.Przemytnik.equipmentList.Średni).toBeUndefined();
});

test("preserves the wagon and mount profiles", () => {
  const wagon = army.heroes["Wóz przemytniczy"];
  expect(wagon).toMatchObject({ type: "Machina", cost: 175, number: 1, equipmentList: {} });
  expect(Object.values(wagon.stats)).toEqual([
    ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
    [8, 3, 0, 3, "-", "-", 3, 1, 5],
    [8, 3, 0, 3, "-", "-", 3, 1, 5],
  ]);
  expect(army.heroes.Rozbójnik.startingEquipment).toContain("Koń bojowy");
  expect(army.heroes.Rozbójnik.stats["Koń bojowy"]).toEqual([8, 3, 0, 3, "-", "-", 3, 1, 5]);
});

test.each(["Kapłan Ranalda", "Kapłan Mananna"])("resolves %s's seven prayers", (name) => {
  const lore = getMagicLore([army.heroes[name]]);
  expect(lore).not.toBeNull();
  expect(Object.values(magic[lore])).toHaveLength(7);
  Object.values(magic[lore]).forEach(([title, condition, body]) => {
    expect(title).toMatch(/^\d/);
    expect(typeof condition).toBe("string");
    expect(body.length).toBeGreaterThan(30);
  });
});

test("provides the gang-specific rule descriptions", () => {
  [...army.armyRules, "Gadanina", "Handlarz", "Żyłka handlowa", "Przemytnik", "Zasadzka", "Wóz przemytniczy"].forEach(
    (name) => expect(rulesObject[name].length).toBeGreaterThan(30),
  );
});

test.each([
  ["Kapłan Ranalda", "Kapłan Mananna"],
  ["Doker", "Nożownik"],
  ["Rozbójnik", "Ogr"],
])("makes %s and %s mutually exclusive in either direction", (first, second) => {
  const select = document.createElement("select");
  select.id = "unit-selection";
  [first, second, "Przemytnik"].forEach((name) => select.add(new Option(name, name)));
  document.body.appendChild(select);
  try {
    for (const [selected, excluded] of [[first, second], [second, first]]) {
      getOneOfChoices(army, [{ unitName: selected }]);
      expect(Array.from(select.options).find((option) => option.value === excluded).disabled).toBe(true);
      expect(select.options[2].disabled).toBe(false);
      getOneOfChoices(army, []);
      expect(Array.from(select.options).every((option) => !option.disabled)).toBe(true);
    }
  } finally {
    select.remove();
  }
});

test("recruits a valid starting list through the existing unit selector", () => {
  let recruited = [];
  function Harness() {
    const [unitName, setUnitName] = useState("");
    const [unitList, setUnitList] = useState([]);
    recruited = unitList;
    return <UnitSelect heroes={army.heroes} {...{ unitName, setUnitName, unitList, setUnitList }} />;
  }
  render(<Harness />);
  for (const name of ["Herszt gangu", "Kapłan Ranalda", "Przemytnik"]) {
    fireEvent.change(screen.getByRole("combobox"), { target: { value: name } });
    fireEvent.click(screen.getByRole("button", { name: "Dodaj" }));
  }
  expect(recruited).toHaveLength(3);
  const cost = recruited.reduce((sum, unit) => sum + unit.totalCost, 0);
  expect(cost).toBe(110);
  expect(getErrors(army, cost, 3, recruited, 500)).toBe(0);
  expect(getErrors(army, 501, 3, recruited, 500)).toBeGreaterThan(0);
  expect(getErrors(army, cost, 16, recruited, 500)).toBeGreaterThan(0);
  expect(getErrors(army, cost, 2, recruited.slice(1), 500)).toBeGreaterThan(0);
  // Saved lists keep their rules and equipment as JSON-compatible values.
  expect(JSON.parse(JSON.stringify(recruited))).toEqual(recruited);
  recruited[0].stats.Początkowa[0] = 99;
  expect(army.heroes["Herszt gangu"].stats.Początkowa[0]).toBe(4);
});
