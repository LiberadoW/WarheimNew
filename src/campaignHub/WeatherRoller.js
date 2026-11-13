import React, { useState } from "react";
import weather from "./data/weather.json";
import "../styles/CampaignHub.css";

// TABELA POGODA (rozdział 11, s. 337): 3K6, results 3–18.
export const weatherFor = (total) => {
  const t = Math.max(3, Math.min(18, total));
  return weather.table.find((w) => t >= w.min && t <= w.max) || null;
};
const range = (w) => (w.min === w.max ? `${w.min}` : `${w.min}–${w.max}`);
const valid = (d) => Number.isInteger(d) && d >= 1 && d <= 6;

export const WeatherText = ({ entry }) =>
  entry ? (
    <div className="game-event">
      <h4>
        ({range(entry)}) {entry.name}
      </h4>
      <p>
        <em>{entry.lead}</em>
      </p>
      {entry.text && entry.text.split("\n").map((p) => <p key={p}>{p}</p>)}
    </div>
  ) : null;

// Weather before the skirmish: rolled in the app, typed, or picked from the
// table, with modifiers from company rules (Meteorolog, Władcy pogody).
// `value` is the saved weather; onSave receives { total, name, dice, modifier }.
export default function WeatherRoller({ value, canEdit = true, onSave, hints = [], startEditing = false, title = "Pogoda" }) {
  const [editing, setEditing] = useState(!value || startEditing);
  const [dice, setDice] = useState([null, null, null]);
  const [modifier, setModifier] = useState(0);
  const [picked, setPicked] = useState("");
  const rolled = dice.every(valid);
  const total = picked ? Number(picked) : rolled ? dice.reduce((a, b) => a + b, 0) + (Number(modifier) || 0) : null;
  const entry = total == null ? null : weatherFor(total);
  const saved = value ? weather.table.find((w) => w.name === value.name) : null;
  const setDie = (i, v) => {
    setPicked("");
    setDice(dice.map((d, j) => (j === i ? (v === "" ? null : Number(v)) : d)));
  };

  return (
    <section className="hub-card" aria-label={title}>
      <div className="hub-card-head">
        <h3>{title}{saved ? `: ${saved.name}` : ""}</h3>
        {saved && canEdit && !editing && (
          <button type="button" className="button button-secondary button-small" onClick={() => setEditing(true)}>
            Zmień
          </button>
        )}
      </div>
      {saved && !editing ? (
        <>
          <p className="hub-muted">
            Wynik {value.total}
            {value.dice?.length ? ` (3K6: ${value.dice.join("+")}${value.modifier ? `, modyfikator ${value.modifier > 0 ? "+" : ""}${value.modifier}` : ""})` : ""}
          </p>
          <WeatherText entry={saved} />
        </>
      ) : !canEdit ? (
        <p className="hub-muted">Pogoda nie została jeszcze ustalona.</p>
      ) : (
        <>
          <p className="hub-muted">
            {startEditing
              ? "Rzut 3K6 na nową pogodę (s. 337)."
              : "Rzut 3K6 przed potyczką (s. 337). Pogoda nie zmienia się do końca gry, chyba że scenariusz albo zdarzenie mówi inaczej."}
          </p>
          <label className="hub-field">
            Wynik z tabeli
            <select
              value={picked}
              onChange={(e) => {
                setPicked(e.target.value);
                setDice([null, null, null]);
              }}
            >
              <option value="">Wybierz, co wypadło (albo wpisz 3K6 niżej)</option>
              {weather.table.map((w) => (
                <option key={w.min} value={w.min}>
                  {range(w)} · {w.name}
                </option>
              ))}
            </select>
          </label>
          <div className="hub-dice-row">
            {[0, 1, 2].map((i) => (
              <label key={i} className="hub-field hub-die">
                K6 {i + 1}
                <input type="number" min="1" max="6" inputMode="numeric" value={dice[i] ?? ""} onChange={(e) => setDie(i, e.target.value)} />
              </label>
            ))}
            <label className="hub-field hub-die">
              Modyfikator
              <input type="number" inputMode="numeric" value={modifier} onChange={(e) => setModifier(e.target.value === "" ? "" : Number(e.target.value))} />
            </label>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setPicked("");
                setDice([0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6)));
              }}
            >
              <i className="fa-solid fa-dice" aria-hidden="true"></i> Rzuć 3K6
            </button>
          </div>
          {hints.length > 0 && <p className="hub-muted">Modyfikatory z zasad: {hints.join("; ")}.</p>}
          {entry && (
            <>
              {!picked && <p className="hub-muted">Wynik: {total}{(Number(modifier) || 0) !== 0 ? ` (z modyfikatorem ${modifier > 0 ? "+" : ""}${modifier})` : ""}</p>}
              <WeatherText entry={entry} />
              <div className="hub-actions">
                <button
                  type="button"
                  className="button"
                  onClick={() =>
                    Promise.resolve(
                      onSave({
                        total: Math.max(3, Math.min(18, total)),
                        name: entry.name,
                        dice: picked ? [] : dice,
                        modifier: picked ? 0 : Number(modifier) || 0,
                      }),
                    ).then((ok) => ok !== false && setEditing(false))
                  }
                >
                  Ustaw pogodę: {entry.name}
                </button>
                {saved && (
                  <button type="button" className="button button-ghost" onClick={() => setEditing(false)}>
                    Anuluj
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

// Company rules that change the weather roll, for the hint under the dice.
export const weatherHints = (units = [], specialRules = []) => {
  const has = (u, name) => (u.rules || []).some((r) => String(r).toLowerCase().startsWith(name));
  const meteo = units.filter((u) => has(u, "meteorolog")).length;
  const lords = specialRules.some((r) => String(r).toLowerCase().startsWith("władcy pogody"));
  return [
    meteo && `Meteorolog ±1${meteo > 1 ? ` (×${meteo}, kumulatywnie)` : ""}`,
    lords && "Władcy pogody ±K3",
  ].filter(Boolean);
};
