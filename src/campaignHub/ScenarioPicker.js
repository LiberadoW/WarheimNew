import React, { useState } from "react";
import {
  AREAS,
  allScenarios,
  areaFromDie,
  customScenarioRecord,
  findScenario,
  resolveScenarioRoll,
  rollScenarioDice,
  scenarioKey,
  scenarioRecord,
  SCENARIO_ROLL_RULE,
} from "./scenarios";

const areaLabel = (s) => (s.special ? "Scenariusz specjalny" : AREAS[s.area]);

// Full scenario text, section by section.
export const ScenarioDetails = ({ scenario }) => {
  const full = scenario?.key ? findScenario(scenario.key) : null;
  if (!full)
    return scenario ? (
      <p className="hub-muted">
        {scenario.name}
        {scenario.area && ` · ${AREAS[scenario.area]}`} · scenariusz własny
      </p>
    ) : null;
  return (
    <div className="scenario-details">
      <p className="hub-muted">
        {areaLabel(full)}
        {!full.special && ` · K66: ${full.code}`} · s. {full.page}
      </p>
      {full.sections.map((section) => (
        <details key={section.title} open={section.title === "Cel potyczki"}>
          <summary>{section.title}</summary>
          <p>{section.text}</p>
        </details>
      ))}
    </div>
  );
};

const DieField = ({ label, value, onChange }) => (
  <label className="hub-field hub-die">
    {label}
    <input
      type="number"
      min="1"
      max="6"
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
    />
  </label>
);

const RollSteps = ({ roll }) => {
  if (!roll) return null;
  return (
    <ol className="scenario-steps">
      <li>
        K6 = {roll.dice.areaDie} → {AREAS[areaFromDie(roll.dice.areaDie)]}
      </li>
      {roll.result.steps.map((step, i) => (
        <li key={i}>
          K66 = {step.code} →{" "}
          {step.type === "scenario"
            ? step.scenario.name
            : step.type === "reroll"
              ? `rzut w tabeli „${AREAS[step.area]}”`
              : step.type === "choose"
                ? "gracz z niższym prestiżem wybiera scenariusz"
                : "brak wyniku w tabeli"}
        </li>
      ))}
    </ol>
  );
};

const MODES = [
  ["roll", "Losuj w aplikacji"],
  ["dice", "Wpisz swoje rzuty"],
  ["list", "Wybierz z listy"],
  ["custom", "Własny"],
];

// Choosing a game's scenario. Calls onPick(record) with what to store.
const ScenarioPicker = ({ onPick, onCancel }) => {
  const [mode, setMode] = useState("roll");
  const [roll, setRoll] = useState(null);
  const [dice, setDice] = useState({ areaDie: null, first: [null, null], second: [null, null] });
  const [listKey, setListKey] = useState("");
  const [custom, setCustom] = useState({ name: "", area: "" });

  const typed = resolveScenarioRoll(dice);
  const chosen =
    mode === "roll"
      ? roll?.result.type === "scenario" && roll.result.scenario
      : mode === "dice"
        ? typed?.type === "scenario" && !typed.needsSecond && typed.scenario
        : mode === "list"
          ? findScenario(listKey)
          : null;
  // Rolls of 11/66 hand the choice to the player: offer the list for that area.
  const chooseArea =
    (mode === "roll" && roll?.result.type === "choose" && roll.result.area) ||
    (mode === "dice" && typed?.type === "choose" && typed.area);

  const confirm = () => {
    if (mode === "custom") onPick(customScenarioRecord(custom.name, custom.area));
    else if (chosen) onPick(scenarioRecord(chosen, mode === "list" ? "list" : mode === "roll" ? "app-roll" : "player-roll"));
  };

  return (
    <div className="scenario-picker">
      <div className="hub-segmented" role="tablist" aria-label="Sposób wyboru scenariusza">
        {MODES.map(([key, label]) => (
          <button
            type="button"
            role="tab"
            key={key}
            aria-selected={mode === key}
            className={mode === key ? "is-active" : ""}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {(mode === "roll" || mode === "dice") && <p className="hub-muted">{SCENARIO_ROLL_RULE}</p>}

      {mode === "roll" && (
        <>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              const rolled = rollScenarioDice();
              setRoll({ dice: rolled, result: resolveScenarioRoll(rolled) });
            }}
          >
            <i className="fa-solid fa-dice" aria-hidden="true"></i> {roll ? "Rzuć ponownie" : "Rzuć"}
          </button>
          <RollSteps roll={roll} />
        </>
      )}

      {mode === "dice" && (
        <>
          <div className="hub-dice-row">
            <DieField label="K6 obszar" value={dice.areaDie} onChange={(v) => setDice({ ...dice, areaDie: v })} />
            <DieField label="K66 dziesiątki" value={dice.first[0]} onChange={(v) => setDice({ ...dice, first: [v, dice.first[1]] })} />
            <DieField label="K66 jedności" value={dice.first[1]} onChange={(v) => setDice({ ...dice, first: [dice.first[0], v] })} />
          </div>
          {typed?.needsSecond && (
            <div className="hub-dice-row">
              <span className="hub-muted">Rzut w tabeli „{AREAS[typed.area]}”:</span>
              <DieField label="K66 dziesiątki" value={dice.second[0]} onChange={(v) => setDice({ ...dice, second: [v, dice.second[1]] })} />
              <DieField label="K66 jedności" value={dice.second[1]} onChange={(v) => setDice({ ...dice, second: [dice.second[0], v] })} />
            </div>
          )}
          {typed && <RollSteps roll={{ dice, result: typed }} />}
        </>
      )}

      {(mode === "list" || chooseArea) && (
        <label className="hub-field">
          Scenariusz
          <select
            value={listKey}
            onChange={(e) => {
              setListKey(e.target.value);
              if (mode !== "list") setMode("list");
            }}
          >
            <option value="">Wybierz scenariusz</option>
            {["inside", "outside", "special"].map((group) => (
              <optgroup key={group} label={group === "special" ? "Scenariusze specjalne" : AREAS[group]}>
                {allScenarios
                  .filter((s) => (group === "special" ? s.special : !s.special && s.area === group))
                  .filter((s) => !chooseArea || mode === "list" || s.area === chooseArea)
                  .map((s) => (
                    <option key={scenarioKey(s)} value={scenarioKey(s)}>
                      {s.special ? s.name : `${s.code} · ${s.name}`}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
      )}

      {mode === "custom" && (
        <div className="hub-dice-row">
          <label className="hub-field">
            Nazwa scenariusza
            <input
              type="text"
              value={custom.name}
              maxLength={80}
              onChange={(e) => setCustom({ ...custom, name: e.target.value })}
            />
          </label>
          <label className="hub-field">
            Obszar
            <select value={custom.area} onChange={(e) => setCustom({ ...custom, area: e.target.value })}>
              <option value="">Nie dotyczy</option>
              <option value="inside">{AREAS.inside}</option>
              <option value="outside">{AREAS.outside}</option>
            </select>
          </label>
        </div>
      )}

      {chosen && (
        <div className="scenario-preview">
          <h4>{chosen.name}</h4>
          <ScenarioDetails scenario={scenarioRecord(chosen)} />
        </div>
      )}

      <div className="hub-actions">
        <button
          type="button"
          className="button"
          disabled={mode === "custom" ? !custom.name.trim() : !chosen}
          onClick={confirm}
        >
          Ustaw scenariusz
        </button>
        <button type="button" className="button button-ghost" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default ScenarioPicker;
