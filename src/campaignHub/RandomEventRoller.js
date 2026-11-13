import React, { useState } from "react";
import { AREAS, k66 } from "./scenarios";
import { randomEventFor } from "./gamePlay";
import randomEvents from "./data/randomEvents.json";
import WeatherRoller from "./WeatherRoller";
import "../styles/CampaignHub.css";

// Zdarzenia losowe: the table follows the scenario's area; the player rolls
// the K66 (typed or in the app) and gets the event's text. onSave records it
// (the shared game log or the play-mode battle log) and resolves to true.
// The check before each player's turn (s. 398): K6, 1 = an event (then the
// K66), 6 = roll the weather again at once. Only one event per game unless
// the players agreed otherwise (`occurred` stops the check). A campaign may
// agree on the weather changing from 5+ (`weatherFrom`).
const EVENT = "Zdarzenie losowe! Rzuć K66 na tabelę poniżej.";
const WEATHER = "Zmiana pogody: natychmiast rzuć na pogodę.";
export default function RandomEventRoller({ fixedArea = "", canSave = true, onSave, occurred = false, limit = true, weather, onWeather, weatherHints = [], weatherFrom = 6 }) {
  const [area, setArea] = useState(fixedArea);
  const [check, setCheck] = useState(null);
  const rollCheck = (v) => setCheck(v === "" || v == null ? null : Math.max(1, Math.min(6, Number(v))));
  const showTable = check === 1 || !onWeather;
  const weatherRoll = check != null && check >= weatherFrom;
  const weatherText = weatherFrom >= 6 ? "6" : `${weatherFrom}+`;
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
    <section className="hub-card" aria-label="Zdarzenia losowe">
      <h3>Zdarzenia losowe</h3>
      {occurred && limit ? (
        <p className="hub-notice">
          W tej grze wystąpiło już zdarzenie losowe. Przy limicie jednego zdarzenia nie wykonuje się dalszych
          rzutów K6, więc pogoda też już się nie zmieni.
        </p>
      ) : (
        <div className="event-check">
          <p className="hub-muted">
            Przed każdą swoją turą gracz rzuca K6: 1 = zdarzenie losowe, {weatherText} = rzut na pogodę.
            {limit ? " Po pierwszym zdarzeniu rzuty się kończą." : " Bez limitu zdarzeń."}
          </p>
          <div className="hub-dice-row">
            <label className="hub-field hub-die">
              K6 przed turą
              <input type="number" min="1" max="6" inputMode="numeric" value={check ?? ""} onChange={(e) => rollCheck(e.target.value)} />
            </label>
            <button type="button" className="button button-secondary" onClick={() => rollCheck(1 + Math.floor(Math.random() * 6))}>
              <i className="fa-solid fa-dice" aria-hidden="true"></i> Rzuć K6
            </button>
          </div>
          {check != null && (
            <p className={check === 1 || weatherRoll ? "hub-notice" : "hub-muted"} role="status">
              K6: {check} · {check === 1 ? EVENT : weatherRoll ? WEATHER : "Nic się nie dzieje."}
            </p>
          )}
          {weatherRoll && onWeather && (
            <WeatherRoller
              key={`w-${check}`}
              title="Nowa pogoda"
              value={weather}
              startEditing
              hints={weatherHints}
              canEdit={canSave}
              onSave={(w) => Promise.resolve(onWeather(w, check)).then((ok) => { if (ok !== false) setCheck(null); return ok; })}
            />
          )}
        </div>
      )}
      {!fixedArea && showTable && (
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
      {area && showTable && <p className="hub-muted">Tabela: {AREAS[area]} (s. 399–404). Każde zdarzenie daje kompanii +1 łup w eksploracji.</p>}
      {area && showTable && (
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
      {showTable && <div className="hub-dice-row">
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
      </div>}
      {showTable && event && (
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
