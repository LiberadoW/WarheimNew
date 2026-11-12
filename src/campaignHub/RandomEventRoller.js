import React, { useState } from "react";
import { AREAS, k66 } from "./scenarios";
import { randomEventFor } from "./gamePlay";
import randomEvents from "./data/randomEvents.json";
import "../styles/CampaignHub.css";

// Zdarzenia losowe: the table follows the scenario's area; the player rolls
// the K66 (typed or in the app) and gets the event's text. onSave records it
// (the shared game log or the play-mode battle log) and resolves to true.
export default function RandomEventRoller({ fixedArea = "", canSave = true, onSave }) {
  const [area, setArea] = useState(fixedArea);
  const [dice, setDice] = useState([null, null]);
  // The rolled result can also be picked straight from the table.
  const [picked, setPicked] = useState("");
  const valid = dice.every((d) => Number.isInteger(d) && d >= 1 && d <= 6);
  const table = area ? randomEvents[area] || [] : [];
  const event = picked
    ? table.find((e) => String(e.code) === picked) || null
    : valid && area
      ? randomEventFor(area, k66(dice))
      : null;
  const code = picked ? Number(picked) : valid ? k66(dice) : null;
  const reset = () => {
    setDice([null, null]);
    setPicked("");
  };
  const setDie = (i, value) => {
    setPicked("");
    setDice(dice.map((d, j) => (j === i ? (value === "" ? null : Number(value)) : d)));
  };

  return (
    <section className="hub-card">
      <h3>Zdarzenia losowe</h3>
      {!fixedArea && (
        <label className="hub-field">
          Tabela
          <select
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setPicked("");
            }}
          >
            <option value="">Wybierz obszar</option>
            <option value="inside">{AREAS.inside}</option>
            <option value="outside">{AREAS.outside}</option>
          </select>
        </label>
      )}
      {area && <p className="hub-muted">Tabela: {AREAS[area]} (s. 399–404). Rzut K6 na wystąpienie zdarzenia wykonujesz sam.</p>}
      {area && (
        <label className="hub-field">
          Wynik z tabeli
          <select
            value={picked}
            onChange={(e) => {
              setPicked(e.target.value);
              setDice([null, null]);
            }}
          >
            <option value="">Wybierz, co wypadło (albo wpisz K66 niżej)</option>
            {table.map((e) => (
              <option key={e.code} value={e.code}>
                {e.code}
                {e.max !== e.code ? `–${e.max}` : ""} · {e.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="hub-dice-row">
        <label className="hub-field hub-die">
          K66 dziesiątki
          <input type="number" min="1" max="6" inputMode="numeric" value={dice[0] ?? ""} onChange={(e) => setDie(0, e.target.value)} />
        </label>
        <label className="hub-field hub-die">
          K66 jedności
          <input type="number" min="1" max="6" inputMode="numeric" value={dice[1] ?? ""} onChange={(e) => setDie(1, e.target.value)} />
        </label>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setPicked("");
            setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
          }}
        >
          <i className="fa-solid fa-dice" aria-hidden="true"></i> Rzuć
        </button>
      </div>
      {event && (
        <div className="game-event">
          <h4>
            ({event.code}
            {event.max !== event.code ? `–${event.max}` : ""}) {event.name}
          </h4>
          <p>{event.text}</p>
          {canSave && (
            <button
              type="button"
              className="button button-small"
              onClick={() =>
                Promise.resolve(onSave({ area, code, name: event.name, text: event.text })).then(
                  (ok) => ok !== false && reset(),
                )
              }
            >
              Zapisz w przebiegu
            </button>
          )}
        </div>
      )}
    </section>
  );
}
