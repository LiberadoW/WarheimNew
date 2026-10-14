import React, { useState } from "react";
import { armyChoices } from "../Data.js/ArmyChoices";
import { getUnitNumbers } from "../Functions/getUnitNumbers";
import "../styles/UnitSelect.css";
import { uuidv4 } from "@firebase/util";

const cloneStats = (statsObject) =>
  Object.fromEntries(
    Object.entries(statsObject || {}).map(([key, value]) => [
      key,
      Array.isArray(value) ? [...value] : value,
    ])
  );

const UnitSelect = ({
  heroes,
  armyName,
  setUnitName,
  unitName,
  unitList,
  setUnitList,
}) => {
  const [query, setQuery] = useState("");
  const normalize = (value) => value.toLocaleLowerCase("pl").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
  const isUnavailable = (name) => heroes[name].retired || (unitNumbers[name] || 0) >= heroes[name].number ||
    (armyChoices[armyName] || []).some((group) => group.includes(name) && group.some((other) => other !== name && (unitNumbers[other] || 0) > 0));
  const handleOnChange = (e) => {
    setUnitName(e.target.value);
  };

  const unitNumbers = getUnitNumbers(unitList);

  const handleClick = () => {
    if (unitName === "") {
      alert("Wybierz jednostkę");
    } else {
      if (isUnavailable(unitName)) {
        alert("Osiągnąłeś limit dla tej jednostki");
      } else {
        setUnitList((oldUnitList) => [
          ...oldUnitList,
          {
            unitName: unitName,
            unitDisplayName: "",
            id: heroes[unitName].id,
            optionalEquipment: [],
            cost: heroes[unitName].cost,
            totalCost: heroes[unitName].cost,
            startingEquipment: [...(heroes[unitName].startingEquipment || [])],
            equipmentList: Object.fromEntries(
              Object.entries(heroes[unitName].equipmentList || {}).map(([name, values]) => [name, [...values]])
            ),
            stats: cloneStats(heroes[unitName].stats),
            statsModifiers: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            baseRules: Array.isArray(heroes[unitName].rules)
              ? [...heroes[unitName].rules]
              : [],
            rules: Array.isArray(heroes[unitName].rules)
              ? [...heroes[unitName].rules]
              : [],
            customEquipment: [],
            exp: heroes[unitName].exp ? heroes[unitName].exp : 0,
            skills: Array.isArray(heroes[unitName].skills)
              ? [...heroes[unitName].skills]
              : [],
            type: heroes[unitName].type,
            number: heroes[unitName].number,
            selectedNumber:
              unitName === "Duże Dźgacze" ||
              unitName === "Drużyna ciężkich broni"
                ? 2
                : 1,
            uniqueId: uuidv4(),
          },
        ]);
      }
    }
  };

  const groups = [
    ["Bohaterowie", "Bohater"], ["Stronnicy", "Stronnik"], ["Machiny", "Machina"],
  ].map(([label, type]) => ({ label, units: Object.entries(heroes).filter(([name, unit]) =>
    unit.type === type && !unit.retired && (name === unitName || normalize(name).includes(normalize(query)))) }));
  const selected = heroes[unitName];
  return (
    <div className="unit-select-container">
      <label htmlFor="unit-search">Znajdź postać</label>
      <input id="unit-search" type="search" placeholder="Szukaj po nazwie…" value={query} onChange={(event) => setQuery(event.target.value)} />
      <label htmlFor="unit-selection">Postać</label>
      <select id="unit-selection" onChange={handleOnChange} value={unitName}>
        <option value="" disabled>Wybierz postać</option>
        {groups.filter((group) => group.units.length).map(({ label, units }) => (
          <optgroup label={label} key={label}>
            {units.map(([name, unit]) => <option key={name} value={name} disabled={isUnavailable(name)}>{`${name} (${unit.cost} zk)`}</option>)}
          </optgroup>
        ))}
      </select>
      {!groups.some((group) => group.units.length) && <small role="status">Brak postaci o takiej nazwie.</small>}
      {selected && <div className="recruit-profile"><div><strong>{unitName}</strong><span>{selected.type}</span></div><strong>{selected.cost} <small>zk</small></strong></div>}
      <button className="button recruit-button" onClick={handleClick} disabled={!selected || isUnavailable(unitName)}>Dodaj</button>
    </div>
  );
};
export default UnitSelect;
