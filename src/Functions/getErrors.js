import isGeneral from "./isGeneral";

const getErrors = (armies, army, totalCost, modelAmount, unitList) => {
  let errors = 0;
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

  return errors;
};

export default getErrors;
