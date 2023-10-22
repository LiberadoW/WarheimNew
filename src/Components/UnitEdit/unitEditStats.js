import React from "react";
import "./unitEditStats.css";
import { getModifiers } from "../../Functions/getModifiers";
import { mercenariesList } from "../../Data.js/Mercenaries";

const stats = ["Sz", "WW", "US", "S", "Wt", "Żw", "I", "A", "CP"];

const UnitEditStats = ({ unitList, unit, setUnitList, heroes }) => {
  const maxStats = unit.stats.Maksymalna;

  const baseStats =
    unit.type === "Najemne Ostrze"
      ? [...mercenariesList[unit.unitName].stats.Początkowa]
      : unit.stats.Początkowa;

  const statsModifiers = unit.statsModifiers
    ? unit.statsModifiers
    : [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // if (!unit.stats.hasOwnProperty("Aktualna")) {
  //   if (unit.type === "Najemne Ostrze") {
  //     unit.stats.Aktualna = [
  //       ...mercenariesList[unit.unitName].stats.Początkowa,
  //     ];
  //   } else {

  //   }
  // }
  unit.stats.Aktualna = baseStats.map(
    (item, index) => item + statsModifiers[index]
  );

  const currentStats = unit.stats.Aktualna;

  const equipmentString = unit.startingEquipment.concat(unit.optionalEquipment);

  const [armour, speedModifier, initativeModifier] = getModifiers(
    equipmentString,
    unit
  );

  const handleClickIncrease = (index) => {
    statsModifiers[index]++;

    const maxModifier = maxStats[index] - baseStats[index];

    if (statsModifiers[index] > maxModifier) {
      statsModifiers[index] = maxModifier;
    }

    unit.stats.Aktualna = baseStats.map(
      (item, index) => item + statsModifiers[index]
    );

    setUnitList([...unitList]);
  };

  const handleClickDecrease = (index) => {
    statsModifiers[index]--;

    const minModifier = 1 - baseStats[index];

    if (statsModifiers[index] < minModifier) {
      statsModifiers[index] = minModifier;
    }

    unit.stats.Aktualna = baseStats.map(
      (item, index) => item + statsModifiers[index]
    );
    setUnitList([...unitList]);
  };
  return (
    <ul className="unit-edit-stats-container">
      {stats.map((item, index) => (
        <li key={index} className="unit-edit-stats">
          <div className="unit-edit-stats-label">{item}</div>
          <button
            className="plus-button"
            onClick={() => handleClickIncrease(index)}
          >
            +
          </button>
          <div
            className={`unit-edit-stats-value ${
              currentStats[index] > baseStats[index]
                ? "green"
                : currentStats[index] < baseStats[index]
                ? "red"
                : ""
            }`}
          >
            {currentStats[index]}
          </div>
          <button
            className="minus-button"
            onClick={() => handleClickDecrease(index)}
          >
            -
          </button>
        </li>
      ))}
    </ul>
  );
};

export default UnitEditStats;
