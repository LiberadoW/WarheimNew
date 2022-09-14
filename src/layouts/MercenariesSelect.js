import React from "react";
import "../styles/MercenariesSelect.css";

const MercenariesSelect = ({
  mercenaries,
  setMercenaryUnitName,
  mercenaryUnitName,
  unitList,
  setUnitList,
}) => {
  const handleOnChange = (e) => {
    setMercenaryUnitName(e.target.value);
  };

  const mercenariesList = unitList.filter(
    (unit) => unit.type === "Najemne Ostrze"
  );

  const mercenariesListNames = mercenariesList.map((item) => item.unitName);

  const handleClick = () => {
    if (mercenariesListNames.includes(mercenaryUnitName)) {
      alert("Osiągnięto limit dla tej jednostki");
    } else {
      setUnitList((oldUnitList) => [
        ...oldUnitList,
        {
          unitName: mercenaryUnitName,
          id: mercenaries[mercenaryUnitName].id,
          optionalEquipment: [],
          cost: mercenaries[mercenaryUnitName].cost,
          totalCost: mercenaries[mercenaryUnitName].cost,
          startingEquipment: mercenaries[mercenaryUnitName].startingEquipment,
          equipmentList: mercenaries[mercenaryUnitName].equipmentList,
          stats: mercenaries[mercenaryUnitName].stats,
          rules: mercenaries[mercenaryUnitName].rules,
          exp: mercenaries[mercenaryUnitName].exp,
          skills: mercenaries[mercenaryUnitName].skills,
          prestige: mercenaries[mercenaryUnitName].prestige,
          pay: mercenaries[mercenaryUnitName].pay,
          type: mercenaries[mercenaryUnitName].type,
          number: mercenaries[mercenaryUnitName].number,
          selectedNumber: 1,
        },
      ]);
    }
  };

  return (
    <div className="mercenaries-select-container">
      <span className="bold">Najemne Ostrza:</span>
      <p>
        <select name="" id="unit-selection" onChange={handleOnChange} value={mercenaryUnitName}>
          <option value="" disabled>
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
        <button  className="button" onClick={handleClick}>Dodaj</button>
      </p>
    </div>
  );
};

export default MercenariesSelect;
