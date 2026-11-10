import React from "react";
import { OPTIONAL_RULE_PD, PD_WHO, findOptionalRule, optionalRules } from "./scenarios";

export const pdBadge = (key) => {
  const bonus = OPTIONAL_RULE_PD[key];
  return bonus ? `+${bonus.pd} PD: ${PD_WHO[bonus.who]}` : null;
};

// Chips for the rules in use, e.g. on a game card.
export const OptionalRuleChips = ({ keys }) =>
  keys?.length ? (
    <div className="hub-chips">
      {keys.map((key) => (
        <span key={key} className="hub-chip">
          {findOptionalRule(key)?.name || key}
          {pdBadge(key) && <span className="hub-chip-pd">{pdBadge(key)}</span>}
        </span>
      ))}
    </div>
  ) : (
    <p className="hub-muted">Bez zasad opcjonalnych.</p>
  );

// Checkbox list of chapter 12 rules; each one's text and PD bonus can be read.
const OptionalRulesPicker = ({ value = [], onChange, disabled = false }) => (
  <ul className="optional-rules">
    {optionalRules.map((rule) => {
      const checked = value.includes(rule.key);
      return (
        <li key={rule.key} className={checked ? "is-on" : ""}>
          <label className="optional-rule-check">
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() =>
                onChange(checked ? value.filter((k) => k !== rule.key) : [...value, rule.key])
              }
            />
            <span className="optional-rule-name">{rule.name}</span>
            {pdBadge(rule.key) && <span className="hub-chip-pd">{pdBadge(rule.key)}</span>}
          </label>
          <details>
            <summary>Opis (s. {rule.page})</summary>
            {rule.pdText.length > 0 && <p className="optional-rule-pd">{rule.pdText.join(" ")}</p>}
            <p>{rule.text}</p>
          </details>
        </li>
      );
    })}
  </ul>
);

export default OptionalRulesPicker;
