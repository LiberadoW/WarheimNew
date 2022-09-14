import { getUnitNumbers } from "./getUnitNumbers";

const disableOneOfChoices = (unit1, unit2, unitList) => {
  const unitNames = unitList.map((a) => a.unitName);
  const unitNumbers = getUnitNumbers(unitList);
  const optionsArray = Array.from(
    document.querySelectorAll("#unit-selection option")
  );

  const filteredUnit1 = unitList.filter((item) => item.unitName === unit1);
  let number1;
  let selectedNumber1;
  if (filteredUnit1.length > 0) {
    number1 = filteredUnit1[0].number;
    selectedNumber1 = unitNumbers[unit1];
  }

  const filteredUnit2 = unitList.filter((item) => item.unitName === unit2);
  let number2;
  let selectedNumber2;
  if (filteredUnit2.length > 0) {
    number2 = filteredUnit2[0].number;
    selectedNumber2 = unitNumbers[unit2];
  }

  if (unitNames.includes(unit1)) {
    const opt = optionsArray.filter((x) => x.value === unit2);
    opt[0].disabled = true;
  } else {
    const opt = optionsArray.filter((x) => x.value === unit2);
    opt[0].disabled = number2 <= selectedNumber2 ? true : false;
  }

  if (unitNames.includes(unit2)) {
    const opt = optionsArray.filter((x) => x.value === unit1);
    opt[0].disabled = true;
  } else {
    const opt = optionsArray.filter((x) => x.value === unit1);
    opt[0].disabled = number1 <= selectedNumber1 ? true : false;
  }
};

export const getOneOfChoices = (army, unitList) => {
  const choices = {
    "Cyrkowcy z Ligii Ostermarku": [
      ["Magister magii", "Kapłan Ranalda"],
      ["Siłacz", "Żongler"],
      ["Ogr", "Niedźwiedź"],
      ["Zaprzęg", "Rydwan"],
    ],
    "Muszkieterzy z Nuln": [
      ["Magister magii", "Prezbiter Sigmara"],
      ["Rajtar", "Krasnoludzki Ranger"],
      ["Wóz bojowy","Rydwan"]
    ],
    "Piechota Morska z Marienburga": [
      ["Czarownik", "Kapłan Mannana"]
    ]
  };

  if (choices[army.name] !== undefined) {
    choices[army.name].forEach((unit) => {
      disableOneOfChoices(unit[0], unit[1], unitList);

      // const filteredUnit = unitList.filter((item) => item.unitName === unit[0]);
      // if (filteredUnit.length > 0) {
      //   number0 = filteredUnit[0].number;
      //   selectedNumber0 = unitNumbers[unit[0]];
      // }
      // if (unitNames.includes(unit[0])) {
      //   const opt = optionsArray.filter((x) => x.value === unit[1]);
      //   opt[0].disabled = true;
      // } else {
      //   const opt = optionsArray.filter((x) => x.value === unit[1]);
      //   opt[0].disabled = false;
      // }
      // if (unitNames.includes(unit[1])) {
      //   const opt = optionsArray.filter((x) => x.value === unit[0]);
      //   opt[0].disabled = true;
      // } else {
      //   const opt = optionsArray.filter((x) => x.value === unit[0]);
      //   opt[0].disabled = number0 <= selectedNumber0 ? true : false;
      // }
    });
  }
};
