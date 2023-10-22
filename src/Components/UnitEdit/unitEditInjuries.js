import "./unitEditInjuries.css";
import { useEffect } from "react";

const INJURIES_LIST = [
  "Rana nogi",
  "Rana ręki",
  "Szaleństwo",
  "Strzaskana noga",
  "Rana klatki piersiowej",
  "Oślepiony",
  "Stare wojenne rany",
  "Uszkodzenie układu nerwowego",
  "Rana dłoni",
  "Głębokie rany",
  "Ograbiony",
  "Zawzięty wróg",
  "To co nas nie zabije to nas wzmocni",
  "Przerażające blizny",
];

const UnitEditInjuries = ({ unitList, unit, setUnitList, heroes }) => {
  if (!unit.hasOwnProperty("injuries")) {
    unit.injuries = [];
  }

  const baseStats = unit.stats.Początkowa;
  const handleChange = (e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;

    const statsModifiers = unit.statsModifiers;

    if (isChecked) {
      if (!unit.injuries.includes(value)) {
        unit.injuries.push(value);
      }
    } else {
      const index = unit.injuries.indexOf(value);
      if (index > -1) {
        unit.injuries.splice(index, 1);
      }
    }

    switch (value) {
      case "Rana nogi":
        statsModifiers[0] = isChecked ? -Math.ceil(baseStats[0] / 2) : 0;
        break;
      case "Oślepiony":
        statsModifiers[2] += isChecked ? -1 : 1;
        break;
      case "Rana klatki piersiowej":
        statsModifiers[4] += isChecked ? -1 : 1;
        break;
      case "Uszkodzenie układu nerwowego":
        statsModifiers[6] += isChecked ? -1 : 1;
        break;
      case "Rana dłoni":
        statsModifiers[1] += isChecked ? -1 : 1;
        break;
      default:
        break;
    }

    console.log(unit.statsModifiers);

    unit.stats.Aktualna = baseStats.map(
      (item, index) => item + statsModifiers[index]
    );

    setUnitList([...unitList]);
  };

  return (
    <ul className="unit-edit-injuries-container">
      {INJURIES_LIST.map((injury, index) => {
        return (
          <li key={index} className="injury-label">
            <input
              type="checkbox"
              onChange={handleChange}
              value={injury}
              checked={unit.injuries?.includes(injury)}
              className="injury-checkbox"
            />
            <span>{injury}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default UnitEditInjuries;
