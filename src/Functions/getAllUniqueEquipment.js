export const getAllUniqueEquipment = (unitList) => {
  const equipmentArray = [];

  unitList.forEach((item) =>
    equipmentArray.push(
      ...item.startingEquipment.concat(item.optionalEquipment)
    )
  );

  console.log(unitList);

  const uniqueEquipmentArray = [...new Set(equipmentArray)];

  uniqueEquipmentArray.sort();

  return uniqueEquipmentArray;
};
