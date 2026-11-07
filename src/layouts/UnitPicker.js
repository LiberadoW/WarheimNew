import React, { useState } from "react";
import "../styles/UnitPicker.css";
import { createUnit } from "../Functions/createUnit";
import { getUnitAvailability } from "../Functions/getUnitAvailability";

const GROUPS = [
  { type: "Bohater", label: "Bohaterowie" },
  { type: "Stronnik", label: "Stronnicy" },
  { type: "Machina", label: "Machiny" },
];

const getUnavailableReason = (unitAvailability) => {
  if (unitAvailability.blockedBy) {
    return `Wyklucza: ${unitAvailability.blockedBy}`;
  }
  if (unitAvailability.isAtLimit) {
    return "Osiągnięto limit";
  }
  return "";
};

const UnitPicker = ({ army, unitList, setUnitList, onUnitAdded }) => {
  const [search, setSearch] = useState("");
  const heroes = army?.heroes || {};
  const availability = getUnitAvailability(army, unitList);
  const query = search.trim().toLocaleLowerCase("pl");

  const handleAddClick = (unitName) => {
    if (!availability[unitName]?.isAvailable) {
      return;
    }

    const newUnit = createUnit(heroes, unitName);
    setUnitList((oldUnitList) => [...oldUnitList, newUnit]);
    onUnitAdded(newUnit.uniqueId);
  };

  const groups = GROUPS.map((group) => ({
    ...group,
    units: Object.entries(heroes).filter(
      ([unitName, unit]) =>
        unit.type === group.type &&
        !unit.retired &&
        unitName.toLocaleLowerCase("pl").includes(query),
    ),
  })).filter((group) => group.units.length > 0);

  if (army?.chaosMark === null)
    return (
      <div className="unit-picker">
        <p className="unit-picker-empty">
          Najpierw wybierz Mroczną Potęgę (Znak Chaosu) w nagłówku kompanii. Od
          niej zależą dostępne demony i dziedzina magii.
        </p>
      </div>
    );
  return (
    <div className="unit-picker">
      <input
        className="unit-picker-search"
        type="search"
        placeholder="Szukaj jednostki..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {groups.length === 0 && (
        <p className="unit-picker-empty">Brak jednostek.</p>
      )}

      {groups.map((group) => (
        <div className="unit-picker-group" key={group.type}>
          <h4 className="unit-picker-group-title">{group.label}</h4>
          {group.units.map(([unitName, unit]) => {
            const unitAvailability = availability[unitName];
            const isAvailable = unitAvailability?.isAvailable;

            return (
              <button
                key={unitName}
                type="button"
                className="unit-picker-item"
                disabled={!isAvailable}
                onClick={() => handleAddClick(unitName)}
                title={isAvailable ? "Dodaj do kompanii" : undefined}
              >
                <span className="unit-picker-item-name">
                  {unitName}
                  {!isAvailable && (
                    <span className="unit-picker-item-reason">
                      {getUnavailableReason(unitAvailability)}
                    </span>
                  )}
                </span>
                <span className="unit-picker-item-limit">
                  {`${unitAvailability?.count || 0}/${unit.number}`}
                </span>
                <span className="unit-picker-item-cost">{`${unit.cost} zk`}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default UnitPicker;
