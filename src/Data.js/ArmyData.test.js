import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import armies from "./Armies";
import expected from "./__fixtures__/rulebook-profiles.json";
import { armyChoices } from "./ArmyChoices";
import { mercenariesList } from "./Mercenaries";
import getErrors from "../Functions/getErrors";
import { magic } from "./Magic";
import { getMagicLore } from "../Functions/getMagicLore";
import WeaponList from "../layouts/WeaponList";
import UnitSelect from "../layouts/UnitSelect";

// Independent extraction of 704 explicit recruitment profiles in Warheim.docx.
// Bractwo's generic priest points to seven profiles in chapter 23 instead.
test.each(Object.entries(expected))("%s matches the Word recruitment tables", (name, profiles) => {
  const army = armies[name];
  expect(army).toBeDefined();
  Object.entries(profiles).forEach(([unitName, [cost, cap, stats]]) => {
    const unit = army.heroes[unitName];
    expect(unit).toBeDefined();
    expect([unitName, unit.cost]).toEqual([unitName, cost]);
    if (cap !== null) expect([unitName, unit.number]).toEqual([unitName, cap]);
    else expect(unit.number).toBeGreaterThanOrEqual(army.maxModels);
    // Printed altar row conflicts with the Powóz rule; tracked in the audit.
    if (name === "Rycerze Graala" && unitName === "Bitewny ołtarz") return;
    expect([unitName, Object.values(unit.stats)]).toEqual([unitName, stats]);
  });
});

test("all 63 armies have usable equipment, complete profiles and resolved mercenaries", () => {
  expect(Object.keys(armies)).toHaveLength(63);
  Object.entries(armies).forEach(([name, army]) => {
    expect(army.name).toBe(name);
    expect(army.minModels).toBeLessThanOrEqual(army.maxModels);
    expect(Object.values(army.heroes).some((unit) => unit.rules.includes("Dowódca"))).toBe(true);
    army.mercenaries.forEach((name) => expect(mercenariesList[name]).toBeDefined());
    Object.values(army.heroes).forEach((unit) => {
      expect(unit.equipmentList).toBeDefined();
      expect(Array.isArray(unit.equipmentList)).toBe(false);
      expect(Array.isArray(unit.startingEquipment)).toBe(true);
      expect(Array.isArray(unit.rules)).toBe(true);
      Object.values(unit.stats).forEach((row) => expect(row).toHaveLength(9));
      Object.values(unit.equipmentList).forEach(([cost, category]) => {
        expect(cost).toBeGreaterThanOrEqual(0);
        expect(category).toBeGreaterThanOrEqual(0);
        expect(category).toBeLessThanOrEqual(4);
      });
    });
  });
});

const recruit = (army, name, count = 1) => {
  const unit = army.heroes[name];
  return { ...unit, unitName: name, selectedNumber: count, customEquipment: [],
    rules: [...unit.rules],
    ...{ optionalEquipment: (unit.requiredEquipmentGroups || []).map((group) =>
      Object.keys(unit.equipmentList).find((name) => unit.equipmentList[name][2] === group)) },
  };
};
const errors = (army, units) => getErrors({ ...army, minModels: 0, maxModels: 1000 }, 0, 0, units, 10000);

test.each(Object.entries(armyChoices))("%s enforces exclusive choices even for loaded rosters", (name, groups) => {
  const army = armies[name];
  const leader = Object.keys(army.heroes).find((key) => army.heroes[key].rules.includes("Dowódca"));
  groups.forEach((group) => {
    group.forEach((name) => expect(army.heroes[name]).toBeDefined());
    const base = [recruit(army, leader), recruit(army, group[0])];
    expect(errors(army, [...base, recruit(army, group[1])])).toBe(errors(army, base) + 1);
  });
});

test("Nippon cannot recruit more samurai than ashigaru", () => {
  const army = armies["Klan wojowników z Nipponu"];
  const legal = [recruit(army, "Daimyo"), recruit(army, "Ashigaru"), recruit(army, "Samuraj")];
  expect(errors(army, legal)).toBe(0);
  expect(errors(army, [...legal, recruit(army, "Samuraj")])).toBe(1);
});

test("Bractwo allows one of seven priest patrons", () => {
  const army = armies["Bractwo Rycerskie"];
  const priests = Object.entries(army.heroes).filter(([, unit]) => unit.rules.some((r) => r.startsWith("Duchowny")));
  expect(priests).toHaveLength(7);
  priests.forEach(([name, unit]) => {
    expect(unit).toMatchObject({ cost: 35, exp: 12, number: 1 });
    expect(unit.stats.Początkowa).toHaveLength(9);
  });
  expect(army.heroes["Kapłan Morra"].rules).toContain("Duchowny (modlitwy do Morra)");
});

