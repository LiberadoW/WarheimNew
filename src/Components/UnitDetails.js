import NumberInput from "../campaign/NumberInput";
import React, { useState } from "react";
import WeaponList from "../layouts/WeaponList";
import { magic } from "../Data.js/Magic";
import { getMagicLore } from "../Functions/getMagicLore";
import { getModifiers } from "../Functions/getModifiers";
import { unitRuleText } from "../Functions/getRuleText";
import mutations from "../campaign/mutations.json";
import RulesModal from "./RulesModal";
import "../styles/UnitDetails.css";

const STAT_HEADERS = ["Sz", "WW", "US", "S", "Wt", "Żw", "I", "A", "CP"];
const STAT_ROW_ORDER = ["Początkowa", "Aktualna", "Maksymalna"];
const SKILL_NAMES = [
  "Walki",
  "Strzeleckie",
  "Akademickie",
  "Siłowe",
  "Szybkościowe",
  "Specjalne",
];
const TYPE_LABELS = {
  Bohater: "Bohater",
  Stronnik: "Stronnik",
  Machina: "Machina",
  "Najemne Ostrze": "Najemne Ostrze",
};

const sortStatRows = (stats) =>
  Object.entries(stats || {}).sort(([a], [b]) => {
    const indexA = STAT_ROW_ORDER.indexOf(a);
    const indexB = STAT_ROW_ORDER.indexOf(b);
    return (
      (indexA === -1 ? STAT_ROW_ORDER.length : indexA) -
      (indexB === -1 ? STAT_ROW_ORDER.length : indexB)
    );
  });

