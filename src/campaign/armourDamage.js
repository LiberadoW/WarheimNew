import * as R from "./rules";
import { getModifiers } from "../Functions/getModifiers";

// USZKODZENIE PANCERZA (rozdział 12, s. 398): a failed roll after a critical
// wound with an armour penalty damages the armour. Heavy armour then protects
// as medium, medium as light; light armour and a shield are destroyed.
const ARMOURS = ["Ciężki", "Średni", "Lekki"];
const NAMES = { Ciężki: "ciężki pancerz", Średni: "średni pancerz", Lekki: "lekki pancerz" };
const gear = (unit) => [...(unit.startingEquipment || []), ...(unit.optionalEquipment || [])];

// What on this unit can be damaged.
export const damageableArmour = (unit) => ({
  armour: ARMOURS.find((a) => gear(unit).includes(a)) || null,
  shield: gear(unit).includes("Tarcza"),
});
export const armourAfter = (armour, steps = 0) => {
  const i = ARMOURS.indexOf(armour);
  return i < 0 ? armour : ARMOURS[i + steps] || null;
};
const damageList = (list = [], armour, steps, shield) =>
  list.flatMap((item) => {
    if (item === armour && steps) return armourAfter(armour, steps) ? [armourAfter(armour, steps)] : [];
    if (item === "Tarcza" && shield) return [];
    return [item];
  });

// A model's damage: { steps, shield } (steps: failed rolls on the armour).
export const isDamaged = (d) => !!(d && (d.steps > 0 || d.shield));
export const damagedGear = (unit, d) => {
  const { armour } = damageableArmour(unit);
  return damageList(gear(unit), armour, d?.steps || 0, !!d?.shield);
};
// The model's armour save after the damage, "5+" or "-".
export const damagedSave = (unit, d) => {
  const [save] = getModifiers(damagedGear(unit, d), unit);
  return save < 7 ? `${save}+` : "-";
};
export const describeDamage = (unit, d) => {
  const { armour } = damageableArmour(unit);
  const parts = [];
  if (armour && d?.steps) {
    const now = armourAfter(armour, d.steps);
    parts.push(now ? `${NAMES[armour]} chroni jak ${NAMES[now]}` : `${NAMES[armour]} zniszczony`);
  }
  if (d?.shield) parts.push("tarcza zniszczona");
  return parts.join(", ");
};

// The sequence after the skirmish keeps the damage: the unit's equipment
// changes and its cost follows the bought items. A group of henchmen keeps
// one set of equipment, so only damage shared by every model is applied.
export function applyArmourDamage(post) {
  post.units.forEach((u) => {
    const damage = u.battleArmourDamage || [];
    delete u.battleArmourDamage;
    const n = R.modelCount(u);
    const hit = Array.from({ length: n }, (_, i) => damage[i]).filter(isDamaged);
    if (!hit.length) return;
    const name = u.unitDisplayName || u.unitName;
    const key = (d) => `${d?.steps || 0}/${!!d?.shield}`;
    const shared = hit.length === n && hit.every((d) => key(d) === key(hit[0]));
    if (!shared) {
      R.log(post, "inventory", `${name}: uszkodzony pancerz ${hit.length} z ${n} modeli (${describeDamage(u, hit[0])}). Grupa ma jednolity ekwipunek, więc zmień go ręcznie albo zostaw.`);
      return;
    }
    const d = hit[0];
    const { armour } = damageableArmour(u);
    const price = (item) => (u.optionalEquipment || []).includes(item) ? Number(u.equipmentList?.[item]?.[0]) || 0 : 0;
    const before = price(armour) + (d.shield ? price("Tarcza") : 0);
    const text = describeDamage(u, d);
    u.optionalEquipment = damageList(u.optionalEquipment, armour, d.steps || 0, !!d.shield);
    const now = armourAfter(armour, d.steps || 0);
    const after = now && (u.optionalEquipment || []).includes(now) ? Number(u.equipmentList?.[now]?.[0]) || 0 : 0;
    u.startingEquipment = damageList(u.startingEquipment, armour, d.steps || 0, !!d.shield);
    if (before !== after) {
      u.cost = Math.max(0, (Number(u.cost) || 0) - before + after);
      u.totalCost = u.cost * n;
    }
    R.log(post, "inventory", `Uszkodzenie pancerza: ${name}, ${text}.`);
  });
}
