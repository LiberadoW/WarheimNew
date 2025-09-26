import { armies } from "../layouts/Builder";
import { getUnitNumbers } from "../Functions/getUnitNumbers";

const getModelAmount = (unitList, army) => {
  const unitNumbers = getUnitNumbers(unitList);
  //filter out mercenaries, they don't count towards model limit
  const filteredUnits = Object.keys(unitNumbers).filter((unit) =>
    Object.keys(army?.heroes).includes(unit)
  );

  const filteredUnitNumbers = {};
  filteredUnits.forEach((unit) => {
    filteredUnitNumbers[unit] = unitNumbers[unit];
  });

  const modelAmount =
    filteredUnits.length >= 1
      ? Object.values(filteredUnitNumbers).reduce((x, y) => x + y)
      : 0;

  return modelAmount;
};

export default getModelAmount;
