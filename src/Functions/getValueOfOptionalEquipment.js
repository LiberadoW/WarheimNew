export const getValueOfOptionalEquipment = (list) => {
let value = 0;
list.forEach(unit=>{
    unit.optionalEquipment.forEach(eq=>{
        value += unit.equipmentList[eq][0]*unit.selectedNumber
    })
})
return value
};
