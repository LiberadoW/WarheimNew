import { armyChoices } from "../Data.js/ArmyChoices";

const setOptionDisabled = (optionsArray, unitName, disabled) => {
  const option = optionsArray.find((item) => item.value === unitName);
  if (option) {
    option.disabled = disabled;
  }
};

const disableOneOfChoices = (unitArr, unitList) => {
  if (!Array.isArray(unitArr) || unitArr.length === 0) {
    return;
  }

  const unitNames = unitList.map((a) => a.unitName);
  const optionsArray = Array.from(
    document.querySelectorAll("#unit-selection option"),
  );

  if (optionsArray.length === 0) {
    return;
  }

  if (unitArr.some((item) => unitNames.includes(item))) {
    unitArr.forEach((mainUnit) => {
      const removedUnitArr = unitArr.filter((e) => e !== mainUnit);

      if (unitNames.includes(mainUnit)) {
        removedUnitArr.forEach((unit) => {
          setOptionDisabled(optionsArray, unit, true);
        });
      }
    });
  } else {
    unitArr.forEach((mainUnit) => {
      setOptionDisabled(optionsArray, mainUnit, false);
    });
  }
};

export const getOneOfChoices = (army, unitList) => {
  const choices = armyChoices[army?.name];

  if (Array.isArray(choices)) {
    choices.forEach((unit) => {
      disableOneOfChoices(unit, unitList);
    });
  }
};
