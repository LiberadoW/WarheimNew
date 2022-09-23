import React from "react";
import "../styles/ArmySelect.css";

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
        <option value="Cyrkowcy z Ligii Ostermarku">
          Cyrkowcy z Ligii Ostermarku
        </option>
        <option value="Łowcy Czarownic">Łowcy Czarownic</option>
        <option value="Muszkieterzy z Nuln">Muszkieterzy z Nuln</option>
        <option value="Piechota Morska z Marienburga">
          Piechota Morska z Marienburga
        </option>
        <option value="Gladiatorzy z Jałowej Krainy">Gladiatorzy z Jałowej Krainy</option>
        <option value="Leśni Elfowie z Athel Loren">
          Leśni Elfowie z Athel Loren
        </option>
        <option value="Elfowie Wysokiego Rodu z Ulthuan">Elfowie Wysokiego Rodu z Ulthuan</option>
        <option value="Khazadzi z Gór Krańca Świata">Khazadzi z Gór Krańca Świata</option>
        
      </select>
    </div>
  );
};

export default ArmySelect;
