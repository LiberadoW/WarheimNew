import isGeneral from "./isGeneral";
import { getValueOfOptionalEquipment } from "./getValueOfOptionalEquipment";

const getErrors = (armies, army, totalCost, modelAmount, unitList) => {
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

  if (totalCost > army.limit) {
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
