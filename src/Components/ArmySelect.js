import React from "react";
import "../styles/ArmySelect.css";
import armies from "../Data.js/Armies";

const ArmySelect = ({
  army,
  setArmy,
  setUnitList,
  setUnitName,
  setIdShown,
  setMercenaryUnitName,
}) => {
  const handleOnChange = (e) => {
    setArmy(e.target.value);
    setUnitName("");
    setUnitList([]);
    setIdShown(null);
    setMercenaryUnitName("");
  };
  return (
    <div className="army-select-container">
      <span className="bold">Banda:</span>
      <select onChange={handleOnChange} value={army.name}>
        <option disabled>Wybierz bandę</option>

        {Object.keys(armies).map((army,index)=>{
          return (
            <option key={index} value={army}>{army}</option>
          )
        })}

      </select>
    </div>
  );
};

export default ArmySelect;
