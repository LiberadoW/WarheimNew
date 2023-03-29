import { React, useContext } from "react";
import "../styles/ArmySelect.css";
import armies from "../Data.js/Armies";
import { CommandContext } from "../layouts/Builder";

const ArmySelect = ({
  army,
  setArmy,
  setUnitList,
  setUnitName,
  setIdShown,
  setMercenaryUnitName,
}) => {
  const { setStandardBearer, setMusician } = useContext(CommandContext);

  const handleOnChange = (e) => {
    setArmy(e.target.value);
    setUnitName("");
    setUnitList([]);
    setIdShown(null);
    setMercenaryUnitName("");
    setStandardBearer(null);
    setMusician(null);
  };

  return (
    <div className="army-select-container">
      <span className="bold">Banda:</span>
      <select onChange={handleOnChange} value={army.name}>
        <option disabled>Wybierz bandę</option>

        {Object.keys(armies)
          .sort((a, b) => a.localeCompare(b, "pl"))
          .map((army, index) => {
            return (
              <option key={index} value={army}>
                {army}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default ArmySelect;
