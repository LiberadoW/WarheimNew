export const getUnitNumbers = (unitList) => { 
    const unitNumberArr = [];
    unitList.forEach((item) => {
      unitNumberArr.push([item.unitName, item.selectedNumber]);
    });
  
    const unitNumbers = {};
  
    unitList.forEach((item) => {
      let number = 0;
      unitNumberArr.forEach((itemNumber) => {
        if (itemNumber[0] == item.unitName) {
          number += Number(itemNumber[1]);
        }
      });
      unitNumbers[item.unitName] = number;
    });

    return unitNumbers
}