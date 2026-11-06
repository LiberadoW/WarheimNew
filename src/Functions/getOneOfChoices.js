import { armyChoices } from "../Data.js/ArmyChoices";

// Returns { blockedUnitName: chosenUnitName } for the army's mutually
// exclusive recruitment choices, based on the units already in the list.
export const getBlockedChoices = (army, unitList) => {
  const choices = armyChoices[army?.name];
  const blocked = {};

  if (!Array.isArray(choices)) {
    return blocked;
  }

  const unitNames = unitList.map((a) => a?.unitName);

  choices.forEach((unitArr) => {
    if (!Array.isArray(unitArr)) {
      return;
    }

    unitArr.forEach((mainUnit) => {
      if (!unitNames.includes(mainUnit)) {
        return;
      }

      unitArr
        .filter((unit) => unit !== mainUnit)
        .forEach((unit) => {
          blocked[unit] = mainUnit;
        });
    });
  });

  return blocked;
};
