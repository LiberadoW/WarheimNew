import { useState } from "react";
import "./unitEditRules.css";

const normalizeRuleText = (value) => value.trim();
const toComparable = (value) => value.toLocaleLowerCase();

const sortRules = (rules) =>
  [...new Set(rules)].sort((a, b) => a.localeCompare(b, "pl"));

const getMergedRules = (baseRules, newRules) =>
  sortRules([...(baseRules || []), ...(newRules || [])]);

const UnitEditRules = ({ unit, setUnitList, unitList }) => {
  if (!Array.isArray(unit.baseRules)) {
    unit.baseRules = [...(unit.rules || [])];
  }

  if (!Array.isArray(unit.newRules)) {
    const baseRulesComparable = new Set(
      unit.baseRules.map((baseRule) => toComparable(baseRule))
    );

    unit.newRules = (unit.rules || []).filter(
      (currentRule) => !baseRulesComparable.has(toComparable(currentRule))
    );
  }

  const [rule, setRule] = useState("");
  const mergedRules = getMergedRules(unit.baseRules, unit.newRules);
  const lowercaseRules = mergedRules.map((item) => toComparable(item));
  const baseRulesComparable = new Set(
    unit.baseRules.map((baseRule) => toComparable(baseRule))
  );

  if (JSON.stringify(unit.rules) !== JSON.stringify(mergedRules)) {
    unit.rules = mergedRules;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedRule = normalizeRuleText(rule);
    if (
      normalizedRule.length === 0 ||
      lowercaseRules.includes(toComparable(normalizedRule))
    ) {
      return;
    }

    unit.newRules.push(normalizedRule);
    unit.rules = getMergedRules(unit.baseRules, unit.newRules);
    setUnitList([...unitList]);
    setRule("");
  };

  const handleChange = (event) => {
    setRule(event.target.value);
  };

  const handleDeleteRuleClick = (ruleToDelete) => {
    const index = unit.newRules.findIndex(
      (item) => toComparable(item) === toComparable(ruleToDelete)
    );

    if (index !== -1) {
      unit.newRules.splice(index, 1);
      unit.rules = getMergedRules(unit.baseRules, unit.newRules);
      setUnitList([...unitList]);
    }
  };

  const handleRevertClick = () => {
    unit.newRules = [];
    unit.rules = [...unit.baseRules];
    setUnitList([...unitList]);
  };

  return (
    <div className="unit-edit-rules-container">
      <form onSubmit={handleSubmit} className="rules-input">
        <input value={rule} type="text" onChange={handleChange} />
        <button type="submit" className="button">
          Dodaj
        </button>
        <button
          type="button"
          className="button"
          onClick={handleRevertClick}
          disabled={unit.newRules.length === 0}
        >
          Cofnij
        </button>
      </form>
      <div className="unit-edit-rule-container">
        {mergedRules.map((item, index) => {
          const isCoreRule = baseRulesComparable.has(toComparable(item));
          return (
          <div key={index} className="unit-edit-rule">
            <span>{item}</span>
            <span
              className={`unit-edit-pill ${
                isCoreRule ? "unit-edit-pill-core" : "unit-edit-pill-added"
              }`}
            >
              {isCoreRule ? "początkowa" : "dodana"}
            </span>
            {!isCoreRule && (
              <button onClick={() => handleDeleteRuleClick(item)}>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default UnitEditRules;
