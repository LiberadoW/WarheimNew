import React from "react";
import "../styles/MercenariesSelect.css"

const MercenariesSelect = ({
  mercenaries,
  setUnitName,
  unitName,
  unitList,
  setUnitList,
}) => {
  const handleOnChange = (e) => {
    setUnitName(e.target.value);
  };

  const mercenariesList = unitList.filter(
    (unit) => unit.type === "Najemne Ostrze"
  );

  const mercenariesListNames = mercenariesList.map((item) => item.unitName);

  const handleClick = () => {
    if (mercenariesListNames.includes(unitName)) {
      alert("Osiągnięto limit dla tej jednostki");
    } else {
      setUnitList((oldUnitList) => [
        ...oldUnitList,
        {
          unitName: unitName,
          id: mercenaries[unitName].id,
          optionalEquipment: [],
          cost: mercenaries[unitName].cost,
          totalCost: mercenaries[unitName].cost,
          startingEquipment: mercenaries[unitName].startingEquipment,
          stats: mercenaries[unitName].stats,
          rules: mercenaries[unitName].rules,
          exp: mercenaries[unitName].exp,
          skills: mercenaries[unitName].skills,
          prestige: mercenaries[unitName].prestige,
          pay: mercenaries[unitName].pay,
          type: mercenaries[unitName].type,
          number: mercenaries[unitName].number,
          selectedNumber: 1,
        },
      ]);
    }
  };

  return (
    <div className="mercenaries-select-container">
      <span className="bold">Najemne Ostrza:</span>
      <p><select name="" id="unit-selection" onChange={handleOnChange}>
        <option value="" selected="selected" disabled>
          Wybierz postać
        </option>
        <optgroup label={"Najemne Ostrza"}>
          {Object.entries(mercenaries).map(([key, value], index) => {
            return (
              <option key={index} value={key}>
                {key}
              </option>
            );
          })}
        </optgroup>
      </select>
      <button onClick={handleClick}>Dodaj</button></p>
    </div>
  );
};

export default MercenariesSelect;
