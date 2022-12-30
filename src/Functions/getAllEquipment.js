export const getAllEquipment = (unitList) => {
  const equipmentList = unitList
    .map((unit) => {
      return unit.startingEquipment.concat(unit.optionalEquipment);
    })
    .flat();

    return equipmentList
};
