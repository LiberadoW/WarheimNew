import React from "react";
import "./unitEditStats.css";

const stats = ["Sz", "WW", "US", "S", "Wt", "Żw", "I", "A", "CP"];
const MIN_STAT_VALUE = 1;

const isNumberStat = (value) =>
  typeof value === "number" && Number.isFinite(value);

const getCurrentStats = (baseStats, statsModifiers, maxStats) => {
  return baseStats.map((baseStat, index) => {
    if (!isNumberStat(baseStat)) {
      return baseStat;
    }

    const modifier = statsModifiers[index] || 0;
    const maxStat = maxStats[index];
    const maxValue = isNumberStat(maxStat) ? maxStat : Number.POSITIVE_INFINITY;
    const statValue = baseStat + modifier;

    return Math.min(maxValue, Math.max(MIN_STAT_VALUE, statValue));
  });
};

const hasStatChanges = (baseStats, currentStats) =>
  currentStats.some((stat, index) => stat !== baseStats[index]);

const UnitEditStats = ({ unitList, unit, setUnitList }) => {
  const baseStats = unit.stats.Początkowa || [];
  const maxStats = unit.stats.Maksymalna || [];

  if (!unit.statsModifiers) {
    unit.statsModifiers = new Array(baseStats.length).fill(0);
  }

  const statsModifiers = unit.statsModifiers;
  const currentStats = getCurrentStats(baseStats, statsModifiers, maxStats);

  if (hasStatChanges(baseStats, currentStats)) {
    unit.stats.Aktualna = [...currentStats];
  } else if (Object.prototype.hasOwnProperty.call(unit.stats, "Aktualna")) {
    delete unit.stats.Aktualna;
  }

  const getBounds = (index) => {
    const baseStat = baseStats[index];
    const maxStat = maxStats[index];

    if (!isNumberStat(baseStat) || !isNumberStat(maxStat)) {
      return null;
    }

    return {
      minModifier: MIN_STAT_VALUE - baseStat,
      maxModifier: maxStat - baseStat,
    };
  };

  const canIncrease = (index) => {
    const bounds = getBounds(index);
    if (!bounds) {
      return false;
    }
    return (statsModifiers[index] || 0) < bounds.maxModifier;
  };

  const canDecrease = (index) => {
    const bounds = getBounds(index);
    if (!bounds) {
      return false;
    }
    return (statsModifiers[index] || 0) > bounds.minModifier;
  };

  const updateStatModifier = (index, delta) => {
    const bounds = getBounds(index);
    if (!bounds) {
      return;
    }

    const nextModifier = (statsModifiers[index] || 0) + delta;

    if (
      nextModifier > bounds.maxModifier ||
      nextModifier < bounds.minModifier
    ) {
      return;
    }

    statsModifiers[index] = nextModifier;

    const nextCurrentStats = getCurrentStats(baseStats, statsModifiers, maxStats);

    if (hasStatChanges(baseStats, nextCurrentStats)) {
      unit.stats.Aktualna = [...nextCurrentStats];
    } else if (Object.prototype.hasOwnProperty.call(unit.stats, "Aktualna")) {
      delete unit.stats.Aktualna;
    }

    setUnitList([...unitList]);
  };

  return (
    <ul className="unit-edit-stats-container">
      {stats.map((item, index) => (
        <li key={index} className="unit-edit-stats">
          <div className="unit-edit-stats-label">{item}</div>
          <button
            className="plus-button"
            onClick={() => updateStatModifier(index, 1)}
            disabled={!canIncrease(index)}
          >
            +
          </button>
          <div
            className={`unit-edit-stats-value ${
              isNumberStat(currentStats[index]) &&
              isNumberStat(baseStats[index]) &&
              currentStats[index] > baseStats[index]
                ? "green"
                : isNumberStat(currentStats[index]) &&
                  isNumberStat(baseStats[index]) &&
                  currentStats[index] < baseStats[index]
                ? "red"
                : ""
            }`}
          >
            {currentStats[index]}
          </div>
          <button
            className="minus-button"
            onClick={() => updateStatModifier(index, -1)}
            disabled={!canDecrease(index)}
          >
            -
          </button>
        </li>
      ))}
    </ul>
  );
};

export default UnitEditStats;
