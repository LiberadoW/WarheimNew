import isGeneral from "./isGeneral";
import { getValueOfOptionalEquipment } from "./getValueOfOptionalEquipment";
import { getAllEquipment } from "./getAllEquipment";
import { getUnitNumbers } from "./getUnitNumbers";

const getErrors = (army, totalCost, modelAmount, unitList, limit) => {
  let errors = 0;

  unitList.forEach((item, index) => {
    const startingWeaponsOptions = Object.entries(item.equipmentList).filter(
      ([key, value]) => value[2] === "Startowy"
    );

    if (startingWeaponsOptions.length > 0) {
      const intersection = item.optionalEquipment.filter((element) =>
        startingWeaponsOptions.flat().includes(element)
      );

      if (intersection.length < 1) {
        errors += 1;
      }
    }
  });

  const unitNumbers = getUnitNumbers(
    unitList.filter((unit) => unit.type !== "Najemne Ostrze")
  );

  Object.keys(unitNumbers).forEach((unit) => {
    if (unitNumbers[unit] > army.heroes[unit].number) {
      errors += 1;
    }
  });

  const equipmentList = getAllEquipment(unitList);

  const oneOfItems = ["Harpun", "Ołowiomiotacz"];

  oneOfItems.forEach((item) => {
    if (equipmentList.filter((x) => x === item).length > 1) {
      errors += 1;
    }
  });

  if (totalCost > limit) {
    errors += 1;
  }
  if (!isGeneral(unitList)) {
    errors += 1;
  }
  if (modelAmount < army.minModels) {
    errors += 1;
  }
  if (modelAmount > army.maxModels) {
    errors += 1;
  }
  if (army.armyRules.includes("Zamożność") && totalCost > 500) {
    const valueOfOptionalEquipment = getValueOfOptionalEquipment(unitList);

    if (valueOfOptionalEquipment < totalCost - 500) {
      errors += 1;
    }
  }

  return errors;
};

export default getErrors;
