import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import { applyArmourDamage, armourAfter, damagedSave, describeDamage } from "./armourDamage";

const h = armies["Łowcy czarownic"].heroes;
const unit = (name, extra = {}) => ({ ...createUnit(h, name), ...extra });

test("armour steps down and light armour is destroyed", () => {
  expect(armourAfter("Ciężki", 1)).toBe("Średni");
  expect(armourAfter("Średni", 1)).toBe("Lekki");
  expect(armourAfter("Średni", 2)).toBeNull();
  const u = unit("Łowca czarownic", { uniqueId: "l", optionalEquipment: ["Średni", "Tarcza"] });
  expect(damagedSave(u, null)).toBe("4+");
  expect(damagedSave(u, { steps: 1 })).toBe("5+");
  expect(damagedSave(u, { steps: 2, shield: true })).toBe("-");
  expect(describeDamage(u, { steps: 1, shield: true })).toBe("średni pancerz chroni jak lekki pancerz, tarcza zniszczona");
});

test("the sequence changes a hero's equipment and cost for good", () => {
  const u = unit("Łowca czarownic", { uniqueId: "l", optionalEquipment: ["Średni", "Tarcza"], battleArmourDamage: [{ steps: 1, shield: true }] });
  const cost = Number(u.cost);
  const post = { units: [u], journal: [] };
  applyArmourDamage(post);
  expect(u.optionalEquipment).toEqual(["Lekki"]);
  expect(u.cost).toBe(cost - u.equipmentList["Średni"][0] - u.equipmentList.Tarcza[0] + u.equipmentList.Lekki[0]);
  expect(u.battleArmourDamage).toBeUndefined();
  expect(post.journal[0].text).toMatch(/Uszkodzenie pancerza: Łowca czarownic, średni pancerz chroni jak lekki pancerz, tarcza zniszczona/);
});

test("a group keeps its equipment when only some models were hit", () => {
  const g = unit("Zelota", { uniqueId: "z", selectedNumber: 2, optionalEquipment: ["Lekki"], battleArmourDamage: [{ steps: 1 }, null] });
  const post = { units: [g], journal: [] };
  applyArmourDamage(post);
  expect(g.optionalEquipment).toEqual(["Lekki"]);
  expect(post.journal[0].text).toMatch(/1 z 2 modeli/);
});
