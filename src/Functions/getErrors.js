import isGeneral from "./isGeneral";

const getErrors = (armies, army, totalCost, modelAmount, unitList) => {
  let errors = 0;
  if (totalCost > armies[army].limit) {
    errors += 1;
  }
  if (!isGeneral(unitList)) {
    errors += 1;
  }
  if (modelAmount < armies[army].minModels) {
    errors += 1;
  }
  if (modelAmount > armies[army].maxModels) {
    errors += 1;
  }

  return errors;
};

export default getErrors;
