import React, { Suspense, lazy, useState } from "react";

// The random event tables are large; load them only when the panel is used.
const RandomEventRoller = lazy(() => import("../campaignHub/RandomEventRoller"));

// The live round; it is also the round the skirmish ended in.
export function RoundCounter({ battle, setBattle }) {
  const round = battle.playRound || 1;
  const setRound = (value) => {
    const next = Math.max(1, value);
    setBattle({ ...battle, playRound: next, round: next });
  };
  return (
    <div className="campaign-play-round">
      <span>Runda</span>
      <button type="button" aria-label="Runda: mniej" disabled={round <= 1} onClick={() => setRound(round - 1)}>
        −
      </button>
      <output aria-live="polite">{round}</output>
      <button type="button" aria-label="Runda: więcej" onClick={() => setRound(round + 1)}>
        +
      </button>
    </div>
  );
}

// Live record of a skirmish played without a shared campaign: the band's
// log (taps on the tracker add to it) and random events.
export default function PlayPanel({ battle, setBattle, addLog, weatherHints = [] }) {
  const [note, setNote] = useState("");
  const [events, setEvents] = useState(false);
  const log = battle.log || [];
  return (
    <section className="campaign-play" aria-label="Dziennik i zdarzenia">
      <form
        className="campaign-play-note"
        onSubmit={(e) => {
          e.preventDefault();
          if (!note.trim()) return;
          addLog(note.trim());
          setNote("");
        }}
      >
        <input
          aria-label="Wpis w dzienniku"
          placeholder="Notatka, np. Mecenas podnosi znacznik kosztowności"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="button button-secondary" disabled={!note.trim()}>
          Dodaj
        </button>
      </form>
      <details className="campaign-section" open={log.length > 0}>
        <summary>Dziennik przebiegu ({log.length})</summary>
        {log.length ? (
          <ul className="campaign-play-log">
            {[...log].reverse().map((entry) => (
              <li key={entry.id}>
                <span className="campaign-play-log-round">R{entry.round}</span>
                <span>{entry.text}</span>
                <button
                  type="button"
                  aria-label="Usuń wpis"
                  onClick={() => setBattle({ ...battle, log: log.filter((x) => x.id !== entry.id) })}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="campaign-muted">Wpisy pojawiają się po dotknięciu modelu, licznika albo dodaniu notatki.</p>
        )}
      </details>
      <details className="campaign-section" onToggle={(e) => setEvents(e.currentTarget.open)}>
        <summary>Zdarzenia losowe</summary>
        {events && (
          <Suspense fallback={<p className="campaign-source">Wczytywanie tabel…</p>}>
            <label className="campaign-check event-limit">
              <input
                type="checkbox"
                checked={battle.eventLimit === true}
                onChange={(e) => setBattle({ ...battle, eventLimit: e.target.checked })}
              />
              Limit: jedno zdarzenie losowe na grę
            </label>
            <label className="campaign-check event-limit">
              <input
                type="checkbox"
                checked={battle.weatherFrom !== 6}
                onChange={(e) => setBattle({ ...battle, weatherFrom: e.target.checked ? 5 : 6 })}
              />
              Zmiana pogody na 5+ (podręcznik: tylko na 6)
            </label>
            <RandomEventRoller
              limit={battle.eventLimit === true}
              weatherFrom={battle.weatherFrom === 6 ? 6 : 5}
              fixedArea={battle.scenarioRecord?.area || ""}
              occurred={(battle.log || []).some((e) => /^Zdarzenie losowe/.test(e.text))}
              weather={battle.weather}
              weatherHints={weatherHints}
              onWeather={(weather, roll = 6) => {
                setBattle({
                  ...battle,
                  weather,
                  log: [
                    ...(battle.log || []),
                    { id: `${Date.now()}-w`, round: battle.playRound || 1, text: `Zmiana pogody (K6: ${roll}): ${weather.name} (${weather.total})` },
                  ],
                });
                return true;
              }}
              onSave={(event) => {
                addLog(`Zdarzenie losowe (${event.code}): ${event.name}`);
                return true;
              }}
            />
          </Suspense>
        )}
      </details>
    </section>
  );
}
