import isGeneral from "./isGeneral";
import findCommonElements from "./findCommonElements";

const getErrors = (armies, army, totalCost, modelAmount, unitList) => {
  let errors = 0;

  unitList.forEach((item, index) => {

    const startingWeaponsOptions = Object.entries(item.equipmentList).filter(
      ([key, value]) => value[2] === "Startowy"
    );

    if (startingWeaponsOptions.length>0) {
      const intersection = item.optionalEquipment.filter(element => startingWeaponsOptions.flat().includes(element));
      console.log(intersection)
  
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

  return errors;
};

export default getErrors;
