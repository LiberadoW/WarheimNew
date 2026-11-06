import React from "react";
import { magic } from "../Data.js/Magic";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import { getMagicLore } from "../Functions/getMagicLore";
import {
  getArmyRulesSummary,
  getRuleText,
} from "../Functions/getRuleText";

const getUnitLabel = (unit) => unit.unitDisplayName || unit.unitName;

const ArmyRulesAppendix = ({ unitList }) => {
  if (unitList.length === 0) {
    return null;
  }

  const { unitRules, equipmentRules, equipment } =
    getArmyRulesSummary(unitList);
  const magicLore = getMagicLore(unitList);
  const spells =
    magicLore && magic[magicLore] ? Object.values(magic[magicLore]) : [];

  return (
    <div className="print-rules">
      <h2 className="print-rules-title">Zasady</h2>

      {unitRules.length > 0 && (
        <section className="print-rules-section">
          <h3>Zasady specjalne postaci</h3>
          {unitRules.map((rule) => (
            <div className="print-rule" key={rule}>
              <p className="print-rule-name">
                {rule}
                <span className="print-rule-source">
                  {unitList
                    .filter((unit) => unit.rules.includes(rule))
                    .map(getUnitLabel)
                    .filter((label, index, labels) => labels.indexOf(label) === index)
                    .join(", ")}
                </span>
              </p>
              <p className="print-rule-text">
                {getRuleText(rule) || "Brak opisu zasady."}
              </p>
            </div>
          ))}
        </section>
      )}

      {equipment.length > 0 && (
        <section className="print-rules-section">
          <h3>Ekwipunek</h3>
          <table className="print-equipment-table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Zasięg</th>
                <th>Siła</th>
                <th>Ochrona</th>
                <th>Zasady</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((name) => {
                const stats = getEquipmentStats(name);
                return (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{stats.range || "-"}</td>
                    <td>{stats.strength || "-"}</td>
                    <td>{stats.armour || "-"}</td>
                    <td>{stats.rules || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {equipmentRules.length > 0 && (
        <section className="print-rules-section">
          <h3>Zasady oręża i pancerza</h3>
          {equipmentRules.map(({ rule, items }) => (
            <div className="print-rule" key={rule}>
              <p className="print-rule-name">
                {rule}
                <span className="print-rule-source">{items.join(", ")}</span>
              </p>
              <p className="print-rule-text">{getRuleText(rule)}</p>
            </div>
          ))}
        </section>
      )}

      {spells.length > 0 && (
        <section className="print-rules-section">
          <h3>{magicLore}</h3>
          {spells.map(([title, type, text]) => (
            <div className="print-rule" key={title}>
              <p className="print-rule-name">
                {title}
                <span className="print-rule-source">{type}</span>
              </p>
              <p className="print-rule-text">{text}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ArmyRulesAppendix;
