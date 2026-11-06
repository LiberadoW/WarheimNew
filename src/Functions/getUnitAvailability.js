import { getUnitNumbers } from "./getUnitNumbers";
import { getBlockedChoices } from "./getOneOfChoices";

// Units that can only be taken once, as a pair of models.
export const PAIRED_UNITS = ["Duże Dźgacze", "Drużyna ciężkich broni"];

// Returns { unitName: { count, max, isAvailable, blockedBy } } for every
// recruitable unit of the army.
export const getUnitAvailability = (army, unitList) => {
  const heroes = army?.heroes || {};
  const unitNumbers = getUnitNumbers(unitList);
  const blockedChoices = getBlockedChoices(army, unitList);
  const availability = {};

  Object.entries(heroes).forEach(([unitName, unit]) => {
    const entries = unitList.filter(
      (item) => item != null && item.unitName === unitName,
    ).length;
    const models = unitNumbers[unitName] || 0;
    const isAtLimit =
      entries >= unit.number ||
      models >= unit.number ||
      (PAIRED_UNITS.includes(unitName) && entries >= 1);
    const blockedBy = blockedChoices[unitName] || null;

    availability[unitName] = {
      count: models,
      max: unit.number,
      isAvailable: !unit.retired && !isAtLimit && !blockedBy,
      isAtLimit,
      blockedBy,
    };
  });

  return availability;
};
