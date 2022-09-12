import React from "react";
import { getUnitNumbers } from "../Functions/getUnitNumbers";
import "../styles/UnitSelect.css"

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
          stats: heroes[unitName].stats,
          rules: heroes[unitName].rules,
          exp: heroes[unitName].exp,
          skills: heroes[unitName].skills,
          type: heroes[unitName].type,
          number: heroes[unitName].number,
          selectedNumber: 1,
        },
      ]);
    }
  };

  const handleClick2 = () => {
    setUnitList((oldUnitList) => [
      ...oldUnitList,
      {
        unitName: "",
        unitDisplayName: "",
        id: 1000,
        optionalEquipment: [],
        cost: 0,
        totalCost: 0,
        startingEquipment: [],
        stats: {
          Początkowa: ["", "", "", "", "", "", "", "", ""],
          Maksymalna: ["", "", "", "", "", "", "", "", ""],
        },
        rules: [],
        exp: "",
        skills: [""],
        type: "Bohater",
        number: "",
        selectedNumber: 1,
      },
    ]);
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
      {/* <button onClick={handleClick2}>Dodaj puste</button> */}

      <p>
      <select name="" id="unit-selection" onChange={handleOnChange}>
        <option value="" selected="selected" disabled>
          Wybierz postać
        </option>
        {groupedHeroes.map((item, index) => {
          return (
            <optgroup label={labels[index]}>
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
      <button onClick={handleClick}>Dodaj</button>
      </p>
    </div>
  );
};

export default UnitSelect;
