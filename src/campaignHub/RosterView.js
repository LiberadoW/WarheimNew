import React, { useState } from "react";
import RulesModal from "../Components/RulesModal";
import { groupRoster, plural, STAT_LABELS } from "./roster";

// A read-only company: one row per unit with its stats, short equipment and
// rules. Tapping a rule shows its text.
const RosterView = ({ armyList, title }) => {
  const [rule, setRule] = useState(null);
  const groups = groupRoster(armyList);

  if (groups.length === 0) {
    return <p className="hub-muted">Rozpiska jest pusta.</p>;
  }

  return (
    <div className="roster-view" aria-label={title}>
      {groups.map((group) => (
        <section key={group.type} className="roster-group">
          <h4 className="roster-group-title">{group.title}</h4>
          {group.units.map((unit) => (
            <article key={unit.id} className="roster-unit">
              <div className="roster-unit-header">
                <span className="roster-unit-name">
                  {unit.name}
                  {unit.name !== unit.profile && (
                    <span className="roster-unit-profile">{unit.profile}</span>
                  )}
                </span>
                <span className="roster-unit-meta">
                  {unit.models > 1 && `${plural(unit.models, "model", "modele", "modeli")} · `}
                  {unit.exp} PD · {unit.cost} zk
                </span>
              </div>
              <div className="roster-stats-scroll">
                <table className="roster-stats">
                  <thead>
                    <tr>
                      {STAT_LABELS.map((label) => (
                        <th key={label} scope="col">
                          {label}
                        </th>
                      ))}
                      <th scope="col">OP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {STAT_LABELS.map((label, i) => (
                        <td key={label}>{unit.stats[i] ?? "-"}</td>
                      ))}
                      <td>{unit.armour}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {unit.equipment.length > 0 && (
                <p className="roster-unit-equipment">{unit.equipment.join(", ")}</p>
              )}
              {(unit.rules.length > 0 || unit.injuries.length > 0 || unit.spells.length > 0) && (
                <div className="roster-unit-rules">
                  {unit.rules.map((name, i) => (
                    <button
                      type="button"
                      key={`${name}-${i}`}
                      className="roster-rule"
                      onClick={() => setRule({ name, text: unit.ruleTexts[name] })}
                    >
                      {name}
                    </button>
                  ))}
                  {unit.spells.map((s) => (
                    <button
                      type="button"
                      key={s.key}
                      className="roster-rule is-spell"
                      onClick={() => setRule({ name: `${s.name}${s.cast ? ` · ${s.cast.toLowerCase()}` : ""}`, text: s.text, title: unit.lore })}
                    >
                      ✦ {s.name}
                    </button>
                  ))}
                  {unit.injuries.map((name, i) => (
                    <span key={`${name}-${i}`} className="roster-rule is-injury">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>
      ))}
      {rule && (
        <RulesModal
          title={rule.name}
          sections={[{ title: rule.title || "Zasada", entries: [{ name: rule.name, text: rule.text }] }]}
          onClose={() => setRule(null)}
        />
      )}
    </div>
  );
};

export default RosterView;
