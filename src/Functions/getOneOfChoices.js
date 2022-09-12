import { getUnitNumbers } from "./getUnitNumbers";

export const getOneOfChoices = (army, unitList) => {
  const unitNames = unitList.map((a) => a.unitName);
  const unitNumbers = getUnitNumbers(unitList);

  const choices = [
    ["Magister magii", "Kapłan Ranalda"],
    ["Siłacz", "Żongler"],
    ["Ogr", "Niedźwiedź"],
    ["Zaprzęg", "Rydwan"],
  ];

  const optionsArray = Array.from(
    document.querySelectorAll("#unit-selection option")
  );

  switch (army) {
    case "cyrkowcy": {
      choices.forEach((unit) => {
        if (unitNames.includes(unit[0])) {
          const opt = optionsArray.filter((x) => x.value === unit[1]);
          opt[0].disabled = true;
        } else {
          const opt = optionsArray.filter((x) => x.value === unit[1]);
          opt[0].disabled = false;
        }

        if (unitNames.includes(unit[1])) {
          const opt = optionsArray.filter((x) => x.value === unit[0]);
          opt[0].disabled = true;
        } else {
          const opt = optionsArray.filter((x) => x.value === unit[0]);
          opt[0].disabled = false;
        }

        const filteredUnit = unitList.filter(
          (item) => item.unitName === unit[0]
        );
        if (filteredUnit.length > 0) {
          console.log(filteredUnit[0].number);
        }
      });
    }
  }
};
