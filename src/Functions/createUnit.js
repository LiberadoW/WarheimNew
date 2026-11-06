import { uuidv4 } from "@firebase/util";
import { PAIRED_UNITS } from "./getUnitAvailability";

const cloneStats = (statsObject) =>
  Object.fromEntries(
    Object.entries(statsObject || {}).map(([key, value]) => [
      key,
      Array.isArray(value) ? [...value] : value,
    ])
  );

// Builds a fresh unit list entry from the army's unit definition.
export const createUnit = (heroes, unitName) => {
  const hero = heroes[unitName];

  return {
    unitName: unitName,
    unitDisplayName: "",
    id: hero.id,
    optionalEquipment: [],
    cost: hero.cost,
    totalCost: hero.cost,
    startingEquipment: [...(hero.startingEquipment || [])],
    equipmentList: Object.fromEntries(
      Object.entries(hero.equipmentList || {}).map(([name, values]) => [
        name,
        [...values],
      ])
    ),
    stats: cloneStats(hero.stats),
    statsModifiers: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    baseRules: Array.isArray(hero.rules) ? [...hero.rules] : [],
    rules: Array.isArray(hero.rules) ? [...hero.rules] : [],
    customEquipment: [],
    exp: hero.exp ? hero.exp : 0,
    skills: Array.isArray(hero.skills) ? [...hero.skills] : [],
    type: hero.type,
    number: hero.number,
    selectedNumber: PAIRED_UNITS.includes(unitName) ? 2 : 1,
    uniqueId: uuidv4(),
  };
};
