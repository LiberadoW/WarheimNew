import { React, useContext } from "react";
import "../styles/ArmySelect.css";
import armies from "../Data.js/Armies";
import { CommandContext } from "../layouts/Builder";

const ArmySelect = ({
  army,
  unitList,
  setArmy,
  setUnitList,
  setUnitName,
  setIdShown,
  setMercenaryUnitName,
  resetCampaignNotes,
}) => {
  const { setStandardBearer, setMusician } = useContext(CommandContext);

  const handleOnChange = (e) => {
    if (army.name !== e.target.value && unitList?.length > 0 && !window.confirm("Zmiana bandy wyczyści aktualną kompanię. Kontynuować?")) return;
    setArmy(e.target.value);
    setUnitName("");
    setUnitList([]);
    setIdShown(null);
    setMercenaryUnitName("");
    resetCampaignNotes();
    setStandardBearer(null);
    setMusician(null);
  };

  const updatedArmies = Object.keys(armies);

  return (
    <div className="army-select-container">
      <label htmlFor="army-selection">Banda</label>
      <select id="army-selection" onChange={handleOnChange} value={army.name}>
        <option disabled>Wybierz bandę</option>

        {Object.keys(armies)
          .sort((a, b) => a.localeCompare(b, "pl"))
          .map((army, index) => {
            return (
              <option
                key={index}
                value={army}
                className={
                  updatedArmies.includes(army)
                    ? `army-select-updated-option`
                    : ``
                }
              >
                {army}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default ArmySelect;
