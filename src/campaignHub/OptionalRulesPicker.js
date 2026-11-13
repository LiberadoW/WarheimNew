import React, { useState } from "react";
import RulesModal from "../Components/RulesModal";
import {
  OPTIONAL_RULE_APP,
  OPTIONAL_RULE_LOOT,
  OPTIONAL_RULE_PD,
  PD_WHO,
  findOptionalRule,
  optionalRules,
} from "./scenarios";

export const pdBadge = (key) => {
  const bonus = OPTIONAL_RULE_PD[key];
  const loot = OPTIONAL_RULE_LOOT[key];
  if (bonus) return `+${bonus.pd} PD: ${PD_WHO[bonus.who]}${bonus.minRounds ? ` (${bonus.minRounds}+ rund)` : ""}`;
  return loot ? `+${loot} łup` : null;
};

// Chips for the rules in use, e.g. on a game card; a tap opens the rule.
export const OptionalRuleChips = ({ keys }) => {
  const [open, setOpen] = useState(null);
  if (!keys?.length) return <p className="hub-muted">Bez zasad opcjonalnych.</p>;
  const rule = open && findOptionalRule(open);
  return (
    <>
      <div className="hub-chips">
        {keys.map((key) => (
          <button key={key} type="button" className="hub-chip hub-chip-button" onClick={() => setOpen(key)}>
            {findOptionalRule(key)?.name || key}
            {pdBadge(key) && <span className="hub-chip-pd">{pdBadge(key)}</span>}
          </button>
        ))}
      </div>
      {open && (
        <RulesModal
          title={rule?.name || open}
          onClose={() => setOpen(null)}
          sections={[
            {
              title: rule?.page ? `Zasada opcjonalna · s. ${rule.page}` : "Zasada opcjonalna",
              entries: [
                { name: "W aplikacji", text: OPTIONAL_RULE_APP[open] || "Stosujecie ją przy stole; aplikacja niczego tu nie liczy." },
                ...(rule ? [{ name: rule.name, text: rule.text }] : []),
              ],
            },
          ]}
        />
      )}
    </>
  );
};

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
