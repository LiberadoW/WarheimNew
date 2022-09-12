import React from "react";
import "../styles/ArmySelect.css";

const ArmySelect = ({ setArmy, setUnitList }) => {
  const handleOnChange = (e) => {
    setArmy(e.target.value);
    setUnitList([]);
  };
  return (
    <div className="army-select-container">
      <span className="bold">Banda:</span>
      <select onChange={handleOnChange}>
        <option value="default" disabled>
          Wybierz bandę
        </option>
        <option value="cyrkowcy">Cyrkowcy z Ligii Ostermarku</option>
        <option value="witchHunters">Łowcy Czarownic</option>
      </select>
    </div>
  );
};

export default ArmySelect;
