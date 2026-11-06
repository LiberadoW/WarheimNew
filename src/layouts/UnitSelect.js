import React from "react";
import "../styles/UnitSelect.css";
import { createUnit } from "../Functions/createUnit";
import { getUnitAvailability } from "../Functions/getUnitAvailability";

const UnitSelect = ({ army, setUnitName, unitName, unitList, setUnitList }) => {
  const heroes = army?.heroes || {};

  const handleOnChange = (e) => {
    setUnitName(e.target.value);
  };

  const availability = getUnitAvailability(army, unitList);

  const handleClick = () => {
    if (unitName === "") {
      alert("Wybierz jednostkę");
    } else if (!availability[unitName]?.isAvailable) {
      alert("Osiągnąłeś limit dla tej jednostki");
    } else {
      setUnitList((oldUnitList) => [
        ...oldUnitList,
        createUnit(heroes, unitName),
      ]);
    }
  };

  const groups = [{}, {}, {}];
  const labels = ["Bohaterowie", "Stronnicy", "Machiny"];

  Object.entries(heroes).forEach(([key, value]) => {
    if (value.retired) return;
    if (value.type === "Bohater") {
      groups[0][key] = value;
    } else if (value.type === "Stronnik") {
      groups[1][key] = value;
    } else if (value.type === "Machina") {
      groups[2][key] = value;
    }
  });

  return (
    <div className="unit-select-container header-field">
      <span className="header-field-label">Postać</span>
      <p>
        <select
          name=""
          id="unit-selection"
          onChange={handleOnChange}
          value={unitName}
        >
          <option value="" disabled>
            Wybierz postać
          </option>
          {groups.map((group, index) => {
            if (Object.keys(group).length === 0) {
              return null;
            }
            return (
              <optgroup label={labels[index]} key={labels[index]}>
                {Object.entries(group).map(([key, value]) => {
                  return (
                    <option
                      key={key}
                      value={key}
                      disabled={!availability[key]?.isAvailable}
                    >
                      {`${key} (${value.cost} zk) `}
                    </option>
                  );
                })}
              </optgroup>
            );
          })}
        </select>
        <button className="button" onClick={handleClick}>
          Dodaj
        </button>
      </p>
    </div>
  );
};

export default UnitSelect;
