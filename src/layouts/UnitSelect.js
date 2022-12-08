import React from "react";
import { getUnitNumbers } from "../Functions/getUnitNumbers";
import "../styles/UnitSelect.css"
import { uuidv4 } from "@firebase/util";

const UnitSelect = ({
  heroes,
  setUnitName,
  unitName,
  unitList,
  setUnitList,
}) => {
  const handleOnChange = (e) => {
    setUnitName(e.target.value);
  };

  const unitNameArr = [];
  unitList.forEach((item) => {
    if (item != null) {
      unitNameArr.push(item.unitName);
    }
  });

  const unitNumbers = getUnitNumbers(unitList);

  const handleClick = () => {
   if (unitName==="") {
    alert("Wybierz jednostkę")
   } else {
    if (heroes[unitName].number <= unitNumbers[unitName]) {
      alert("Osiągnąłeś limit dla tej jednostki");
    } else {
      setUnitList((oldUnitList) => [
        ...oldUnitList,
        {
          unitName: unitName,
          unitDisplayName: "",
          id: heroes[unitName].id,
          optionalEquipment: [],
          cost: heroes[unitName].cost,
          totalCost: heroes[unitName].cost,
          startingEquipment: heroes[unitName].startingEquipment,
          equipmentList: heroes[unitName].equipmentList,
          stats: heroes[unitName].stats,
          rules: heroes[unitName].rules,
          exp: heroes[unitName].exp,
          skills: heroes[unitName].skills,
          type: heroes[unitName].type,
          number: heroes[unitName].number,
          selectedNumber: 1,
          uniqueId: uuidv4()
        },
      ]);
    }
   }
  };

  const groups = [{}, {}, {}];
  const labels = ["Bohaterowie", "Stronnicy", "Machiny"];

  Object.entries(heroes).forEach(([key, value]) => {
    if (value.type === "Bohater") {
      groups[0][key] = value;
    } else if (value.type === "Stronnik") {
      groups[1][key] = value;
    } else if (value.type === "Machina") {
      groups[2][key] = value;
    }
  });

  const groupedHeroes = groups.filter(
    (value) => Object.keys(value).length !== 0
  );

  return (
    <div className="unit-select-container">
      <span className="bold">Postać:</span>
      <p>
      <select name="" id="unit-selection" onChange={handleOnChange} value={unitName}>
        <option value=""  disabled>
          Wybierz postać
        </option>
        {groupedHeroes.map((item, index) => {
          return (
            <optgroup label={labels[index]} key={index}>
              {Object.entries(groupedHeroes[index]).map(([key, value]) => {
                return (
                  <option
                    key={key}
                    value={key}
                    disabled={
                      unitNameArr.filter((x) => x == key).length >=
                      heroes[key].number
                    }
                  >
                    {key}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
      </select>
      <button className="button"onClick={handleClick}>Dodaj</button>
      </p>
    </div>
  );
};

export default UnitSelect;