const StatsSection = ({ unit }) => {
  const [armour] = getModifiers(
    unit.startingEquipment.concat(unit.optionalEquipment),
    unit,
  );
  const rows = sortStatRows(unit.stats);

  return (
    <section className="unit-details-section">
      <h3 className="unit-details-heading">Statystyki</h3>
      <div className="unit-stats-scroll">
        <table className="unit-stats">
          <thead>
            <tr>
              <th scope="col" className="unit-stats-label">
                Profil
              </th>
              {STAT_HEADERS.map((header) => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
              <th scope="col" className="unit-stats-armour">
                OP
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([rowName, values], rowIndex) => (
              <tr key={rowName}>
                <th scope="row" className="unit-stats-label">
                  {rowName}
                </th>
                {values.map((value, index) => (
                  <td key={STAT_HEADERS[index] || index}>{value}</td>
                ))}
                <td className="unit-stats-armour">
                  {rowIndex === 0 && armour < 7 ? `${armour}+` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const getRuleSections = (unit, magicLore, spells) => [
  {
    title: "Zasady specjalne",
    entries: unit.rules.map((rule) => ({ name: rule, text: unitRuleText(unit, rule, mutations) })),
  },
  {
    title: magicLore || "Zaklęcia",
    entries: spells.map(([title, type, text]) => ({
      name: title,
      text,
      source: type,
    })),
  },
];

const AbilitiesSection = ({ unit }) => {
  const [modalFocus, setModalFocus] = useState(null);
  const skills = (unit.skills || [])
    .map((skill) => SKILL_NAMES[skill])
    .filter(Boolean);
  const magicLore = getMagicLore([unit]);
  const spells = magicLore && magic[magicLore] ? Object.values(magic[magicLore]) : [];

  if (unit.rules.length === 0 && skills.length === 0 && spells.length === 0) {
    return null;
  }

  const openRules = (name = "") => setModalFocus(name);

  return (
    <section className="unit-details-section">
      <div className="unit-details-heading-row">
        <h3 className="unit-details-heading">Umiejętności i zasady</h3>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => openRules()}
        >
          <i className="fa-solid fa-book-open" aria-hidden="true"></i>
          Opisy zasad
        </button>
      </div>

      {skills.length > 0 && (
        <div className="unit-details-group">
          <h4 className="unit-details-subheading">Dostępne umiejętności</h4>
          <div className="unit-chips">
            {skills.map((skill) => (
              <span className="unit-chip" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {unit.rules.length > 0 && (
        <div className="unit-details-group">
          <h4 className="unit-details-subheading">Zasady specjalne</h4>
          <div className="unit-chips">
            {unit.rules.map((rule) => (
              <button
                type="button"
                className="unit-chip unit-chip-link"
                key={rule}
                onClick={() => openRules(rule)}
                title="Pokaż opis zasady"
              >
                {rule}
              </button>
            ))}
          </div>
        </div>
      )}

      {spells.length > 0 && (
        <div className="unit-details-group">
          <h4 className="unit-details-subheading">{magicLore}</h4>
          <div className="unit-chips">
            {spells.map(([title]) => (
              <button
                type="button"
                className="unit-chip unit-chip-link"
                key={title}
                onClick={() => openRules(title)}
                title="Pokaż opis zaklęcia"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}

      {modalFocus !== null && (
        <RulesModal
          title={`Zasady: ${unit.unitDisplayName || unit.unitName}`}
          sections={getRuleSections(unit, magicLore, spells)}
          focusName={modalFocus}
          onClose={() => setModalFocus(null)}
        />
      )}
    </section>
  );
};

const UnitDetails = ({
  heroes,
  unit,
  unitIndex,
  unitList,
  setUnitList,
  handleSetUnitExp,
  army,
}) => {
  const handleNameChange = (e) => {
    unitList[unitIndex].unitDisplayName = e.target.value;
    setUnitList([...unitList]);
  };

  const handleExpChange = (e) => {
    const exp = Math.max(0, Number(e.target.value) || 0);
    handleSetUnitExp(unit.uniqueId, exp);
  };

  return (
    <div className="unit-details">
      <div className="unit-details-fields">
        <label className="unit-details-field">
          <span>Imię</span>
          <input
            type="text"
            value={
              unit.unitDisplayName !== unit.unitName ? unit.unitDisplayName : ""
            }
            placeholder="Nadaj imię…"
            onChange={handleNameChange}
          />
        </label>
        {unit.type === "Bohater" && typeof handleSetUnitExp === "function" && (
          <label className="unit-details-field unit-details-field-short">
            <span>Doświadczenie</span>
            <NumberInput
              type="number"
              min="0"
              max="90"
              value={unit.exp || 0}
              onChange={handleExpChange}
            />
          </label>
        )}
      </div>

      <StatsSection unit={unit} />
      <AbilitiesSection unit={unit} />

      <section className="unit-details-section">
        <h3 className="unit-details-heading">Ekwipunek</h3>
        <WeaponList
          heroes={heroes}
          unitList={unitList}
          setUnitList={setUnitList}
          id={unitIndex}
          army={army}
        />
      </section>
    </div>
  );
};

// Name, type and cost of the selected unit, shown in the panel's sticky bar.
export const UnitDetailsHeader = ({ unit }) => {
  const isGroup = unit.type === "Stronnik" || unit.type === "Machina";
  const hasCustomName =
    unit.unitDisplayName && unit.unitDisplayName !== unit.unitName;

  return (
    <div className="unit-details-header">
      <div className="unit-details-title">
        <span className="unit-details-type">
          {TYPE_LABELS[unit.type] || unit.type}
        </span>
        <h2>{hasCustomName ? unit.unitDisplayName : unit.unitName}</h2>
        {hasCustomName && (
          <span className="unit-details-subtitle">{unit.unitName}</span>
        )}
      </div>
      <div className="unit-details-cost">
        <span className="unit-details-cost-value">{unit.totalCost}</span>
        <span className="unit-details-cost-unit">zk</span>
        {isGroup && Number(unit.selectedNumber) > 1 && (
          <span className="unit-details-cost-note">
            {`${unit.selectedNumber} × ${unit.cost} zk`}
          </span>
        )}
      </div>
    </div>
  );
};

export default UnitDetails;
