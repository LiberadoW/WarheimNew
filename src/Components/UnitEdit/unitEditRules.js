import { useState } from "react";
import "./unitEditRules.css";

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const UnitEditRules = ({ unit, setUnitList, heroes, unitList }) => {
  if (!unit.hasOwnProperty("newRules")) {
    unit.newRules = [];
  }

  const [rule, setRule] = useState("");

  const lowercaseRules = unit.rules.map((r) => r.toLowerCase());

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rule === "" || lowercaseRules.includes(rule.toLowerCase())) {
      return;
    }

    const capitalizedRule = capitalizeFirstLetter(rule);

    unit.newRules.push(capitalizedRule);

    unit.rules = unit.newRules.concat(unit.baseRules);
    unit.rules.sort();
    setUnitList([...unitList]);
    setRule("");
  };

  const handleChange = (event) => {
    setRule(event.target.value);
  };

  const handleDeleteRuleClick = (item) => {
    if (unit.rules.includes(item)) {
      unit.rules.splice(unit.rules.indexOf(item), 1);
      setUnitList([...unitList]);
    }
  };

  return (
    <div className="unit-edit-rules-container">
      <form onSubmit={handleSubmit} className="rules-input">
        <input value={rule} type="text" onChange={handleChange} />
        <button type="submit" className="button">
          Dodaj
        </button>
      </form>
      <div className="unit-edit-rule-container">
        {unit.rules.map((item, index) => (
          <div key={index} className="unit-edit-rule">
            {item}
            <button onClick={() => handleDeleteRuleClick(item)}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitEditRules;