const newArmies = ["Bractwo Rycerskie", "Emisariusze Smoczego Cesarza", "Klan wojowników z Nipponu", "Berserkerzy z Norski", "Konwent magów Wieży Hoeth", "Bestiobójcy z Kraka Drak", "Łupieżcza kompania Fimirów", "Eteryczny dwór Króla kurhanów"];
test.each(newArmies)("%s recruits through the existing UI without mutating the catalog", (name) => {
  const army = armies[name];
  const before = JSON.stringify(army);
  let recruited = [];
  const Harness = () => {
    const [unitName, setUnitName] = useState("");
    const [unitList, setUnitList] = useState([]);
    recruited = unitList;
    return <UnitSelect heroes={army.heroes} {...{ unitName, setUnitName, unitList, setUnitList }} />;
  };
  render(<Harness />);
  const leader = Object.keys(army.heroes).find((key) => army.heroes[key].rules.includes("Dowódca"));
  fireEvent.change(screen.getByRole("combobox"), { target: { value: leader } });
  fireEvent.click(screen.getByText("Dodaj"));
  expect(recruited).toHaveLength(1);
  recruited[0].rules.push("Test");
  const equipment = Object.keys(recruited[0].equipmentList)[0];
  if (equipment) recruited[0].equipmentList[equipment][0] = 999;
  expect(JSON.stringify(army)).toBe(before);
});

test("the retired Chaos chariot cannot be recruited but remains available to old saves", () => {
  const army = armies["Kult Ducha Chaosu"];
  expect(army.heroes["Rydwan Chaosu"].retired).toBe(true);
  render(<UnitSelect heroes={army.heroes} unitName="" unitList={[]} setUnitName={() => {}} setUnitList={() => {}} />);
  expect(screen.queryByRole("option", { name: /Rydwan Chaosu/ })).toBeNull();
  const leader = recruit(army, "Wtajemniczony");
  expect(errors(army, [leader, recruit(army, "Rydwan Chaosu")])).toBe(errors(army, [leader]) + 1);
});


jest.mock("../layouts/Builder", () => ({
  CommandContext: require("react").createContext({ standardBearer: null, musician: null, setStandardBearer: () => {}, setMusician: () => {} }),
}));

const equipmentHarness = (armyName, unitName) => {
  const army = armies[armyName];
  let current;
  const Harness = () => {
    const unit = JSON.parse(JSON.stringify(recruit(army, unitName, unitName === "Drużyna ciężkich broni" ? 2 : 1)));
    unit.optionalEquipment = [];
    unit.totalCost = unit.cost;
    const [unitList, setUnitList] = useState([unit]);
    current = unitList[0];
    return <div className="unit" id="0"><WeaponList heroes={army.heroes} id={0} {...{army,unitList,setUnitList}} /></div>;
  };
  const {container} = render(<Harness />);
  return { unit: () => current, click: (name) => {
    const input = container.querySelector(`input[name="${name}"]`);
    expect(input).not.toBeNull(); fireEvent.click(input);
  }};
};

test.each([
  ["Berserkerzy z Norski", 40],
  ["Bestiobójcy z Kraka Drak", 50],
])("%s charges a crew's shared harpoon once", (armyName, base) => {
  const h = equipmentHarness(armyName, "Drużyna ciężkich broni");
  expect(h.unit().totalCost).toBe(base);
  h.click("Harpun");
  expect(h.unit().totalCost).toBe(base + 50);
  h.click("Miecz");
  expect(h.unit().totalCost).toBe(base + 50 + 2 * 10);
  h.click("Harpun");
  expect(h.unit().totalCost).toBe(base + 2 * 10);
});

test("Komtur's optional horse adds its cost and profile and can be removed", () => {
  const h = equipmentHarness("Bractwo Rycerskie", "Komtur");
  h.click("Koń bojowy");
  expect(h.unit().totalCost).toBe(100);
  expect(h.unit().stats["Koń bojowy"]).toEqual([8,3,0,3,"-","-",3,1,5]);
  h.click("Koń bojowy");
  expect(h.unit().totalCost).toBe(60);
  expect(h.unit().stats["Koń bojowy"]).toBeUndefined();
});

test("Dao resolves to the recruited Yin or Yang tradition", () => {
  const h = equipmentHarness("Emisariusze Smoczego Cesarza", "Kanclerz");
  h.click("Dualizm (Yin)");
  expect(getMagicLore([h.unit()])).toBe("Tradycja Yin");
  expect(Object.keys(magic["Tradycja Yin"])).toHaveLength(6);
  h.click("Dualizm (Yin)");
  h.click("Dualizm (Yang)");
  expect(getMagicLore([h.unit()])).toBe("Tradycja Yang");
  expect(Object.keys(magic["Tradycja Yang"])).toHaveLength(6);
});

test("Profeta can select either of its two lores without losing its equipment list", () => {
  const h = equipmentHarness("Eteryczny dwór Króla kurhanów", "Profeta");
  h.click("Domena Nehekhary");
  expect(getMagicLore([h.unit()])).toBe("Dziedzina Nehekary");
  h.click("Domena Nehekhary");
  h.click("Magia Żywiołów");
  expect(getMagicLore([h.unit()])).toBe("Magia Żywiołów");
  expect(h.unit().equipmentList.Ciężki).toEqual([60,2,"Zbroja"]);
});

test.each(["Mananna","Morra","Myrmidii","Ranalda","Ulryka","Ursuna","Sigmara"])("%s has all seven prayers", (god) => {
  const prayers = magic[`Duchowny (modlitwy do ${god})`];
  expect(Object.keys(prayers)).toHaveLength(7);
  Object.values(prayers).forEach(([title,,body]) => {
    expect(title).toMatch(/^\d/);
    expect(body.length).toBeGreaterThan(30);
  });
});
