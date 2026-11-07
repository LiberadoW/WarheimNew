import React, { useState } from "react";
import DiceInput from "../campaign/DiceInput";
import { applyMutation, mutationResult } from "../campaign/sanity";
import * as R from "../campaign/rules";
import { CHAOS_MARKS } from "../Functions/chaosMark";

// STYGMAT CHAOSU (s. 52): every model with the rule rolls a stigma from the
// table of its company's Znak Chaosu when it is recruited, i.e. before the
// first game. Results live on the unit, so they are saved with the roster.

const GOD_BY_MARK = {
  niewolnicy: "Niepodzielony",
  khorne: "Khorne",
  nurgle: "Nurgle",
  slaanesh: "Slaanesh",
  tzeentch: "Tzeentch",
};
export const companyGod = (army, chaosMarkKey) => {
  if (chaosMarkKey) return GOD_BY_MARK[chaosMarkKey];
  const rule = (army?.armyRules || []).find((r) => /^Znak Chaosu \(/.test(r));
  const mark = CHAOS_MARKS.find((m) => rule?.includes(m.name));
  return mark ? GOD_BY_MARK[mark.key] : null;
};
const SOURCE = "Stygmat Chaosu (rekrutacja)";
export const pendingStigmata = (unit) => {
  const owed = (unit.rules || []).filter((r) => r.trim() === "Stygmat Chaosu").length;
  const rolled = (unit.mutations || []).filter((m) => m.reason === SOURCE).length;
  return Math.max(0, owed - rolled);
};

function StigmaRow({ unit, god, unitList, setUnitList }) {
  const [dice, setDice] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [mental, setMental] = useState([]);
  const [error, setError] = useState("");
  const entry = mutationResult(god, dice);
  const repeat =
    entry &&
    (unit.mutations || []).some((m) => R.normal(m.name) === R.normal(entry.name));
  const ready =
    entry &&
    !repeat &&
    (entry.name !== "Atrofia" || R.validDice(secondary, 1)) &&
    (entry.name !== "Szaleństwo" || R.validDice(mental, 2));
  const apply = () => {
    try {
      const units = R.clone(unitList);
      const draft = { units, journal: [], injuries: {}, inventory: [], battleId: "rekrutacja" };
      applyMutation(draft, unit.uniqueId, god, dice, {
        secondary,
        mentalDice: mental,
        reason: SOURCE,
      });
      setUnitList(draft.units);
      setDice([]);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <article className="stigma-row">
      <div className="stigma-row-head">
        <strong>{R.label(unit)}</strong>
        <small>
          {R.modelCount(unit) > 1 ? `grupa ${R.modelCount(unit)} modeli · ` : ""}
          {(unit.mutations || []).map((m) => m.name).join(", ") || "bez stygmatów"}
        </small>
      </div>
      <DiceInput label={`Stygmat (${god})`} count={2} value={dice} onChange={setDice} />
      {entry && (
        <div className="stigma-result">
          <strong>
            {R.k66(dice)} · {entry.name}
          </strong>
          <p>{entry.text}</p>
          {repeat && (
            <p className="stigma-error">Model ma już ten stygmat – rzuć ponownie.</p>
          )}
          {entry.name === "Atrofia" && (
            <DiceInput label="Efekt atrofii" value={secondary} onChange={setSecondary} />
          )}
          {entry.name === "Szaleństwo" && (
            <DiceInput label="Choroba psychiczna" count={2} value={mental} onChange={setMental} />
          )}
          {repeat ? (
            <button type="button" className="button button-secondary" onClick={() => setDice([])}>
              Rzuć ponownie
            </button>
          ) : (
            <button type="button" className="button" disabled={!ready} onClick={apply}>
              Zapisz stygmat: {entry.name}
            </button>
          )}
        </div>
      )}
      {error && <p className="stigma-error">{error}</p>}
    </article>
  );
}

export default function StigmataPanel({ army, campaignNotes, unitList, setUnitList }) {
  const god = companyGod(army, campaignNotes?.chaosMark);
  const pending = unitList.filter((u) => pendingStigmata(u) > 0);
  if (!pending.length) return null;
  return (
    <section className="stigmata-panel" aria-label="Stygmaty Chaosu przed pierwszą grą">
      <h3>Stygmaty Chaosu przed pierwszą grą</h3>
      <p>
        Modele z zasadą STYGMAT CHAOSU losują stygmat z tabeli swojego Znaku
        Chaosu. Wynik zapisuje się w karcie postaci i trafia na serwer przy
        zapisie armii.
      </p>
      {!god ? (
        <p className="stigma-error">Najpierw wybierz Mroczną Potęgę (Znak Chaosu).</p>
      ) : (
        pending.map((u) => (
          <StigmaRow
            key={u.uniqueId}
            unit={u}
            god={god}
            unitList={unitList}
            setUnitList={setUnitList}
          />
        ))
      )}
    </section>
  );
}
